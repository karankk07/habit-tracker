'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
      <h2 className="text-lg font-semibold">Welcome, {user?.email}</h2>
      <div className="flex items-center gap-4">
        {/* Add any header actions here */}
      </div>
    </header>
  );
} 