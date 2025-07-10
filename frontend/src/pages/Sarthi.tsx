import { useState } from "react";
import { Send, X, Mic, Globe } from "lucide-react";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voicePopup, setVoicePopup] = useState(false);
  const [languagePopup, setLanguagePopup] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Language options
  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
    { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
    { code: "ur", name: "Urdu", nativeName: "اردو" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "zh", name: "Chinese", nativeName: "中文" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "ko", name: "Korean", nativeName: "한국어" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
    { code: "pt", name: "Portuguese", nativeName: "Português" },
    { code: "ru", name: "Russian", nativeName: "Русский" },
  ];

  const toggleChat = () => setIsOpen(!isOpen);
  const toggleVoicePopup = () => {
    stopListening();
    setTranscript("");
    setVoicePopup((prev) => !prev);
  };
  const toggleLanguagePopup = () => setLanguagePopup((prev) => !prev);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://iiit-naya-raipur-hakathon.vercel.app/api/ai/chatboat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          newMessage,
          { sender: "bot", text: data.data },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          newMessage,
          { sender: "bot", text: "Error retrieving response." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        newMessage,
        { sender: "bot", text: "Failed to connect to server." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Voice recognition setup
  let recognition;
  if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal)
          setTranscript((prev) => prev + result[0].transcript + " ");
        else interim += result[0].transcript;
      }
      setTranscript((prev) => prev + interim);
    };

    recognition.onerror = (event) => {
      console.error("Voice Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
  }

  const startListening = () => {
    setTranscript("");
    setIsListening(true);
    recognition?.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition?.stop();
  };

  const handleMicClick = () => {
    isListening ? stopListening() : startListening();
  };

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setLanguagePopup(false);

    // Here you can implement the actual translation logic
    // For example, you might want to call a translation service
    console.log(`Language changed to: ${languageCode}`);

    // You can also trigger a page translation here
    // translatePage(languageCode);
  };

  const getCurrentLanguage = () => {
    return (
      languages.find((lang) => lang.code === selectedLanguage) || languages[0]
    );
  };

  return (
    <>
      {/* Chat Button */}
      <button
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full shadow-lg p-2 z-50"
        onClick={toggleChat}
      >
        {isOpen ? (
          <X size={20} />
        ) : (
          <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
        )}
      </button>

      {/* Voice Button */}
      <button
        className="fixed bottom-6 right-24 bg-green-600 text-white rounded-full shadow-lg p-3 z-50 hover:bg-green-700"
        onClick={toggleVoicePopup}
      >
        <Mic size={20} />
      </button>

      {/* Language Button */}
      <button
        className="fixed bottom-6 right-40 bg-green-600 text-white rounded-full shadow-lg p-3 z-50 hover:bg-green-700"
        onClick={toggleLanguagePopup}
      >
        <Globe size={20} />
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
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "200ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "400ms" }}
                  />
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

      {/* Voice Popup */}
      {voicePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl w-full max-w-md relative">
            <button
              onClick={toggleVoicePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-xl font-bold"
            >
              ×
            </button>
            <div className="flex flex-col items-center justify-center space-y-4">
              <button
                onClick={handleMicClick}
                className={`p-4 rounded-full border-4 ${
                  isListening
                    ? "border-red-500 animate-pulse"
                    : "border-gray-400"
                }`}
              >
                <Mic className="w-8 h-8 text-gray-700 dark:text-gray-200" />
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isListening ? "Listening..." : "Click the mic to start"}
              </p>
              {transcript && (
                <div className="w-full mt-4 bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm text-gray-700 dark:text-gray-100">
                  {transcript}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Language Popup */}
      {languagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl w-full max-w-md max-h-96 relative">
            <button
              onClick={toggleLanguagePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-xl font-bold"
            >
              ×
            </button>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Select Language
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current: {getCurrentLanguage().nativeName}
              </p>
            </div>
            <div className="overflow-y-auto max-h-64 space-y-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    selectedLanguage === language.code
                      ? "bg-green-100 dark:bg-green-800 border-2 border-green-500"
                      : "bg-gray-50 dark:bg-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 dark:text-gray-200">
                      {language.name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {language.nativeName}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
