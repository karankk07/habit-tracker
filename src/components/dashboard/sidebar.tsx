'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ListTodo,
  Trophy,
  Settings,
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Habits',
    href: '/dashboard/habits',
    icon: ListTodo,
  },
  {
    title: 'Achievements',
    href: '/dashboard/achievements',
    icon: Trophy,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-64 min-h-screen bg-card border-r">
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-lg font-semibold">Habit Tracker</h1>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors',
              pathname === item.href ? 'bg-accent' : 'transparent'
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
} 