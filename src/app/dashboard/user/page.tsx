'use client';
import { useSearchParams } from 'next/navigation';
import { GoArrowLeft } from "react-icons/go";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function UserProfile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('id');
  const source = searchParams.get('source');
  const [isRequesting, setIsRequesting] = useState(false);

  // Updated mock user data
  const users = [
    { 
      id: 1, 
      image: "https://randomuser.me/api/portraits/men/1.jpg", 
      name: "User 1", 
      age: 28,
      gender: "Male",
      bio: "Software Developer", 
      location: "New York",
      distance: "500m",
      followers: 1234, 
      following: 567 
    },
    { 
      id: 2, 
      image: "https://randomuser.me/api/portraits/women/2.jpg", 
      name: "User 2",
      age: 25,
      gender: "Female", 
      bio: "UI Designer", 
      location: "San Francisco",
      distance: "500m",
      followers: 2345, 
      following: 678 
    },
  ];

  const user = users.find(u => u.id === Number(userId));

  const handleRequest = () => {
    setIsRequesting(true);
    // Simulate API call
    setTimeout(() => {
      setIsRequesting(false);
      router.push(`/dashboard/user/chat?id=${userId}`);
    }, 2000);
  };

  const handleAccept = () => {
    // Handle accept logic
    router.back();
  };

  const handleReject = () => {
    // Handle reject logic
    router.back();
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 w-full top-[64px] left-0 fixed z-40">
      <div className="w-full h-[90vh] mx-auto max-w-2xl">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <GoArrowLeft size={24} className="mr-2" /> Back
        </button>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 h-[calc(100%-4rem)] flex flex-col">
          <div className="flex-1 flex flex-col items-center space-y-6">
            {/* Profile Image */}
            <div className="relative">
              <img 
                src={user.image} 
                alt={user.name} 
                className="w-40 h-40 rounded-full border-4 border-[#1D201F] object-cover shadow-lg"
              />
              <div className="absolute -bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
            </div>

            {/* User Info - Reorganized */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-[#061A40]">{user.name}</h1>
              <div className="space-y-2">
                <p className="text-gray-600 text-lg">{user.age} years • {user.gender}</p>
                <div className="flex items-center justify-center text-gray-500 text-lg">
                  <FaMapMarkerAlt className="text-gray-500 mr-1" />
                  <span>{user.location} • {user.distance} away</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {source === 'profile' ? (
              <div className="mt-auto flex gap-4 w-full justify-center">
                <motion.button
                  onClick={handleAccept}
                  className="w-32 h-12 bg-green-500 text-white text-lg font-semibold rounded-xl
                    hover:bg-opacity-90 transition-all transform hover:scale-105"
                  whileTap={{ scale: 0.95 }}
                >
                  Accept
                </motion.button>
                <motion.button
                  onClick={handleReject}
                  className="w-32 h-12 bg-red-500 text-white text-lg font-semibold rounded-xl
                    hover:bg-opacity-90 transition-all transform hover:scale-105"
                  whileTap={{ scale: 0.95 }}
                >
                  Reject
                </motion.button>
              </div>
            ) : (
              <motion.button 
                onClick={handleRequest}
                disabled={isRequesting}
                className="mt-auto w-64 h-16 bg-[#1D201F] text-white text-xl font-semibold rounded-xl
                  hover:bg-opacity-90 transition-all transform hover:scale-105 disabled:opacity-80
                  disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
                whileTap={{ scale: 0.95 }}
              >
                {isRequesting ? (
                  <div className="flex items-center justify-center space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{
                          y: ["0%", "-100%", "0%"],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <span>Send Request</span>
                )}
                {isRequesting && (
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    animate={{
                      x: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
