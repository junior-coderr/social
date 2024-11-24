'use client';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    if (isLoading) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [isLoading]);

  return (
    <motion.button 
      onClick={handleClick}
      initial={false}
      animate={{
        width: isLoading ? "11rem" : "10rem",
        height: isLoading ? "11rem" : "10rem",
        boxShadow: isLoading ? "0 0 15px rgba(167,139,250,0.3)" : "none"
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
      className={`
        relative z-10
        rounded-full
        flex items-center justify-center
        text-xl font-medium
        overflow-hidden
        border border-white/20
        bg-gradient-to-br from-violet-100 via-cyan-100 to-rose-100
        after:absolute
        after:inset-[2px]
        after:rounded-full
        after:bg-gradient-to-br
        after:from-white/90
        after:to-white/70
        after:opacity-90
        ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
      `}
    >
      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="text-gray-700 font-semibold">
          Search
        </span>
        {isLoading && (
          <motion.div 
            className="flex gap-1"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gray-700"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
      
      {isLoading && (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full border-t-2 border-violet-300 rounded-full" />
        </motion.div>
      )}
    </motion.button>
  );
}
