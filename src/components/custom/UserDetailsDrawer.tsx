'use client';
import { useState, useRef } from 'react';
import { signIn, useSession } from "next-auth/react";
import { IoMdClose, IoMdCamera } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface UserDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userData: { id: number; name: string; } | null;
}

export default function UserDetailsDrawer({ isOpen, onClose, userData }: UserDetailsDrawerProps) {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    image: null as string | null
  });

  const [emailError, setEmailError] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  // const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePicture = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    
    // Clear the field if input is not a number
    if (isNaN(value)) {
      setFormData(prev => ({ ...prev, age: '' }));
      return;
    }

    // Validate age between 0 and 120
    if (value >= 0 && value <= 120) {
      setFormData(prev => ({ ...prev, age: value.toString() }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    validateEmail(email);
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { 
        callbackUrl: '/dashboard'
      });
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleLoginEmail = async () => {
    if (validateEmail(formData.email)) {
      setShowOTP(true);
      // Here you would typically trigger your email OTP service
      console.log('Sending OTP to:', formData.email);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Only accept numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);

    // Auto focus next input if value is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
      
      // Clear the previous input
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleVerifyOTP = () => {
    const otpValue = otp.join('');
    console.log('Verifying OTP:', otpValue);
    // Add your OTP verification logic here
  };

  const isFormValid = () => {
    const { name, age, gender, email } = formData;
    return (
      name.trim() !== '' &&
      age !== '' &&
      parseInt(age) >= 0 &&
      parseInt(age) <= 120 &&
      gender !== '' &&
      email !== '' &&
      !emailError
    );
  };

  const handleContinue = () => {
    onClose();
    // router.push('/dashboard/');
  };

  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {isLoginMode ? 'Login' : 'User Details'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!isLoginMode ? (
            <>
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors relative overflow-hidden group"
                  onClick={triggerFileInput}
                >
                  {formData.image ? (
                    <>
                      <img 
                        src={formData.image} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <IoMdCamera size={32} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <IoMdCamera size={40} className="text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={triggerFileInput}
                    className="text-sm"
                  >
                    {formData.image ? 'Change Picture' : 'Upload Picture'}
                  </Button>
                  {formData.image && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRemovePicture}
                      className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Google Login Button */}
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 py-5"
                  onClick={handleGoogleLogin}
                >
                  <FcGoogle size={24} />
                  <span>Continue with Google</span>
                </Button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-300 w-full" />
                  <span className="bg-white px-2 text-sm text-gray-500 absolute">or</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {emailError && (
                    <p className="text-sm text-red-500">{emailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="120"
                    placeholder="Enter your age (0-120)"
                    value={formData.age}
                    onChange={handleAgeChange}
                    className={`${
                      parseInt(formData.age) > 120 || parseInt(formData.age) < 0 
                      ? 'border-red-500 focus-visible:ring-red-500' 
                      : ''
                    }`}
                  />
                  {(parseInt(formData.age) > 120 || parseInt(formData.age) < 0) && (
                    <p className="text-sm text-red-500">
                      Please enter a valid age between 0 and 120
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Footer for Registration */}
              <div className="mt-6">
                <Button 
                  className="w-full" 
                  onClick={handleContinue}
                  disabled={!isFormValid()}
                >
                  Continue
                </Button>
                {!isFormValid() && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Please fill in name, age, gender and email to continue
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {!showOTP ? (
                <>
                  <div className="space-y-4">
                    {/* Google Login Button */}
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 py-5"
                      onClick={handleGoogleLogin}
                    >
                      <FcGoogle size={24} />
                      <span>Continue with Google</span>
                    </Button>

                    <div className="relative flex items-center justify-center">
                      <div className="border-t border-gray-300 w-full" />
                      <span className="bg-white px-2 text-sm text-gray-500 absolute">or</span>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleEmailChange}
                        className={emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {emailError && (
                        <p className="text-sm text-red-500">{emailError}</p>
                      )}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleLoginEmail}
                    disabled={!formData.email || !!emailError}
                  >
                    Continue
                  </Button>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium">Enter verification code</h3>
                    <p className="text-sm text-gray-500">
                      We sent a code to {formData.email}
                    </p>
                  </div>

                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="w-12 h-12 text-center text-lg"
                      />
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleVerifyOTP}
                    disabled={otp.some(digit => !digit)}
                  >
                    Verify
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white">
          <Button 
            variant="ghost"
            className="w-full" 
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setShowOTP(false);
              setOtp(['', '', '', '', '', '']);
            }}
          >
            {isLoginMode ? "Don't have an account? Register" : "Already have an account? Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
