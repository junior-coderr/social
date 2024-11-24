'use client';
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useAppSelector } from '@/redux/hooks';
import UserDetailsDrawer from './UserDetailsDrawer';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const funMode = useAppSelector((state) => state.ui.funMode);
  const [selectedUser, setSelectedUser] = useState<null | { id: number; image: string; name: string; }>(null);

  const users = [
    { id: 1, image: "https://randomuser.me/api/portraits/men/1.jpg", name: "User 1", price: "$50" },
    { id: 2, image: "https://randomuser.me/api/portraits/women/2.jpg", name: "User 2", price: "$75" },
    { id: 3, image: "https://randomuser.me/api/portraits/men/3.jpg", name: "User 3", price: "$50" },
    { id: 4, image: "https://randomuser.me/api/portraits/women/4.jpg", name: "User 4", price: "$75" },
    { id: 5, image: "https://randomuser.me/api/portraits/men/5.jpg", name: "User 5", price: "$50" },
    { id: 6, image: "https://randomuser.me/api/portraits/women/6.jpg", name: "User 6", price: "$75" },
    { id: 7, image: "https://randomuser.me/api/portraits/men/7.jpg", name: "User 7", price: "$50" },
    { id: 8, image: "https://randomuser.me/api/portraits/women/8.jpg", name: "User 8", price: "$75" },
    { id: 9, image: "https://randomuser.me/api/portraits/men/9.jpg", name: "User 9", price: "$50" },
    { id: 1, image: "https://randomuser.me/api/portraits/men/1.jpg", name: "User 1", price: "$50" },
    { id: 2, image: "https://randomuser.me/api/portraits/women/2.jpg", name: "User 2", price: "$75" },
    { id: 3, image: "https://randomuser.me/api/portraits/men/3.jpg", name: "User 3", price: "$50" },
    { id: 4, image: "https://randomuser.me/api/portraits/women/4.jpg", name: "User 4", price: "$75" },
    { id: 5, image: "https://randomuser.me/api/portraits/men/5.jpg", name: "User 5", price: "$50" },
    { id: 6, image: "https://randomuser.me/api/portraits/women/6.jpg", name: "User 6", price: "$75" },
    { id: 7, image: "https://randomuser.me/api/portraits/men/7.jpg", name: "User 7", price: "$50" },
    { id: 8, image: "https://randomuser.me/api/portraits/women/8.jpg", name: "User 8", price: "$75" },
    { id: 9, image: "https://randomuser.me/api/portraits/men/9.jpg", name: "User 9", price: "$50" },
  ];

  const handleAvatarClick = (userId: number) => {
    if (isExpanded) {
      router.push(`/dashboard/user?id=${userId}&source=footer`);
    }
  };

  return (
    <>
      <footer 
        onClick={() => !isExpanded && setIsExpanded(true)}
        className={`fixed bottom-0 left-0 right-0 transition-all z-30 duration-500 ease-in-out border-t-2 border-gray-200
        ${isExpanded ? 
          'h-[85vh] min-h-[400px] bg-white overflow-y-auto rounded-t-[30px]' : 
          'h-36 bg-white cursor-pointer flex flex-col justify-center rounded-t-[20px] gap-0'
        }
        `}
      >
        {/* Drawer Handle */}
        <div className="w-full flex justify-center pt-3">
          <div className="w-10 h-1 bg-gray-300 rounded-full transition-all duration-300 hover:bg-gray-400" />
        </div>

        {isExpanded && (
          <div className="w-full flex justify-center transition-all duration-300 ease-in-out sticky top-0 bg-white z-20 h-fit">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="p-2 rounded-full hover:bg-gray-100 mt-6 mb-8"
            >
              <IoMdClose size={32} />
            </button>
          </div>
        )}
        <div className={`flex flex-col w-full max-w-3xl mx-auto ${isExpanded ? 'mt-0' : ''}`}>
          <span className={`font-medium text-gray-600 px-4 mb-2 transition-all duration-300 ${
            isExpanded ? 'text-2xl font-semibold mt-2' : 'text-sm'
          }`}>
            Nearby
          </span>
          <div className={`flex items-center overflow-x-auto scrollbar-hide transition-all duration-300 ease-in-out ${
            isExpanded ? 'flex-wrap justify-center gap-y-6 gap-x-4 p-4' : 'gap-4 px-4'
          }`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {users.map((user) => (
            <div 
              key={user.id} 
              className={`flex flex-col items-center flex-shrink-0 group transition-all duration-300 ease-in-out ${isExpanded ? 'cursor-pointer basis-40' : ''}`}
              onClick={() => handleAvatarClick(user.id)}
            >
              <Avatar className={`transition-all duration-300 ease-in-out transform ${isExpanded ? 'w-32 h-32 hover:scale-105' : 'w-14 h-14 hover:scale-110'}`}>
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              {isExpanded && (
                <div className="text-center">
                  <span className={`text-sm mt-3 transition-all duration-300 ${isExpanded ? 'text-base' : ''}`}>
                    {user.name}
                  </span>
                  {!funMode && (
                    <span className="block text-sm text-gray-600">{user.price}</span>
                  )}
                </div>
              )}
            </div>
            ))}
          </div>
        </div>
      </footer>
      
      <UserDetailsDrawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        userData={selectedUser}
      />
    </>
  );
}
