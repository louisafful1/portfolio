import type { IncomingMessage, ServerResponse } from "node:http";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Dev-only equivalent of api/ask.ts: `vite dev` never runs Vercel functions,
// so without this the terminal's /api/ask call 404s locally. Both adapters
// call the same handleAskRequest core, so dev and prod behave identically.
function askApiDevMiddleware(): Plugin {
  return {
    name: "ask-api-dev-middleware",
    configureServer(server) {
      server.middlewares.use("/api/ask", (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        let rawBody = "";
        req.on("data", (chunk) => {
          rawBody += chunk;
        });
        req.on("end", () => {
          void (async () => {
            let question: unknown;
            try {
              question = JSON.parse(rawBody || "{}").question;
            } catch {
              question = undefined;
            }

            const { handleAskRequest } = await import("./app/features/terminal/knowledge/ask-core");
            const response = await handleAskRequest(question, req.socket.remoteAddress || "unknown");

            res.statusCode = response.status;
            response.headers.forEach((value, key) => res.setHeader(key, value));

            if (response.status !== 200 || !response.body) {
              res.end(await response.text());
              return;
            }

            const reader = response.body.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(Buffer.from(value));
            }
            res.end();
          })();
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const key of ["AI_API_KEY", "AI_API_URL", "AI_MODEL"]) {
    if (env[key]) process.env[key] = env[key];
  }

  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), askApiDevMiddleware()],
    server: {
      watch: {
        ignored: ["**/build/**"],
      },
    },
  };
});
