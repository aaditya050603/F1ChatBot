"use client";

import Image from "next/image"
import f1GPTLogo from "./assets/F1gpt.png"
import  {useChat}  from "ai/react";   // ✅ only works if v5 is installed
import Bubbles from "./components/Bubble";
import {Message}  from "ai";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionRow from "./components/PromptSuggestionRow";

const Home = () => {
    const { append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat({
    api: "/api/chat",})

    const noMessages = !messages || messages.length === 0


    const handlePrompt = (promptText: string) => {
    const msg: Message = {
    id: crypto.randomUUID(),
    content: promptText,
    role: "user",
  }
  append(msg)
}


    return (
        <main>
            <Image src={f1GPTLogo} alt="F1GPT Logo" width={250}  />
            <section className={noMessages ? "" : "populated"}>   
                {noMessages ? (
                    <> 
                        <p className="starter-text">
                            Welcome to F1GPT! Ask me anything about Formula 1. We hope you enjoy your experience with F1GPT!
                        </p>

                        <br />
                        <PromptSuggestionRow onPromptClick={handlePrompt}/>

                    </>

                ) : (
                    <>
                    {messages.map((message, index) => <Bubbles key={`message-${index}`} message={message} />)}
                    {isLoading &&<LoadingBubble/>}

                    </>

                )}
                
            </section>

            <form onSubmit={handleSubmit}>
                    <input className="question-box" 
                    onChange={handleInputChange} 
                    value={input} 
                    placeholder="Ask me anything about Formula 1..."
                    suppressHydrationWarning
                     />
                    <input type="submit"  suppressHydrationWarning  />

                    
                </form>   
        </main>
    )
}

export default Home;