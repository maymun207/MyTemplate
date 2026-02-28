"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function ContactModal({ isOpen, onClose, locale }: ContactModalProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to /api/contact
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-heading text-white">
            {locale === "en" ? "Contact Us" : "İletişim"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={locale === "en" ? "Name" : "İsim"}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-accent"
            required
          />
          <input
            type="email"
            placeholder={locale === "en" ? "Email" : "E-posta"}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-accent"
            required
          />
          <textarea
            placeholder={locale === "en" ? "Message" : "Mesaj"}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-accent h-32 resize-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {locale === "en" ? "Send Message" : "Mesaj Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
}
