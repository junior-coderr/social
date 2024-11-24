'use client'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from "next-auth/react" // Update this line
import Image from 'next/image' // Add this import
import React, { useState } from 'react';
import { GoArrowLeft, GoSignOut } from "react-icons/go";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { X, ImagePlus, Trash2 } from "lucide-react" // Update import to include Trash2
import { MdVerified } from "react-icons/md";
import { User, Camera, MoreVertical } from "lucide-react" // Add these imports
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Add these imports

interface Request {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  profilePic?: string; // Add this line
}

// Add this utility function at the top level
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default function Profile() {
  const router = useRouter()
  const { data: session } = useSession() // Add this line
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  // const [isInterestsOpen, setIsInterestsOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      name: 'Jane Smith',
      message: 'Would love to collaborate on your next project!',
      timestamp: '2024-01-20T10:30:00Z',
      profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' // Sample avatar
    },
    {
      id: '2',
      name: 'Mike Johnson',
      message: 'Interested in working together on a writing project',
      timestamp: '2024-01-19T15:45:00Z',
      profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' // Sample avatar
    },
    {
      id: '3',
      name: 'Mike Johnson',
      message: 'Interested in working together on a writing project',
      timestamp: '2024-01-19T15:45:00Z',
      profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' // Sample avatar
    }
  ]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/register');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally show an error message to the user
    }
  };

  // Phone validation function
  const validatePhone = (phone: string) => {
    // Basic phone number validation (numbers only, 10 digits)
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  // Update phone handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setPhoneNumber(value);
    setIsValidPhone(validatePhone(value));
  };

  const handleSubmit = () => {
    if (isValidPhone && acceptedTerms) {
      console.log('Submitted:', { phoneNumber, acceptedTerms });
      setIsAboutOpen(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImages(prevImages => [imageUrl, ...prevImages]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagePreview = (img: string) => {
    setSelectedImage(img);
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToDelete));
    setSelectedImage(null);
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePic(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePic = () => {
    setProfilePic(null);
  };

  const handleAcceptRequest = (id: string) => {
    // Handle accept logic here
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleRejectRequest = (id: string) => {
    // Handle reject logic here
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleRequestClick = (userId: string) => {
    router.push(`/dashboard/user?id=${userId}&source=profile`);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <button 
        onClick={() => router.back()} 
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <GoArrowLeft size={24} className="mr-1" /> Back
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Updated User Info Section */}
        <div className="flex items-center space-x-4 mb-6 pb-4 border-b">
          <div className="relative w-20 h-20">
            {profilePic || session?.user?.image ? (
              <Image
                src={profilePic || session?.user?.image || ''}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={40} className="text-gray-400" />
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger className="absolute bottom-0 right-0 bg-black/20 backdrop-blur-sm rounded-full p-1.5 cursor-pointer hover:bg-black/40 transition-colors border border-white/20">
                <MoreVertical size={16} className="text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="w-full">
                  <label 
                    htmlFor="profilePicInput" 
                    className="flex items-center w-full px-2 py-1.5 text-sm cursor-pointer hover:bg-slate-100 rounded-sm"
                  >
                    <Camera size={16} className="mr-2" />
                    {profilePic ? 'Change Picture' : 'Add Picture'}
                  </label>
                  <input
                    id="profilePicInput"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="hidden"
                  />
                </div>
                {profilePic && (
                  <DropdownMenuItem onClick={removeProfilePic} className="text-red-600">
                    <Trash2 size={16} className="mr-2" />
                    Remove Picture
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{session?.user?.name || 'Guest User'}</h1>
            </div>
            <p className="text-gray-600">{session?.user?.email || 'No email provided'}</p>
          </div>
        </div>

        {/* About Me Section */}
        <Dialog 
          open={isAboutOpen} 
          onOpenChange={setIsAboutOpen}
          modal={true}
        >
          <DialogTrigger className="w-full" onClick={() => setIsAboutOpen(true)}>
            <div className="mb-6 pb-4 border-b text-left hover:bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-semibold">Writing</h2>
                <MdVerified className="text-green-500 text-xl" />
              </div>
              <p className="text-gray-700 line-clamp-2">
               Verified
              </p>
            </div>
          </DialogTrigger>
          <DialogContent 
            onPointerDownOutside={(e) => e.preventDefault()} 
            className="!pr-6 w-[95vw] sm:w-[90vw] md:w-[600px] mx-auto fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-auto max-h-[90vh] overflow-y-auto p-3 sm:p-6"
          >
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center text-base sm:text-xl px-1">
                Verify
                <button 
                  onClick={() => setIsAboutOpen(false)}
                  className="hover:bg-gray-100 rounded-full p-1.5"
                >
                  <X size={16} className="sm:w-5 sm:h-5" />
                </button>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-2 sm:mt-4 space-y-3 sm:space-y-4 px-1">
              {/* Phone Number Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 
                    ${isValidPhone ? 'border-green-500 focus:ring-green-500' : 'border-gray-300 focus:ring-blue-500'}
                  `}
                  placeholder="Enter 10 digit phone number"
                />
                {phoneNumber && !isValidPhone && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a valid 10-digit phone number
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I accept the terms and conditions.{' '}
                    <button
                      onClick={() => setShowFullTerms(true)}
                      className="text-blue-500 hover:underline"
                    >
                      Read more
                    </button>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isValidPhone || !acceptedTerms}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 
                          disabled:bg-gray-300 disabled:cursor-not-allowed mt-4"
              >
                Submit Verification
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Terms and Conditions Dialog */}
        <Dialog open={showFullTerms} onOpenChange={setShowFullTerms}>
          <DialogContent className="!pr-6 w-[95vw] max-w-lg mx-auto h-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center text-lg sm:text-xl">
                Terms and Conditions
                <button 
                  onClick={() => setShowFullTerms(false)}
                  className="hover:bg-gray-100 rounded-full p-1.5 sm:p-2"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-3 sm:mt-4">
              <div className="prose prose-sm">
                <h3>1. Introduction</h3>
                <p>These terms and conditions govern your use of our verification service...</p>
                
                <h3>2. Verification Process</h3>
                <p>By submitting your phone number, you agree to receive a verification code...</p>
                
                <h3>3. Privacy Policy</h3>
                <p>Your phone number will be used solely for verification purposes...</p>
                
                {/* Add more terms sections as needed */}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Personal Details Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
          <div className="flex justify-between flex-wrap gap-4 items-start">
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{session?.user?.email || 'No email provided'}</p>
            </div>
            <div className=''>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{session?.user?.name || 'No name provided'}</p>
            </div>
          </div>
        </div>

        {/* Requests Section */}
        <div className="mt-8 pt-4 border-t">
          <h2 className="text-xl font-semibold mb-4">Requests</h2>
          <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {requests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div 
                    key={request.id} 
                    className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleRequestClick(request.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-shrink-0">
                        {request.profilePic ? (
                          <img
                            src={request.profilePic}
                            alt={request.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start">
                          <div className="w-full sm:w-auto">
                            <h3 className="font-medium">{request.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">{request.message}</p>
                            <p className="text-gray-400 text-xs mt-2">
                              {formatDate(request.timestamp)}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-3 sm:mt-0 sm:ml-4 w-full sm:w-auto">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptRequest(request.id);
                              }}
                              className="flex-1 sm:flex-initial px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectRequest(request.id);
                              }}
                              className="flex-1 sm:flex-initial px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Showcase Section */}
        <div className="mt-8 pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Work</h2>
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2 transition-all">
              <ImagePlus size={20} />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {images.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No images uploaded yet
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-square group overflow-hidden rounded-lg border border-gray-200"
                  >
                    <img
                      src={img}
                      alt={`Work ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button 
                        onClick={() => handleImagePreview(img)}
                        className="text-white bg-black/50 px-4 py-2 rounded-md backdrop-blur-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Preview Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="p-0 bg-black/90 border-none max-w-4xl">
            <div className="relative">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full max-h-[80vh] object-contain"
                />
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button 
                  onClick={() => {
                    const index = images.findIndex(img => img === selectedImage);
                    if (index !== -1) {
                      handleDeleteImage(index);
                    }
                  }}
                  className="hover:bg-red-500 bg-red-500/80 rounded-full p-2 text-white"
                >
                  <Trash2 size={20} />
                </button>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="bg-white/10 rounded-full p-2 text-white hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Logout Confirmation Dialog */}
        <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
          <DialogContent className="w-[95vw] sm:max-w-[425px] p-4 sm:p-6 fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Confirm Logout</DialogTitle>
            </DialogHeader>
            <div className="py-3 sm:py-4">
              <p className="text-gray-600 text-sm sm:text-base">Are you sure you want to logout?</p>
            </div>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-md border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Logout Button Section */}
        <div className="mt-8 pt-4 border-t">
          <button
            onClick={handleLogoutClick}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center justify-center gap-2"
          >
            <GoSignOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}