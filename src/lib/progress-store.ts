import { supabase } from "@/integrations/supabase/client";

export interface ProgressData {
  quizzesTaken: number;
  correctAnswers: number;
  totalQuestions: number;
  topicsStudied: string[];
}

export async function getProgress(): Promise<ProgressData> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { quizzesTaken: 0, correctAnswers: 0, totalQuestions: 0, topicsStudied: [] };

  const { data } = await supabase
    .from("student_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!data) return { quizzesTaken: 0, correctAnswers: 0, totalQuestions: 0, topicsStudied: [] };

  return {
    quizzesTaken: data.quizzes_taken,
    correctAnswers: data.correct_answers,
    totalQuestions: data.total_questions,
    topicsStudied: data.topics_studied || [],
  };
}

export async function recordQuiz(correct: number, total: number, subject: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("student_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    const topics = existing.topics_studied || [];
    if (!topics.includes(subject)) topics.push(subject);

    await supabase
      .from("student_progress")
      .update({
        quizzes_taken: existing.quizzes_taken + 1,
        correct_answers: existing.correct_answers + correct,
        total_questions: existing.total_questions + total,
        topics_studied: topics,
      })
      .eq("user_id", user.id);
  }
}

export async function recordTopic(topic: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("student_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    const topics = existing.topics_studied || [];
    if (!topics.includes(topic)) {
      topics.push(topic);
      await supabase
        .from("student_progress")
        .update({ topics_studied: topics })
        .eq("user_id", user.id);
    }
  }
}
