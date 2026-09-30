// app/account/layout.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserSidePanel from '../../components/UserSidePanel';

export default function AccountLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`/api/auth/me`, {
          credentials: 'include',
        });
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        setIsLoading(false);
      } catch (error) {
        router.push('/login');
      }
    };
    checkSession();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8F9F6]">
        <div className="w-12 h-12 border-4 border-[#2B7A4B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8F9F6] pb-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 h-full">
        
        {/* ✅ CRITICAL: Force flex-row on ALL screens */}
        <div className="flex flex-row gap-6 lg:gap-10 justify-start h-full">
          
          {/* Side Panel - Always on left, always visible, collapses on smaller screens */}
          <div className="shrink-0">
            <UserSidePanel />
          </div>
          
          {/* Main Content - Always on right, takes remaining space */}
          <div className="flex-1 w-full min-w-0">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}