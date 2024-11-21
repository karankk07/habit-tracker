'use client';

import { cn } from "@/lib/utils";
import { Home, Calendar, Award, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Habits", href: "/dashboard/habits" },
  { icon: Award, label: "Achievements", href: "/dashboard/achievements" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

interface NavigationProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Navigation({ mobile, onNavigate }: NavigationProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    onNavigate?.();
    signOut();
  };

  const handleNavigation = () => {
    onNavigate?.();
  };

  const content = (
    <nav className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href} onClick={handleNavigation}>
            <span
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                pathname === href 
                  ? "bg-primary/10 text-primary hover:bg-primary/20" 
                  : "hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="p-4 border-t shrink-0">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 px-3"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="truncate">Sign Out</span>
        </Button>
      </div>
    </nav>
  );

  if (mobile) {
    return content;
  }

  return (
    <aside className="hidden md:block fixed top-16 left-0 bottom-0 w-64 border-r bg-background">
      <div className="h-full overflow-y-auto">
        {content}
      </div>
    </aside>
  );
} 