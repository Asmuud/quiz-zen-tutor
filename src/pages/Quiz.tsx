import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, RotateCcw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { recordQuiz } from "@/lib/progress-store";

type Subject = "Mathematics" | "English" | "Biology" | "Government";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const subjects: { name: Subject; icon: string; color: string }[] = [
  { name: "Mathematics", icon: "📐", color: "bg-subject-math" },
  { name: "English", icon: "📖", color: "bg-subject-english" },
  { name: "Biology", icon: "🧬", color: "bg-subject-biology" },
  { name: "Government", icon: "🏛️", color: "bg-subject-government" },
];

const Quiz = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const startQuiz = async (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setFinished(false);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: { subject },
      });

      if (error) throw error;
      if (data?.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error("No questions generated");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to generate quiz. Please try again.");
      setSelectedSubject(null);
    } finally {
      setLoading(false);
    }
  };

  const question = questions[currentQ];

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === question.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
      if (selectedSubject) {
        recordQuiz(score, questions.length, selectedSubject);
      }
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (!selectedSubject) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-8 pb-20 sm:pb-8">
          <h1 className="text-2xl font-bold font-display mb-2">Practice Quiz</h1>
          <p className="text-muted-foreground mb-6">
            Select a subject to generate AI-powered exam-style questions for WAEC/NECO preparation.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((s) => (
              <button
                key={s.name}
                onClick={() => startQuiz(s.name)}
                className={`${s.color} text-primary-foreground rounded-xl p-5 text-left hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span className="text-3xl block mb-2">{s.icon}</span>
                <span className="font-display font-bold text-lg">{s.name}</span>
                <span className="block text-sm opacity-80 mt-1">5 AI questions</span>
              </button>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="font-display font-semibold text-lg">Generating {selectedSubject} Questions...</p>
          <p className="text-sm text-muted-foreground mt-2">Our AI is creating exam-style questions for you</p>
        </div>
      </AppLayout>
    );
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <AppLayout>
        <div className="max-w-md mx-auto px-4 py-12 pb-20 sm:pb-12 text-center">
          <div className="text-6xl mb-4">{percentage >= 80 ? "🏆" : percentage >= 50 ? "👍" : "📚"}</div>
          <h2 className="text-2xl font-bold font-display mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-4">{selectedSubject}</p>
          <div className="text-5xl font-bold font-display text-primary mb-2">{percentage}%</div>
          <p className="text-muted-foreground mb-6">
            {score} out of {questions.length} correct
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => startQuiz(selectedSubject)} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Try New Questions
            </Button>
            <Button variant="outline" onClick={() => setSelectedSubject(null)}>
              Other Subjects
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!question) return null;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20 sm:pb-6">
        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setSelectedSubject(null)} className="text-sm text-muted-foreground hover:text-foreground">
            ← Back
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            {currentQ + 1} / {questions.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 mb-6">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <Card className="border-none shadow-sm mb-4">
          <CardContent className="p-5">
            <p className="font-display font-semibold text-lg">{question.question}</p>
          </CardContent>
        </Card>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {question.options.map((opt, i) => {
            let optionStyle = "bg-card border hover:bg-muted cursor-pointer";
            if (answered) {
              if (i === question.correct) optionStyle = "bg-primary/10 border-primary";
              else if (i === selected) optionStyle = "bg-destructive/10 border-destructive";
              else optionStyle = "bg-card border opacity-50";
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left rounded-xl p-4 border transition-all flex items-center gap-3 ${optionStyle}`}
                disabled={answered}
              >
                <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm font-medium flex-1">{opt}</span>
                {answered && i === question.correct && <CheckCircle className="w-5 h-5 text-primary shrink-0" />}
                {answered && i === selected && i !== question.correct && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && question.explanation && (
          <Card className="border-none shadow-sm bg-primary/5 mb-4">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-primary mb-1">Explanation:</p>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </CardContent>
          </Card>
        )}

        {answered && (
          <Button onClick={next} className="w-full">
            {currentQ + 1 >= questions.length ? "See Results" : "Next Question"}
          </Button>
        )}
      </div>
    </AppLayout>
  );
};

export default Quiz;
