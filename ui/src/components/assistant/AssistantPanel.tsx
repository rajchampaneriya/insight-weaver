import { useState, useRef, useEffect } from "react";
import { Button, TextInput, Tag, InlineLoading } from "@carbon/react";
import { Close, Send, Bot, User, Idea } from "@carbon/icons-react";
import { useChatMutation } from "@/hooks/use-market-data";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Explain today's move for RELIANCE",
  "Summarize latest earnings for HDFCBANK",
  "What's the sentiment on ADANIENT?",
  "Compare SUNPHARMA vs BHARTIARTL fundamentals",
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
        "Hello! I'm your AI research assistant. Ask me about any NSE/BSE stock -- I can explain price moves, summarize earnings, and generate investment briefs. How can I help today?",
    },
  ]);
  const [input, setInput] = useState("");
  const chatMutation = useChatMutation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: msg }]);

    const tickerMatch = msg.match(/\b([A-Z]{3,12})\b/);
    const ticker = tickerMatch?.[1];

    try {
      const response = await chatMutation.mutateAsync({
        question: msg,
        ticker,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your request. Please try again.",
        },
      ]);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-[var(--cds-layer)] border-l border-border flex flex-col z-50 transition-transform duration-200 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Bot size={16} />
          <span className="font-medium text-sm">AI Assistant</span>
          <Tag type="outline" size="sm" className="text-[9px] font-mono">
            Not Financial Advice
          </Tag>
        </div>
        <Button
          kind="ghost"
          size="sm"
          hasIconOnly
          renderIcon={Close}
          iconDescription="Close"
          onClick={onClose}
        />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}
          >
            {m.role === "assistant" && (
              <div className="h-6 w-6 rounded bg-[var(--cds-interactive)] bg-opacity-20 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={12} />
              </div>
            )}
            <div
              className={`text-sm px-3 py-2 max-w-[85%] ${
                m.role === "assistant"
                  ? "bg-muted rounded-r-lg rounded-bl-lg"
                  : "bg-[var(--cds-interactive)] text-white rounded-l-lg rounded-br-lg"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-sm prose-carbon max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
            {m.role === "user" && (
              <div className="h-6 w-6 rounded bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <User size={12} />
              </div>
            )}
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded bg-[var(--cds-interactive)] bg-opacity-20 flex items-center justify-center shrink-0 mt-0.5">
              <Bot size={12} />
            </div>
            <div className="bg-muted rounded-r-lg rounded-bl-lg px-3 py-2">
              <InlineLoading description="Thinking..." />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1">
            <Idea size={12} /> Suggested prompts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-[11px] px-2 py-1 border border-border rounded-sm hover:bg-muted transition-colors text-left"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-border p-3 flex gap-2 shrink-0">
        <TextInput
          id="assistant-input"
          labelText=""
          hideLabel
          size="sm"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent) =>
            e.key === "Enter" && handleSend()
          }
          placeholder="Ask about any stock..."
        />
        <Button
          kind="primary"
          size="sm"
          hasIconOnly
          renderIcon={Send}
          iconDescription="Send"
          onClick={() => handleSend()}
        />
      </div>
    </div>
  );
}
