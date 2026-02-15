import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { Content, Theme } from "@carbon/react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { ComplianceBanner } from "./ComplianceBanner";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";

export function AppShell() {
  const [isDark, setIsDark] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [sideNavExpanded, setSideNavExpanded] = useState(true);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return (
    <Theme theme={isDark ? "g100" : "white"}>
      <div className="min-h-screen flex flex-col w-full">
        <AppHeader
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onToggleAssistant={() => setAssistantOpen((p) => !p)}
          onToggleSideNav={() => setSideNavExpanded((p) => !p)}
        />
        <div className="flex flex-1 pt-12">
          <AppSidebar expanded={sideNavExpanded} />
          <main className={`flex-1 overflow-auto p-6 transition-all duration-200 ${sideNavExpanded ? "ml-64" : "ml-0"}`}>
            <Outlet />
          </main>
        </div>
        <ComplianceBanner sideNavExpanded={sideNavExpanded} />
        <AssistantPanel open={assistantOpen} onClose={() => setAssistantOpen(false)} />
      </div>
    </Theme>
  );
}
