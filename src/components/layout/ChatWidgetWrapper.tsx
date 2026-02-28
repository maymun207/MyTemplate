"use client";

import dynamic from "next/dynamic";
import type { Locale } from "@/lib/i18n/config";

const ChatWidget = dynamic(() => import("@/components/ui/ChatWidget"), {
  ssr: false,
});

interface ChatWidgetWrapperProps {
  locale: Locale;
}

export default function ChatWidgetWrapper({ locale }: ChatWidgetWrapperProps) {
  return <ChatWidget locale={locale} />;
}
