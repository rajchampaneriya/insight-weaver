import { useState } from "react";
import { X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Explain today's move for RELIANCE",
  "Summarize latest earnings for TCS",
  "What's the sentiment on ADANIENT?",
  "Compare INFY vs WIPRO fundamentals",
];

interface AssistantPanelProps {
  open: boolean;
  onClose: () => void;
}

export function AssistantPanel({ open, onClose }: AssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI research assistant. Ask me about any NSE/BSE stock — I can explain price moves, summarize earnings, and generate investment briefs. How can I help today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: msg },
      {
        role: "assistant",
        content:
          "This is a placeholder response. Once integrated with Azure AI services, I'll provide real-time insights, sentiment analysis, and AI-generated investment briefs for Indian equities.",
      },
    ]);
    setInput("");
  };

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-[400px] bg-card border-l flex flex-col z-50 transition-transform duration-200",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="h-12 border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">AI Assistant</span>
          <Badge variant="outline" className="text-[9px] font-mono">AI-Generated • Not Financial Advice</Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-2", m.role === "user" && "justify-end")}>
            {m.role === "assistant" && (
              <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-3 w-3 text-primary" />
              </div>
            )}
            <div
              className={cn(
                "text-sm px-3 py-2 max-w-[85%]",
                m.role === "assistant"
                  ? "bg-muted rounded-r-lg rounded-bl-lg"
                  : "bg-primary text-primary-foreground rounded-l-lg rounded-br-lg"
              )}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="h-6 w-6 rounded bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                <User className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Suggested prompts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-[11px] px-2 py-1 border rounded-sm hover:bg-accent transition-colors text-left"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t p-3 flex gap-2 shrink-0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about any stock..."
          className="text-sm h-9"
        />
        <Button size="icon" className="h-9 w-9 shrink-0" onClick={() => handleSend()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
