'use client';
import { useState } from 'react';
import { GoPerson } from "react-icons/go";
import Link from 'next/link';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleFunMode } from '@/redux/features/uiSlice';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserDetailsDrawer from './UserDetailsDrawer';

export default function Header() {
  const dispatch = useAppDispatch();
  const funMode = useAppSelector((state) => state.ui.funMode);
  const { status } = useSession();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleProfileClick = () => {
    if (status !== 'authenticated') {
      setIsDrawerOpen(true);
    }
  };

  return (
    <>
      <header className="flex justify-between items-center w-full relative z-50">
        <div className="absolute inset-0 rounded-lg -z-10" />
        
        <h1 className="text-xl font-bold">Someone</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="fun-mode"
              checked={funMode}
              onCheckedChange={() => dispatch(toggleFunMode())}
            />
            <Label htmlFor="fun-mode" className="text-sm font-medium">
              Fun Mode
            </Label>
          </div>
          {status === 'authenticated' ? (
            <Link href="/profile" className="relative z-50">
              <GoPerson className="bg-gray-100 cursor-pointer rounded-full p-2" size={40} />
            </Link>
          ) : (
            <div onClick={handleProfileClick} className="relative z-50 cursor-pointer">
              <GoPerson className="bg-gray-100 rounded-full p-2" size={40} />
            </div>
          )}
        </div>
      </header>

      <UserDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userData={{ id: 0, name: '' }}
      />
    </>
  );
}