import { FC } from "react";
import PromptSuggestionButton from "./PromptSuggestionButton";

interface PromptSuggestionRowProps {
  onPromptClick: (prompt: string) => void;
}

const PromptSuggestionRow: FC<PromptSuggestionRowProps> = ({ onPromptClick }) => {
  const prompts: string[] = [
    "Who is the current world champion in Formula 1?",
    "What are the top 5 teams in the 2024 season so far?",
    "Can you give me a summary of the 2024 Monaco Grand Prix?",
    "Who has won the most championships in Formula 1 history?",
    "Who will be the newest driver in 2024?"
  ];

  return (
    <div className="prompt-suggestion-row">
      {prompts.map((prompt) => (
        <PromptSuggestionButton
          key={prompt}
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionRow;
