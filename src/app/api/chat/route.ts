import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, locale } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // TODO: Implement Google Generative AI (Gemini) chat
    // const { GoogleGenerativeAI } = await import("@google/generative-ai");
    // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

    return NextResponse.json({
      reply: "ASTRO chat endpoint is ready. Connect your Gemini API key to enable AI responses.",
      locale: locale || "tr",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
