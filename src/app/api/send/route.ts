import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, messageText } = body;

    if (!phoneNumber || !messageText) {
      return NextResponse.json({ error: "Phone number and message text are required" }, { status: 400 });
    }

    const businessPhoneNumberId = "YOUR_BUSINESS_PHONE_NUMBER_ID"; // Substitua pelo ID correto
    const graphApiToken = "YOUR_GRAPH_API_TOKEN"; // Substitua pelo token correto

    // Enviar mensagem
    await axios.post(
      `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: phoneNumber,
        text: { body: messageText },
      },
      {
        headers: {
          Authorization: `Bearer ${graphApiToken}`,
        },
      }
    );

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "This route only supports POST requests" }, { status: 405 });
}
