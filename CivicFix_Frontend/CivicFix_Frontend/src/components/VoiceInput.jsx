import { useEffect, useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';

const ERROR_MESSAGES = {
  'not-allowed': 'Microphone permission was denied. You can type your complaint instead.',
  'service-not-allowed': 'Voice recognition is blocked in this browser. You can type your complaint instead.',
  'no-speech': 'No speech was detected. Try again, or type your complaint.',
  'audio-capture': 'No microphone was found on this device.',
  network: 'Voice recognition needs an internet connection in this browser.',
};

export default function VoiceInput({ onTranscript, disabled }) {
  const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const recRef = useRef(null);

  useEffect(() => () => recRef.current?.abort?.(), []);

  if (!SR) {
    return (
      <p className="notice notice-info small" role="status">
        Voice input is not supported in this browser. Please type your complaint in the description box.
      </p>
    );
  }

  function start() {
    setError('');
    const rec = new SR();
    rec.lang = navigator.language || 'en-US';
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = Array.from(e.results)
        .slice(e.resultIndex)
        .filter((r) => r.isFinal)
        .map((r) => r[0].transcript)
        .join(' ')
        .trim();
      if (text) onTranscript(text);
    };
    rec.onerror = (e) => {
      setError(ERROR_MESSAGES[e.error] || 'Voice input stopped unexpectedly. You can type instead.');
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    try {
      rec.start(); // the browser asks for microphone permission here
      setListening(true);
    } catch {
      setError('Voice input could not start. Please try again.');
    }
  }

  function stop() {
    recRef.current?.stop();
    setListening(false);
  }

  return (
    <div className="voice-box">
      <div className="btn-row">
        {!listening ? (
          <button type="button" className="btn btn-secondary" onClick={start} disabled={disabled}>
            <Mic size={18} aria-hidden="true" />Speak Your Complaint
          </button>
        ) : (
          <button type="button" className="btn btn-danger" onClick={stop}>
            <Square size={16} aria-hidden="true" />Stop recording
          </button>
        )}
        {listening && (
          <span className="recording" role="status">
            <span className="rec-dot" aria-hidden="true" />Listening. Speak now.
          </span>
        )}
      </div>
      <p className="hint">Your words are added to the description, where you can edit them. Voice recordings are not saved.</p>
      {error && <p className="error-text" role="alert">{error}</p>}
    </div>
  );
}
