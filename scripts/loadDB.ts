import { DataAPIClient } from "@datastax/astra-db-ts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import OpenAI from "openai";
import puppeteer from "puppeteer";
import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

// ✅ OpenAI client
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Sample F1 URLs
const f1Data = [
  "https://en.wikipedia.org/wiki/Formula_One",
  "https://www.skysports.com/f1/news/12433/13115256/lewis-hamilton-says-move-to-ferrari-from-mercedes-doesn-t-need-vindicating-amid-irritation-at-coverage",
  "https://www.formula1.com/en/latest/all",
  "https://www.forbes.com/sites/brettknight/2023/11/29/formula-1s-highest-paid-drivers-2023/?sh=3d2c0f3b6b4f",
  "https://www.autosport.com/f1/news/history-of-female-f1-drivers-including-grand-prix-starters-and-test-drivers/10584871/",
  "https://en.wikipedia.org/wiki/2023_Formula_One_World_Championship",
  "https://en.wikipedia.org/wiki/2022_Formula_One_World_Championship",
  "https://en.wikipedia.org/wiki/List_of_Formula_One_World_Drivers%27_Champions",
  "https://en.wikipedia.org/wiki/2024_Formula_One_World_Championship",
  "https://www.formula1.com/en/results.html/2024/races.html",
  "https://www.formula1.com/en/racing/2024.html",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(ASTRA_DB_API_ENDPOINT!, { keyspace: ASTRA_DB_NAMESPACE! });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

// ✅ OpenAI embedding fetcher
async function getOpenAIEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

// ✅ Create Astra collection (after dropping old one)
const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
  // try {
  //   console.log("Dropping old collection if it exists...");
  //   await db.dropCollection(ASTRA_DB_COLLECTION!);
  // } catch (err: any) {
  //   console.warn("No existing collection to drop (or already deleted).");
  // }

  const res = await db.createCollection(ASTRA_DB_COLLECTION!, {
    vector: {
      dimension: 1536, // keep as in your screenshot
      metric: similarityMetric,
    },
  });

  console.log("New collection created:", res);
};

// ✅ Scrape page using Puppeteer
async function scrapePage(url: string): Promise<string> {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Get only visible text
    const text = await page.evaluate(() => document.body.innerText);

    await browser.close();

    return text.replace(/\s+/g, " ").trim();
  } catch (err) {
    console.error("Error fetching URL:", url, err);
    return "";
  }
}

// ✅ Load sample data and insert embeddings into Astra
const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION!);

  for await (const url of f1Data) {
    const content = await scrapePage(url);
    if (!content) continue; // skip empty pages
    const chunks = await splitter.splitText(content);

    for await (const chunk of chunks) {
      try {
        const vector = await getOpenAIEmbedding(chunk);
        const res = await collection.insertOne({ text: chunk, $vector: vector });
        console.log("Inserted chunk:", res);
      } catch (err: any) {
        console.error("Error processing chunk:", err.message);
      }
    }
  }
};

// ✅ Run
createCollection().then(() => loadSampleData());
