'use client';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();


  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const startLoading = () => {
      setLoading(true);
      setProgress(0);
      
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10; // Increased from 5 to 10
        });
      }, 50); // Reduced from 100 to 50
    };

    const completeLoading = () => {
      clearInterval(progressInterval);
      setProgress(100);
      
      timeoutId = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200); // Reduced from 400 to 200
    };

    startLoading();
    
    // Reduced timeout from 800 to 500
    const loadTimeout = setTimeout(completeLoading, 500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      clearTimeout(loadTimeout);
    };
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div 
        className="h-1 bg-[#1D201F] transition-all duration-300 ease-out"
        style={{ 
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1 
        }}
      />
    </div>
  );
}
