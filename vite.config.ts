import type { IncomingMessage, ServerResponse } from "node:http";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Dev-only equivalent of the api/*.ts Vercel functions: `vite dev` never runs
// those, so without this any /api/* call 404s locally. Both this and the
// real Vercel function call the same handle*Request core, so dev and prod
// behave identically.
function apiDevMiddleware(path: string, handle: (body: unknown, clientKey: string) => Promise<Response>): Plugin {
  return {
    name: `api-dev-middleware${path.replace(/\W+/g, "-")}`,
    configureServer(server) {
      server.middlewares.use(path, (req: IncomingMessage, res: ServerResponse) => {
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
            let body: unknown;
            try {
              body = JSON.parse(rawBody || "{}");
            } catch {
              body = {};
            }

            const response = await handle(body, req.socket.remoteAddress || "unknown");

            res.statusCode = response.status;
            response.headers.forEach((value, key) => res.setHeader(key, value));

            if (!response.body) {
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

function askApiDevMiddleware(): Plugin {
  return apiDevMiddleware("/api/ask", async (body, clientKey) => {
    const { handleAskRequest } = await import("./app/features/terminal/knowledge/ask-core");
    return handleAskRequest((body as { question?: unknown })?.question, clientKey);
  });
}

function contactApiDevMiddleware(): Plugin {
  return apiDevMiddleware("/api/contact", async (body, clientKey) => {
    const { handleContactRequest } = await import("./app/features/contact/contact-core");
    return handleContactRequest(body, clientKey);
  });
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const key of ["AI_API_KEY", "AI_API_URL", "AI_MODEL", "RESEND_API_KEY", "CONTACT_TO_EMAIL"]) {
    if (env[key]) process.env[key] = env[key];
  }

  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), askApiDevMiddleware(), contactApiDevMiddleware()],
    server: {
      watch: {
        ignored: ["**/build/**"],
      },
    },
  };
});
