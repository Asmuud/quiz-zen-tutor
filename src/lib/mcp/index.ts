import { defineMcp, auth } from "@lovable.dev/mcp-js";
import getProfileTool from "./tools/get-profile";
import getProgressTool from "./tools/get-progress";

// Vite inlines the stable ref; the published SUPABASE_URL may be a proxy.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "smart-study-pal",
  title: "Smart Study Pal",
  version: "0.1.0",
  instructions:
    "Tools for Smart Study Pal, an AI study app for Nigerian secondary school students. Use `get_profile` and `get_progress` to view the signed-in student's profile and learning progress (quizzes taken, correct answers, topics studied).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  requireOAuthClientClaim: true,
  tools: [getProfileTool, getProgressTool],
});
