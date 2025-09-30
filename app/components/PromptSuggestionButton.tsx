import { FC } from "react";

interface PromptSuggestionButtonProps {
  text: string;
  onClick: () => void;
}

const PromptSuggestionButton: FC<PromptSuggestionButtonProps> = ({ text, onClick }) => (
  <button className="prompt-suggestion-button" onClick={onClick}>
    {text}
  </button>
);

export default PromptSuggestionButton;
