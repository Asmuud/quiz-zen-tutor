import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { TrendingUp, BookOpen, Brain, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const subjects = [
  { name: "Mathematics", icon: "📐", color: "bg-subject-math", progress: 65 },
  { name: "English", icon: "📖", color: "bg-subject-english", progress: 78 },
  { name: "Biology", icon: "🧬", color: "bg-subject-biology", progress: 42 },
  { name: "Government", icon: "🏛️", color: "bg-subject-government", progress: 55 },
];

const stats = [
  { label: "Quizzes Taken", value: "24", icon: Brain },
  { label: "Topics Covered", value: "18", icon: BookOpen },
  { label: "Avg. Score", value: "72%", icon: TrendingUp },
  { label: "Best Streak", value: "7 days", icon: Trophy },
];

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-6 pb-20 sm:pb-6 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">
            Welcome back, Student! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to learn something new today?
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold font-display">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Subject progress */}
        <div>
          <h2 className="text-lg font-semibold font-display mb-3">Your Subjects</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <Card key={subject.name} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{subject.icon}</span>
                      <span className="font-semibold">{subject.name}</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Link to="/chat">
            <Card className="border-none shadow-sm hover:shadow-md transition-all bg-primary text-primary-foreground cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <p className="font-bold font-display text-lg">Chat with AI Tutor</p>
                  <p className="text-sm opacity-80">Ask questions, get instant help</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/quiz">
            <Card className="border-none shadow-sm hover:shadow-md transition-all bg-secondary text-secondary-foreground cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-foreground/20 flex items-center justify-center">
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <p className="font-bold font-display text-lg">Take a Quiz</p>
                  <p className="text-sm opacity-80">Test your knowledge now</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
