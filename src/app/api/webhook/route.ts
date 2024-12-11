import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN } = process.env;

async function webhookHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      console.log(
        "Incoming webhook message:",
        JSON.stringify(req.body, null, 2)
      );
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
            headers: { Authorization: `Bearer EAAOGeUZAUHUMBO6Ugsk7rBZBZCfeVBP2b56pv1kCN7LmslAOBwyeLfrrAapgZBIZABHK0RGOyN9ZBg4TzpC1j5grlRXS6Te1dcinIMO2jN0A5ukCUwWinryYQZBbaZAPZCdIZCHJiRCA2yEUtytZCos9gnKONu3wyJDNG4VK86AJXe1eO8WsT7cxMJUU1KqPPcGDi3o8Osyx0PhHZAZB4X9QZCdZAQAdTYWMHNz` },
          }
        );

        // Mark incoming message as read
        await axios.post(
          `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
          {
            messaging_product: "whatsapp",
            status: "read",
            message_id: message.id,
          },
          {
            headers: { Authorization: `Bearer EAAOGeUZAUHUMBO6Ugsk7rBZBZCfeVBP2b56pv1kCN7LmslAOBwyeLfrrAapgZBIZABHK0RGOyN9ZBg4TzpC1j5grlRXS6Te1dcinIMO2jN0A5ukCUwWinryYQZBbaZAPZCdIZCHJiRCA2yEUtytZCos9gnKONu3wyJDNG4VK86AJXe1eO8WsT7cxMJUU1KqPPcGDi3o8Osyx0PhHZAZB4X9QZCdZAQAdTYWMHNz` },
          }
        );
      }

      return res.status(200).send("Message processed successfully");
    } catch (error) {
      console.error("Error processing webhook message:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    const mode = req.query["hub.mode"] as string;
    const token = req.query["hub.verify_token"] as string;
    const challenge = req.query["hub.challenge"] as string;

    // Validate the webhook verification request
    if (mode === "subscribe" && token === "klz") {
      console.log("Webhook verified successfully!");
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Forbidden");
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method Not Allowed" });
}

export default webhookHandler;
