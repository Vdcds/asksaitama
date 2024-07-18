"use client"
import React, { useState, useRef } from 'react';
import { MessageCircle, Loader2, Share2, ToggleLeft, ToggleRight } from 'lucide-react';

const SaitamaAdvice: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSeriousMode, setIsSeriousMode] = useState<boolean>(false);
  const saitamaRef = useRef<HTMLDivElement>(null);

  const askSaitama = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, seriousMode: isSeriousMode }),
      });
      const data = await res.json();
      setResponse(data.response || getDefaultResponse());
    } catch (error) {
      console.error('Error:', error);
      setResponse(getDefaultResponse());
    }
    setIsLoading(false);
    setInput('');
  };

  const getDefaultResponse = () => {
    if (isSeriousMode) {
      return "I'll eliminate any threat.";
    } else {
      return "OK.";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askSaitama();
  };

  const shareSaitama = async () => {
    if (saitamaRef.current) {
      try {
        const canvas = await import('html2canvas').then(mod => mod.default(saitamaRef.current));
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'saitama-advice.png', { type: 'image/png' });
            if (navigator.share) {
              navigator.share({
                files: [file],
                title: isSeriousMode ? 'Serious Saitama Advice' : 'Saitama\'s Casual Advice',
                text: isSeriousMode ? 'Saitama got serious!' : 'Check out this advice from Saitama!'
              }).catch(console.error);
            } else {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'saitama-advice.png';
              a.click();
              URL.revokeObjectURL(url);
            }
          }
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const toggleSeriousMode = () => {
    setIsSeriousMode(!isSeriousMode);
    setResponse(''); // Clear previous response when toggling modes
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-500 ${isSeriousMode ? 'bg-gray-800' : 'bg-yellow-100'}`}>
      <div
        ref={saitamaRef}
        className={`w-full max-w-2xl rounded-lg shadow-lg overflow-hidden transition-all duration-500 ${
          isSeriousMode ? 'bg-gray-700 border-red-600' : 'bg-white border-black'
        }`}
        style={{border: '8px solid', boxShadow: isSeriousMode ? '0 0 20px rgba(255, 0, 0, 0.5)' : '8px 8px 0px #000'}}
      >
        <div className={`p-4 text-center transition-all duration-500 ${isSeriousMode ? 'bg-red-700' : 'bg-red-500'}`}>
          <h1
            className={`text-4xl font-bold text-white transition-all duration-500 ${
              isSeriousMode ? 'font-serif' : 'font-comic'
            }`}
            style={{textShadow: isSeriousMode ? '2px 2px 4px rgba(0,0,0,0.5)' : '2px 2px 0px #000'}}
          >
            {isSeriousMode ? 'SERIOUS SAITAMA' : 'ASK SAITAMA'}
          </h1>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div
            className="w-64 h-64 bg-contain bg-no-repeat bg-center mb-6 transition-all duration-500"
            style={{
              backgroundImage: isSeriousMode
                ? "url('https://pngpix.com/images/high/pixel-art-one-punch-man-saitama-q8ctsi6jei7zq7dy.webp')"
                : "url('https://preview.redd.it/xrs6qj7fezy51.png?auto=webp&s=0470fe27a6bedbaece5a97b24857f98eaa763805')",
              filter: isSeriousMode ? 'grayscale(100%) contrast(120%)' : 'none'
            }}
          ></div>

          <form onSubmit={handleSubmit} className="w-full relative mb-4">
            <input
              type="text"
              placeholder={isSeriousMode ? "State your concern." : "Ask Away I have a sell to look onto"}
              className={`w-full p-3 pr-12 rounded-full focus:outline-none transition-all duration-500 ${
                isSeriousMode
                  ? 'text-white bg-gray-600 border-red-600 placeholder-gray-400'
                  : 'text-gray-700 border-black placeholder-gray-500'
              }`}
              style={{
                fontFamily: isSeriousMode ? 'serif' : 'Comic Sans MS, cursive',
                border: '4px solid'
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-500 ${
                isSeriousMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-yellow-400 text-black hover:bg-yellow-500'
              }`}
              style={{border: '3px solid', borderColor: isSeriousMode ? '#e53e3e' : '#000'}}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <MessageCircle size={20} />
              )}
            </button>
          </form>

          {response && (
            <div
              className={`mt-4 p-4 rounded-lg w-full transition-all duration-500 ${
                isSeriousMode
                  ? 'bg-gray-600 text-red-500 border-red-600'
                  : 'bg-yellow-200 text-black border-black'
              }`}
              style={{border: '4px solid'}}
            >
              <p className={`text-xl font-bold text-center ${isSeriousMode ? 'font-serif' : 'font-comic'}`}>
                {response}
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={shareSaitama}
              className={`p-2 rounded-full transition-all duration-500 flex items-center ${
                isSeriousMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              style={{border: '3px solid', borderColor: isSeriousMode ? '#e53e3e' : '#000'}}
            >
              <Share2 size={20} className="mr-2" />
              Share
            </button>
            <button
              onClick={toggleSeriousMode}
              className={`p-2 rounded-full transition-all duration-500 flex items-center ${
                isSeriousMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
              style={{border: '3px solid', borderColor: isSeriousMode ? '#e53e3e' : '#000'}}
            >
              {isSeriousMode ? <ToggleRight size={20} className="mr-2" /> : <ToggleLeft size={20} className="mr-2" />}
              {isSeriousMode ? 'Serious Mode' : 'Normal Mode'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaitamaAdvice;