"use client";

import { useState, useRef, useEffect } from "react";

// 語音輸入按鈕:技師手沾油時可以直接說話輸入文字
// onResult(text) 會在辨識出一段話之後被呼叫,由外部決定要 append 到哪個欄位
export default function VoiceInputButton({ onResult }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "zh-TW";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, [onResult]);

  if (!supported) return null;

  function toggle() {
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title="語音輸入"
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full border transition-colors ${
        listening
          ? "bg-red-500 border-red-500 text-white animate-pulse"
          : "border-line text-ink/50 hover:border-steel hover:text-steel"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3z" />
        <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.93V20H9a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07A7 7 0 0019 11z" />
      </svg>
    </button>
  );
}
