import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { phoneNumber, messageText } = req.body;

    if (!phoneNumber || !messageText) {
      return res
        .status(400)
        .json({ error: "Phone number and message text are required" });
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

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return POST(req, res);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
