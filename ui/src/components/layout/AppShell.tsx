import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { ComplianceBanner } from "./ComplianceBanner";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";

export function AppShell() {
  const [isDark, setIsDark] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <AppHeader
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onToggleAssistant={() => setAssistantOpen((p) => !p)}
          />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
          <ComplianceBanner />
        </div>
        <AssistantPanel open={assistantOpen} onClose={() => setAssistantOpen(false)} />
      </div>
    </SidebarProvider>
  );
}
