import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message?.type === "text") {
      const businessPhoneNumberId =
        req.body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;

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
            Authorization: `Bearer YOUR_GRAPH_API_TOKEN`, // Substitua pelo token correto
          },
        }
      );

      // Marcar a mensagem recebida como lida
      await axios.post(
        `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        },
        {
          headers: {
            Authorization: `Bearer YOUR_GRAPH_API_TOKEN`, // Substitua pelo token correto
          },
        }
      );
    }

    return res.status(200).send("Message processed successfully");
  } catch (error) {
    console.error("Error processing webhook message:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const mode = req.query["hub.mode"] as string;
  const token = req.query["hub.verify_token"] as string;
  const challenge = req.query["hub.challenge"] as string;

  // Validar a solicitação de verificação do webhook
  if (mode === "subscribe" && token === "klz") {
    console.log("Webhook verified successfully!");
    return res.status(200).send(challenge);
  } else {
    return res.status(403).send("Forbidden");
  }
}

