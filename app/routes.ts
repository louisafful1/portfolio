import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("projects/:slug", "routes/project-detail.tsx"),
  route("journal/:slug", "routes/journal-article.tsx"),
] satisfies RouteConfig;
