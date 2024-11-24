'use client';
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from 'next/navigation'
import { GoArrowLeft } from "react-icons/go";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [emailError, setEmailError] = useState<string | null>(null);
  const router = useRouter()

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleFocus = (inputName: string) => {
    setActiveInput(inputName);
  };

  const handleBlur = (inputName: string) => {
    setActiveInput(null);
  };

  const handleChange = (inputName: string, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [inputName]: value,
    }));

    if (inputName === "email") {
      validateEmail(value);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-[#F0F4F8] font-sans">
      <div className="w-full max-w-md mb-4">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <GoArrowLeft size={24} className="mr-1" /> Back
        </button>
      </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#061A40] font-montserrat">
          {isLogin ? "Login" : "Register"}
        </h2>
        <form className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <label
                htmlFor="name"
                className={`absolute left-3 transition-all duration-200 ease-in-out ${
                  activeInput === "name" || inputValues["name"] ? "text-xs -top-3 left-1" : "text-sm top-1/2 transform -translate-y-1/2"
                } text-[#061A40]`}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D201F] bg-[#F0F4F8] text-[#061A40]"
                required
                onFocus={() => handleFocus("name")}
                onBlur={() => handleBlur("name")}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
          )}
          <div className="relative">
            <label
              htmlFor="email"
              className={`absolute left-3 transition-all duration-200 ease-in-out ${
                activeInput === "email" || inputValues["email"] ? "text-xs -top-3 left-1" : "text-sm top-1/2 transform -translate-y-1/2"
              } text-[#061A40]`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 ${
                emailError ? "border-red-500" : "focus:ring-[#1D201F]"
              } bg-[#F0F4F8] text-[#061A40]`}
              required
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {emailError && (
              <span className="absolute text-xs text-red-500 -bottom-5 left-1">
                {emailError}
              </span>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className={`absolute left-3 transition-all duration-200 ease-in-out ${
                activeInput === "password" || inputValues["password"] ? "text-xs -top-3 left-1" : "text-sm top-1/2 transform -translate-y-1/2"
              } text-[#061A40]`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D201F] bg-[#F0F4F8] text-[#061A40]"
              required
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-black bg-[#eeeeee] rounded-lg hover:bg-[#dcdcdc] focus:ring-4 focus:ring-[#1D201F] focus:ring-opacity-50 font-semibold"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <button
          className="flex items-center justify-center w-full px-4 py-3 text-white bg-[#1d201fdb] rounded-lg hover:bg-[#1D201F] focus:ring-4 focus:ring-[#1D201F] focus:ring-opacity-50 font-semibold"
        >
          <FaGoogle className="mr-2" size={20} />
          Sign in with Google
        </button>
        <p className="text-sm text-center text-[#061A40]">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleAuthMode}
            className="text-[#1D201F] font-semibold hover:underline focus:outline-none"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
      <style jsx global>{`
        body {
          overflow: hidden;
        }
        .avatar-scroll {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
        }
        .avatar-scroll::-webkit-scrollbar { 
          display: none;  /* Safari and Chrome */
        }
      `}</style>
    </div>
  );
}
