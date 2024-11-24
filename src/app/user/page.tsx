'use client';
import { useSearchParams } from 'next/navigation';
import { GoArrowLeft } from "react-icons/go";
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

export default function UserProfile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const funMode = useAppSelector((state) => state.ui.funMode);
  const userId = searchParams.get('id');

  // Mock user data - in real app, fetch from API based on userId
  const users = [
    { id: 1, image: "https://randomuser.me/api/portraits/men/1.jpg", name: "User 1", bio: "Software Developer", location: "New York", followers: 1234, following: 567, price: "$50" },
    { id: 2, image: "https://randomuser.me/api/portraits/women/2.jpg", name: "User 2", bio: "UI Designer", location: "San Francisco", followers: 2345, following: 678, price: "$75" },
    // ...add more users matching footer.tsx
  ];

  const user = users.find(u => u.id === Number(userId));

  if (!user) {
    return <div className="flex justify-center items-center h-screen">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <GoArrowLeft size={24} className="mr-1" /> Back
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center">
            <img 
              src={user.image} 
              alt={user.name} 
              className="w-32 h-32 rounded-full mb-4 border-4 border-[#1D201F]"
            />
            <h1 className="text-2xl font-bold text-[#061A40] mb-2">{user.name}</h1>
            {!funMode && (
              <p className="text-xl text-gray-700 font-semibold mb-2">{user.price}</p>
            )}
            <p className="text-gray-600 mb-4">{user.bio}</p>
            <div className="flex items-center text-gray-500 mb-6">
              <span className="mr-4">📍 {user.location}</span>
              <span className="mr-4">👥 {user.followers} followers</span>
              <span>{user.following} following</span>
            </div>
            
            <button className="bg-[#1D201F] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all">
              Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
