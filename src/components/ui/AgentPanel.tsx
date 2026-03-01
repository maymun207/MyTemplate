"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AgentPanel({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [panelWidth, setPanelWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef<{ x: number; w: number }>({ x: 0, w: 380 });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update CSS variable for page content margin
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.setProperty("--agent-width", `${panelWidth}px`);
      document.body.classList.add("agent-panel-open");
    } else {
      document.body.classList.remove("agent-panel-open");
    }
    return () => {
      document.body.classList.remove("agent-panel-open");
    };
  }, [isOpen, panelWidth]);

  // Resize drag handler (left edge of panel)
  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      resizeStartRef.current = { x: e.clientX, w: panelWidth };
    },
    [panelWidth]
  );

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => {
      // Dragging left edge — moving left makes panel wider
      const dx = resizeStartRef.current.x - e.clientX;
      const newWidth = Math.max(300, Math.min(700, resizeStartRef.current.w + dx));
      setPanelWidth(newWidth);
    };
    const onUp = () => setIsResizing(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isResizing]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, locale }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            locale === "en"
              ? "The stars are momentarily unclear. Please try again."
              : "Yıldızlar anlık olarak belirsiz. Lütfen tekrar deneyin.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button — fixed right edge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-[55] flex items-center justify-center transition-all duration-300 ${
          isOpen ? "right-[var(--agent-width,380px)]" : "right-0"
        }`}
        style={{
          width: 36,
          height: 72,
          borderRadius: "12px 0 0 12px",
          background: "linear-gradient(180deg, var(--color-primary), var(--color-accent))",
          boxShadow: "-2px 0 15px rgba(139,92,246,0.2)",
        }}
        aria-label={isOpen ? "Close PIRI" : "Open PIRI"}
      >
        <span className="text-white text-sm font-bold" style={{ writingMode: "vertical-rl" }}>
          {isOpen ? "✕" : "✦ 𝑷"}
        </span>
      </button>

      {/* Side panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[54] flex"
            style={{ width: panelWidth }}
            initial={{ x: panelWidth }}
            animate={{ x: 0 }}
            exit={{ x: panelWidth }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Resize handle — left edge */}
            <div
              className="w-1.5 h-full cursor-col-resize flex items-center justify-center group hover:bg-[var(--color-primary)]/20 transition-colors"
              style={{ background: "var(--bg-border)" }}
              onMouseDown={onResizeStart}
            >
              <div className="w-0.5 h-8 rounded-full bg-[var(--text-muted)] opacity-50 group-hover:opacity-100 group-hover:bg-[var(--color-primary)] transition-all" />
            </div>

            {/* Panel content */}
            <div
              className="flex-1 flex flex-col border-l border-[var(--bg-border)] overflow-hidden"
              style={{ background: "var(--bg-primary)" }}
            >
              {/* Header */}
              <div className="px-4 py-3 flex items-center gap-3 border-b border-[var(--bg-border)]">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "rgba(255,215,0,0.1)", boxShadow: "0 0 12px rgba(255,215,0,0.15)" }}
                >
                  ✦
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-[var(--color-secondary)]">PIRI</h3>
                  <p className="text-[10px] text-[var(--text-muted)] truncate">
                    {locale === "en" ? "Your personal synthesis guide" : "Kişisel sentez rehberiniz"}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4 animate-float">🔮</div>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-[250px] mx-auto">
                      {locale === "en"
                        ? "I am PIRI, your Synthesis Guide — ask me anything about your stars, energy, or day ahead."
                        : "Ben PIRI, senin Sentez Rehberin — yıldızların, enerjin veya gününle ilgili her şeyi sorabilirsin."}
                    </p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[var(--color-primary)] text-white rounded-br-md"
                          : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--bg-border)] rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[var(--bg-surface)] border border-[var(--bg-border)] px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" style={{ animationDelay: "0.15s" }} />
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" style={{ animationDelay: "0.3s" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-[var(--bg-border)]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={locale === "en" ? "Ask PIRI..." : "PIRI'ye sor..."}
                    className="flex-1 bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm px-4 py-2.5 rounded-xl border border-[var(--bg-border)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-30 text-white"
                    style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
