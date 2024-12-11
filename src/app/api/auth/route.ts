import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Variáveis de ambiente
const SECRET_KEY = process.env.SECRET_KEY as string;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY as string;
const USER = process.env.USER as string;
const USER_PASSWORD = process.env.USER_PASSWORD as string;

// Armazenamento temporário em memória para rastrear falhas
const failedAttempts: {
  [ip: string]: { attempts: number; blockUntil?: Date };
} = {};

// Configurações de bloqueio
const MAX_ATTEMPTS = 20;
const BLOCK_TIME_MS = 15 * 60 * 1000; // 15 minutos

export async function POST(req: Request) {
  const clientIP =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Verificar bloqueio
  const currentData = failedAttempts[clientIP];
  if (
    currentData &&
    currentData.blockUntil &&
    currentData.blockUntil > new Date()
  ) {
    return NextResponse.json(
      { error: "Muitas tentativas falhas. Tente novamente mais tarde." },
      { status: 429 }
    );
  }

  const { username, password } = await req.json();

  // Verificar credenciais
  if (username !== USER || password !== USER_PASSWORD) {
    // Incrementar falhas
    failedAttempts[clientIP] = failedAttempts[clientIP] || { attempts: 0 };
    failedAttempts[clientIP].attempts++;

    // Bloquear se ultrapassar o limite
    if (failedAttempts[clientIP].attempts >= MAX_ATTEMPTS) {
      failedAttempts[clientIP].blockUntil = new Date(
        Date.now() + BLOCK_TIME_MS
      );
    }

    return NextResponse.json(
      { error: "Usuário ou Senha inválidas!" },
      { status: 401 }
    );
  }

  // Resetar contagem em caso de sucesso
  if (failedAttempts[clientIP]) {
    delete failedAttempts[clientIP];
  }

  // Gerar tokens
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
