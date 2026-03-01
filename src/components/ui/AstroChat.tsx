"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

export default function AstroChat({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [size, setSize] = useState<Size>({ width: 380, height: 520 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStartRef = useRef<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });

  // Initialize position (bottom-right corner)
  useEffect(() => {
    setPosition({
      x: window.innerWidth - 400,
      y: window.innerHeight - 580,
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Drag handlers
  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
    },
    [position]
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - size.width, dragStartRef.current.posX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - size.height, dragStartRef.current.posY + dy)),
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, size]);

  // Resize handlers
  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStartRef.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };
    },
    [size]
  );

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => {
      const dw = e.clientX - resizeStartRef.current.x;
      const dh = e.clientY - resizeStartRef.current.y;
      setSize({
        width: Math.max(320, Math.min(600, resizeStartRef.current.w + dw)),
        height: Math.max(400, Math.min(800, resizeStartRef.current.h + dh)),
      });
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
      {/* Floating toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-lg text-xl transition-all"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
          boxShadow: "0 0 25px rgba(139,92,246,0.4), 0 4px 20px rgba(0,0,0,0.3)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle AI Oracle"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              ✕
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              ✦
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            className="fixed z-[59] flex flex-col overflow-hidden"
            style={{
              left: position.x,
              top: position.y,
              width: size.width,
              height: size.height,
              background: "rgba(10, 0, 20, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--color-cosmic-border)",
              borderRadius: "1rem",
              boxShadow: "0 0 40px rgba(139,92,246,0.15), 0 10px 40px rgba(0,0,0,0.5)",
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header — draggable */}
            <div
              className="px-4 py-3 flex items-center gap-3 cursor-move select-none border-b border-[var(--color-cosmic-border)]"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))" }}
              onMouseDown={onDragStart}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: "rgba(255,215,0,0.1)", boxShadow: "0 0 15px rgba(255,215,0,0.2)" }}
              >
                ✦
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[var(--color-secondary)]">
                  {locale === "en" ? "Oracle AI" : "Oracle AI"}
                </h3>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  {locale === "en" ? "Your personal synthesis agent" : "Kişisel sentez ajanınız"}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
                <span className="text-[10px]">⠿</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-3xl mb-3 animate-float">🔮</div>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {locale === "en"
                      ? "I am your Synthesis Oracle — ask me anything about your stars, energy, or day ahead."
                      : "Ben senin Sentez Oracle'ın — yıldızların, enerjin veya gününle ilgili her şeyi sorabilirsin."}
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--color-primary)] text-white rounded-br-md"
                        : "bg-[var(--color-cosmic-surface)] text-[var(--color-text-secondary)] border border-[var(--color-cosmic-border)] rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--color-cosmic-surface)] border border-[var(--color-cosmic-border)] px-4 py-3 rounded-2xl rounded-bl-md">
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
            <div className="p-3 border-t border-[var(--color-cosmic-border)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={locale === "en" ? "Ask the Oracle..." : "Oracle'a sor..."}
                  className="flex-1 bg-[var(--color-cosmic-surface)] text-white text-sm px-4 py-2.5 rounded-xl border border-[var(--color-cosmic-border)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
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

            {/* Resize handle (bottom-right corner) */}
            <div
              className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-center justify-center"
              onMouseDown={onResizeStart}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" className="text-[var(--color-text-muted)] opacity-50">
                <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
