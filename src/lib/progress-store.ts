// Simple localStorage-based progress tracking
export interface ProgressData {
  quizzesTaken: number;
  correctAnswers: number;
  totalQuestions: number;
  topicsStudied: string[];
  lastActive: string;
}

const STORAGE_KEY = "smartstudy-progress";

export function getProgress(): ProgressData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    quizzesTaken: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    topicsStudied: [],
    lastActive: new Date().toISOString(),
  };
}

export function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, lastActive: new Date().toISOString() }));
}

export function recordQuiz(correct: number, total: number, subject: string) {
  const p = getProgress();
  p.quizzesTaken += 1;
  p.correctAnswers += correct;
  p.totalQuestions += total;
  if (!p.topicsStudied.includes(subject)) p.topicsStudied.push(subject);
  saveProgress(p);
}

export function recordTopic(topic: string) {
  const p = getProgress();
  if (!p.topicsStudied.includes(topic)) {
    p.topicsStudied.push(topic);
    saveProgress(p);
  }
}
