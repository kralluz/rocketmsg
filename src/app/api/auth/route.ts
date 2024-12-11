import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY as string;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY as string;
const USER = process.env.USER as string;
const USER_PASSWORD = process.env.USER_PASSWORD as any;

export async function POST(req: Request) {
  console.log("🚀 ~ USER:", USER);
  console.log("🚀 ~ USER_PASSWORD:", USER_PASSWORD);
  const { username, password } = await req.json();
  if (username !== USER || password !== USER_PASSWORD) {
    return NextResponse.json(
      { error: "Usuário ou Senha inválidas!" },
      { status: 401 }
    );
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "5m" });
  const refreshToken = jwt.sign({ username }, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  return NextResponse.json({ token, refreshToken });
}

export async function PATCH(req: Request) {
  const { refreshToken } = await req.json();

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET_KEY) as {
      username: string;
    };
    const newToken = jwt.sign({ username: payload.username }, SECRET_KEY, {
      expiresIn: "5m",
    });

    return NextResponse.json({ token: newToken });
  } catch {
    return NextResponse.json(
      { error: "Refresh token inválido" },
      { status: 401 }
    );
  }
}
