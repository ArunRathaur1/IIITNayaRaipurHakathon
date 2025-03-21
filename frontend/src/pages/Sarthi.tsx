import { useState } from "react";
import { Send, X } from "lucide-react";
import image from './bot.png'
const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/ai/chatboat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages([
          ...messages,
          newMessage,
          { sender: "bot", text: data.data },
        ]);
      } else {
        setMessages([
          ...messages,
          newMessage,
          { sender: "bot", text: "Error retrieving response." },
        ]);
      }
    } catch (error) {
      setMessages([
        ...messages,
        newMessage,
        { sender: "bot", text: "Failed to connect to server." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 bg-green-600 text-white  rounded-full shadow-lg  transition z-50"
        onClick={toggleChat}
      >
        {isOpen ? <X size={12} /> : <img src={image} style={{width:"100px"}}></img>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-gray-800 rounded-lg shadow-lg flex flex-col z-40 overflow-hidden">
          <div className="bg-green-600 p-3 text-white font-bold flex justify-between items-center">
            <span>Sarthi AI Assistant</span>
            <button onClick={toggleChat} className="text-white">
              <X size={18} />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 border-b border-gray-700 bg-gray-700 flex flex-col">
            {messages.length === 0 && (
              <div className="text-gray-400 text-center my-auto">
                <p>Welcome to Sarthi!</p>
                <p className="mt-2">How can I help you today?</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 my-1 rounded-lg max-w-xs ${
                  msg.sender === "user"
                    ? "bg-green-500 text-white self-end ml-auto"
                    : "bg-gray-600 text-white self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="bg-gray-600 text-white self-start p-3 my-1 rounded-lg max-w-xs">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "600ms" }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex p-2 bg-gray-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-2 border border-gray-600 rounded-l-md bg-gray-700 text-white placeholder-gray-400"
              placeholder="Ask Sarthi something..."
            />
            <button
              onClick={sendMessage}
              className="px-3 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
