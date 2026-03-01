import { NextResponse } from "next/server";

// Hardcoded users for local dev — replace with SSO later
const USERS = [
  {
    username: "ayse",
    password: "1234",
    displayName: "Ayşe",
    birthData: { date: "1988-04-12", time: "08:30", city: "Ankara" },
  },
  {
    username: "hulya",
    password: "2345",
    displayName: "Hülya",
    birthData: { date: "1985-09-22", time: "14:15", city: "Istanbul" },
  },
];

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const user = USERS.find(
    (u) =>
      u.username.toLowerCase() === username?.toLowerCase() &&
      u.password === password
  );

  if (user) {
    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        displayName: user.displayName,
        birthData: user.birthData,
      },
    });
  }

  return NextResponse.json(
    { success: false, error: "Invalid username or password" },
    { status: 401 }
  );
}
