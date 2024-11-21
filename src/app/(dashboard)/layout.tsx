'use client';

import { Header } from "@/components/layouts/header";
import { Navigation } from "@/components/layouts/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex flex-1">
        <Navigation />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 