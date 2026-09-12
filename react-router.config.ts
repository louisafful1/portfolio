import type { Config } from "@react-router/dev/config";

export default {
  // Static SPA build — no Node server needed, deployable to any static host.
  ssr: false,
} satisfies Config;
