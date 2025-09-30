import { FC } from "react";
import { Message } from "ai"; // if you’re using ai/react v5

interface BubbleProps {
  message: Message;
}

const Bubbles: FC<BubbleProps> = ({ message }) => {
  const { content, role } = message;
  return <div className={`bubbles ${role}`}>{content}</div>;
};

export default Bubbles;
