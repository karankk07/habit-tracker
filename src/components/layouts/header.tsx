'use client';

import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Navigation } from "./navigation";
import { useState } from "react";

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Navigation mobile onNavigate={() => setMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">Habit Tracker</h1>
        </div>
      </div>
    </header>
  );
} 