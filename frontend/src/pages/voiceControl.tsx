import React, { useState, useEffect } from "react";
import { Mic } from "lucide-react";

export default function VoiceControl() {
  const [isListening, setIsListening] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [transcript, setTranscript] = useState("");

  let recognition;

  if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          setTranscript((prev) => prev + result[0].transcript + " ");
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      setTranscript((prev) => prev + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const startListening = () => {
    setTranscript("");
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Voice Control</h1>
      <button
        onClick={() => setShowPopup(true)}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        Start Voice Command
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl w-full max-w-md relative">
            <button
              onClick={() => {
                stopListening();
                setShowPopup(false);
                setTranscript("");
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white text-xl font-bold"
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
    </div>
  );
}
