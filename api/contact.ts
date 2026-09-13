import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleContactRequest } from "../app/features/contact/contact-core";

function getClientKey(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const response = await handleContactRequest(req.body, getClientKey(req));
  const data = await response.json().catch(() => ({}));
  res.status(response.status).json(data);
}
