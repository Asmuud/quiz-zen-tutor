import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

const toProgressJson = (row: {
  quizzes_taken: number;
  correct_answers: number;
  total_questions: number;
  topics_studied: string[];
}) => ({
  quizzes_taken: row.quizzes_taken,
  correct_answers: row.correct_answers,
  total_questions: row.total_questions,
  topics_studied: row.topics_studied,
});

export default defineTool({
  name: "get_progress",
  title: "Get learning progress",
  description: "Get the signed-in student's learning progress: quizzes taken, correct answers, total questions and topics studied.",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = await supabaseForUser(ctx);
    const userId = ctx.getUserId();
    const { data, error } = await supabase
      .from("student_progress")
      .select("quizzes_taken, correct_answers, total_questions, topics_studied")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (!data) {
      return {
        content: [{ type: "text", text: "No learning progress recorded yet for this student." }],
        structuredContent: { progress: null },
      };
    }
    const avg =
      data.total_questions > 0 ? Math.round((data.correct_answers / data.total_questions) * 100) : 0;
    return {
      content: [
        {
          type: "text",
          text: `${data.quizzes_taken} quizzes taken, ${data.correct_answers}/${data.total_questions} correct (average score ${avg}%). Topics studied: ${data.topics_studied.join(", ") || "none yet"}.`,
        },
      ],
      structuredContent: { progress: toProgressJson(data) },
    };
  },
});
