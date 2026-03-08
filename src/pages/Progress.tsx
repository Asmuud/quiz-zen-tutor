import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, CheckCircle, BookOpen, Trophy, Loader2 } from "lucide-react";
import { getProgress, type ProgressData } from "@/lib/progress-store";

const Progress = () => {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProgress().then((data) => {
      setProgress(data);
      setLoading(false);
    });
  }, []);

  if (loading || !progress) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const avgScore = progress.totalQuestions > 0
    ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
    : 0;

  const stats = [
    { label: "Quizzes Taken", value: progress.quizzesTaken.toString(), icon: Brain, color: "bg-primary/10 text-primary" },
    { label: "Correct Answers", value: progress.correctAnswers.toString(), icon: CheckCircle, color: "bg-accent/10 text-accent" },
    { label: "Topics Studied", value: progress.topicsStudied.length.toString(), icon: BookOpen, color: "bg-secondary/10 text-secondary" },
    { label: "Average Score", value: `${avgScore}%`, icon: Trophy, color: "bg-subject-math/10 text-subject-math" },
  ];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 pb-20 sm:pb-8">
        <h1 className="text-2xl font-bold font-display mb-2">Student Progress</h1>
        <p className="text-muted-foreground mb-6">Track your learning journey and stay motivated!</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-none shadow-sm">
                <CardContent className="p-5 text-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold font-display">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {progress.topicsStudied.length > 0 && (
          <Card className="border-none shadow-sm mb-6">
            <CardContent className="p-5">
              <h3 className="font-display font-bold mb-3">Topics You've Studied</h3>
              <div className="flex flex-wrap gap-2">
                {progress.topicsStudied.map((t, i) => (
                  <span key={i} className="bg-muted px-3 py-1.5 rounded-full text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-none shadow-sm bg-primary/5">
          <CardContent className="p-6 text-center">
            <span className="text-4xl block mb-3">💪</span>
            <p className="font-display font-bold text-lg mb-1">Keep Learning!</p>
            <p className="text-sm text-muted-foreground">
              Every step you take improves your knowledge. Consistency is the key to success in your exams!
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Progress;
