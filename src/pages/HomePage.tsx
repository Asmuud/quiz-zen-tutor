import AppLayout from "@/components/AppLayout";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Brain, BookOpen, TrendingUp, ArrowRight, Sparkles } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI Tutor",
    description: "Ask questions and get step-by-step explanations from your personal AI tutor.",
    link: "/chat",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Brain,
    title: "Practice Quizzes",
    description: "Test your knowledge with AI-generated exam-style questions for WAEC/NECO prep.",
    link: "/quiz",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: BookOpen,
    title: "Study Notes",
    description: "Generate simplified study notes on any topic in simple, easy-to-understand language.",
    link: "/notes",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Track your learning journey with quizzes taken, scores, and topics studied.",
    link: "/progress",
    color: "bg-subject-math/10 text-subject-math",
  },
];

const HomePage = () => {
  return (
    <AppLayout>
      <div className="pb-20 sm:pb-6">
        {/* Hero section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Learning
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-display leading-tight mb-4">
              SmartStudy AI –{" "}
              <span className="text-primary">Your Personal AI Learning Companion</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8">
              SmartStudy AI helps secondary school students understand difficult subjects, practice
              exam questions, and improve their academic performance using AI-powered tutoring.
            </p>
            <Link to="/chat">
              <Button size="lg" className="gap-2 text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                Start Learning <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Subject badges */}
        <section className="max-w-5xl mx-auto px-4 -mt-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {["📐 Mathematics", "📖 English", "🧬 Biology", "🏛️ Government"].map((s) => (
              <span key={s} className="bg-card border px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold font-display text-center mb-8">
            Everything You Need to Excel
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Link key={f.title} to={f.link}>
                  <Card className="border-none shadow-sm hover:shadow-md transition-all h-full group cursor-pointer">
                    <CardContent className="p-6 flex gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                          {f.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{f.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <Card className="border-none bg-primary text-primary-foreground shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="font-display font-bold text-2xl mb-2">Ready to boost your grades?</h3>
              <p className="opacity-80 mb-6">Join thousands of Nigerian students using SmartStudy AI to prepare for WAEC, NECO, and school exams.</p>
              <Link to="/chat">
                <Button variant="secondary" size="lg" className="gap-2 rounded-xl">
                  Start Learning Now <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
};

export default HomePage;
