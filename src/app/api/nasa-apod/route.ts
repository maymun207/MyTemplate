import { NextResponse } from "next/server";

// NASA APOD (Astronomy Picture of the Day) — free
// DEMO_KEY: 30 req/hour. Register at https://api.nasa.gov for 1000 req/hour
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

// Cache the result in memory for 1 hour to reduce API calls
let cachedResult: { data: Record<string, unknown>; timestamp: number } | null = null;
const CACHE_TTL = 3600_000; // 1 hour

async function fetchApod(dateStr?: string): Promise<Record<string, unknown> | null> {
  const url = dateStr
    ? `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${dateStr}`
    : `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = await res.json();
  if (!data || !data.url) return null;
  return data;
}

export async function GET() {
  try {
    // Return cached if fresh
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedResult.data);
    }

    // Try today
    let data = await fetchApod();

    // If today is a video or failed, try yesterday
    if (!data || data.media_type !== "image") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      data = await fetchApod(yesterday.toISOString().split("T")[0]);
    }

    // If still no image, try 2 days ago
    if (!data || data.media_type !== "image") {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      data = await fetchApod(twoDaysAgo.toISOString().split("T")[0]);
    }

    if (data && data.media_type === "image" && data.url) {
      const result = {
        url: (data.hdurl as string) || (data.url as string),
        title: data.title as string,
        explanation: ((data.explanation as string) || "").slice(0, 200) + "...",
        date: data.date as string,
        copyright: (data.copyright as string) || "NASA",
      };

      // Cache it
      cachedResult = { data: result, timestamp: Date.now() };
      return NextResponse.json(result);
    }

    return NextResponse.json({ url: null, title: null, copyright: null });
  } catch {
    return NextResponse.json({ url: null, title: null, copyright: null });
  }
}
