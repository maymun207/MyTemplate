"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface WorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function WorkshopModal({ isOpen, onClose, locale }: WorkshopModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-heading text-white">
            {locale === "en" ? "Workshop" : "Atölye"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-300">
          {locale === "en"
            ? "Workshop content coming soon."
            : "Atölye içeriği yakında eklenecek."}
        </p>
      </div>
    </div>
  );
}
