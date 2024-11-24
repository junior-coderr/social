'use client';
import { IoSendSharp } from "react-icons/io5";
import { GoArrowLeft } from "react-icons/go";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import DoodleBackground from '@/components/custom/DoodleBackground';

// Add this new component for typing animation
const TypeWriter = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setIsAnimating(true);
    
    // Add delay before starting new text
    const startTimeout = setTimeout(() => {
      setDisplayText('');
      setCurrentIndex(0);
      setCurrentWord(0);
      setIsAnimating(false);
    }, 500); // Wait for fade out

    return () => clearTimeout(startTimeout);
  }, [text]);

  useEffect(() => {
    if (isAnimating) return; // Don't start typing if we're animating out

    const words = text.split(' ');
    if (currentWord < words.length) {
      const word = words[currentWord];
      if (currentIndex < word.length) {
        const timer = setTimeout(() => {
          setDisplayText(prev => prev + word[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 100); // Adjust speed of letters
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setDisplayText(prev => prev + ' ');
          setCurrentWord(prev => prev + 1);
          setCurrentIndex(0);
        }, 300); // Pause between words
        return () => clearTimeout(timer);
      }
    }
  }, [text, currentIndex, currentWord, isAnimating]);

  useEffect(() => {
    if (!isAnimating && currentWord >= text.split(' ').length) {
      // Text is fully displayed
      setTimeout(() => onComplete(), 1500); // Wait longer before completion
    }
  }, [text, currentWord, isAnimating, onComplete]);

  return (
    <div className="flex flex-col items-center">
      <span className={`text-4xl font-bold tracking-wide text-gray-900 transition-all duration-500
        ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
      >
        {displayText}
      </span>
      {currentWord >= text.split(' ').length && (
        <div className="mt-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
        </div>
      )}
    </div>
  );
};

export default function ChatRoom() {
  const [message, setMessage] = useState('');
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [completedMessages, setCompletedMessages] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  // Mock user data - should match with the user profile data
  const user = {
    id: Number(userId),
    image: `https://randomuser.me/api/portraits/men/${userId}.jpg`,
    name: `User ${userId}`,
  };

  const handleSend = () => {
    if (message.trim()) {
      if (currentMessage) {
        // If there's a current message, just queue the new one
        setMessageQueue(prev => [...prev, message]);
      } else {
        // If no current message, show it immediately
        setCurrentMessage(message);
      }
      setMessage('');
    }
  };

  const handleMessageComplete = () => {
    if (currentMessage) {
      // Add current message to completed messages
      setCompletedMessages(prev => [...prev, currentMessage]);
    }
    
    // Only clear current message if there's another one in queue
    if (messageQueue.length > 0) {
      setTimeout(() => {
        setCurrentMessage(messageQueue[0]);
        setMessageQueue(prev => prev.slice(1));
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen bg-[#ffffff] fixed w-full top-[0px] left-0 z-50">
      <DoodleBackground className="opacity-50" />
      
      {/* Header - add bg-white for better contrast */}
      <div className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <GoArrowLeft size={24} className="mr-2" />
        </button>
        <div className="flex items-center gap-3">
          <span className="font-semibold">{user.name}</span>
          <img 
            src={user.image} 
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-[#1D201F] object-cover"
          />
        </div>
      </div>

      {/* Messages area */}
      <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-8">
          {/* Show last completed message if no current message */}
          {!currentMessage && completedMessages.length > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold tracking-wide text-gray-900">
                {completedMessages[completedMessages.length - 1]}
              </span>
              <div className="mt-2">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              </div>
            </div>
          )}

          {/* Current animating message */}
          {currentMessage && (
            <div className="transform transition-all duration-500 text-center">
              <TypeWriter 
                text={currentMessage} 
                onComplete={handleMessageComplete} 
              />
              {messageQueue.length > 0 && (
                <div className="mt-4 text-gray-400 text-sm">
                  {messageQueue.length} message{messageQueue.length > 1 ? 's' : ''} queued
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 w-full p-6 pl-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 bg-white shadow-lg backdrop-blur-sm rounded-2xl p-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-lg"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-50"
          >
            <IoSendSharp size={24} className="transform transition-all duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Updated animations
const animations = `
  @keyframes messageFloat {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const styles = document.createElement('style');
styles.innerHTML = animations;
document.head.appendChild(styles);
