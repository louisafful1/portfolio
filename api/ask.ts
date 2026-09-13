import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleAskRequest } from "../app/features/terminal/knowledge/ask-core";

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

  const response = await handleAskRequest(req.body?.question, getClientKey(req));

  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));

  if (response.status !== 200 || !response.body) {
    const data = await response.json().catch(() => ({ error: "Unexpected error" }));
    res.json(data);
    return;
  }

  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(Buffer.from(value));
  }
  res.end();
}
