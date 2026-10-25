import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

const toProfileJson = (profile: { display_name: string | null; avatar_url: string | null }, email: string | null) => ({
  display_name: profile.display_name,
  avatar_url: profile.avatar_url,
  email,
});

export default defineTool({
  name: "get_profile",
  title: "Get profile",
  description: "Get the signed-in student's profile: display name, avatar URL and email.",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = await supabaseForUser(ctx);
    const userId = ctx.getUserId();
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const profile = data ?? { display_name: null, avatar_url: null };
    return {
      content: [{ type: "text", text: `Profile for ${ctx.getUserEmail() ?? userId}.` }],
      structuredContent: { profile: toProfileJson(profile, ctx.getUserEmail()) },
    };
  },
});
