import "./global.css";

export const metadata = {
  title: "F1GPT",
  description: "The place to get all your F1 questions answered.",
};
const RootLayout = ({children }) => {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  };

export default RootLayout;

