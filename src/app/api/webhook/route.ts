import { NextResponse } from "next/server";
import axios from "axios";

// POST Handler
export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Incoming webhook message:", JSON.stringify(body, null, 2));
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message?.type === "text") {
      const businessPhoneNumberId =
        body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;

      // Enviar mensagem de resposta
      await axios.post(
        `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          to: message.from,
          text: { body: "Echo: " + message.text.body },
          context: { message_id: message.id },
        },
        {
          headers: {
            Authorization: `Bearer EAAOGeUZAUHUMBO6Ugsk7rBZBZCfeVBP2b56pv1kCN7LmslAOBwyeLfrrAapgZBIZABHK0RGOyN9ZBg4TzpC1j5grlRXS6Te1dcinIMO2jN0A5ukCUwWinryYQZBbaZAPZCdIZCHJiRCA2yEUtytZCos9gnKONu3wyJDNG4VK86AJXe1eO8WsT7cxMJUU1KqPPcGDi3o8Osyx0PhHZAZB4X9QZCdZAQAdTYWMHNz`, // Substitua pelo token correto
          },
        }
      );

      // Marcar a mensagem como lida
      await axios.post(
        `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        },
        {
          headers: {
            Authorization: `Bearer EAAOGeUZAUHUMBO6Ugsk7rBZBZCfeVBP2b56pv1kCN7LmslAOBwyeLfrrAapgZBIZABHK0RGOyN9ZBg4TzpC1j5grlRXS6Te1dcinIMO2jN0A5ukCUwWinryYQZBbaZAPZCdIZCHJiRCA2yEUtytZCos9gnKONu3wyJDNG4VK86AJXe1eO8WsT7cxMJUU1KqPPcGDi3o8Osyx0PhHZAZB4X9QZCdZAQAdTYWMHNz`, // Substitua pelo token correto
          },
        }
      );
    }

    return NextResponse.json(
      { message: "Message processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET Handler
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Validar a solicitação de verificação do webhook
  if (mode === "subscribe" && token === "klz") {
    console.log("Webhook verified successfully!");
    return new Response(challenge, { status: 200 });
  } else {
    return new Response("Forbidden", { status: 403 });
  }
}
