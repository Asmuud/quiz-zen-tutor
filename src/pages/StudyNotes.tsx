import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamChat } from "@/lib/stream-chat";
import { recordTopic } from "@/lib/progress-store";
import { toast } from "sonner";

type Subject = "Mathematics" | "English" | "Biology" | "Government" | "General";

const subjects: { name: Subject; icon: string }[] = [
  { name: "Mathematics", icon: "📐" },
  { name: "English", icon: "📖" },
  { name: "Biology", icon: "🧬" },
  { name: "Government", icon: "🏛️" },
  { name: "General", icon: "📚" },
];

const StudyNotes = () => {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState<Subject>("General");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const notesRef = useRef<HTMLDivElement>(null);

  const generateNotes = async () => {
    if (!topic.trim()) return;
    setNotes("");
    setIsLoading(true);

    let content = "";
    await streamChat({
      endpoint: "generate-notes",
      body: { topic: topic.trim(), subject },
      onDelta: (chunk) => {
        content += chunk;
        setNotes(content);
      },
      onDone: () => {
        setIsLoading(false);
        recordTopic(`${subject}: ${topic.trim()}`);
      },
      onError: (err) => {
        toast.error(err);
        setIsLoading(false);
      },
    });
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 pb-20 sm:pb-8">
        <h1 className="text-2xl font-bold font-display mb-2">Study Notes</h1>
        <p className="text-muted-foreground mb-6">
          Enter a topic and get simplified study notes with examples. Perfect for exam revision!
        </p>

        {/* Input form */}
        <Card className="border-none shadow-sm mb-6">
          <CardContent className="p-5 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSubject(s.name)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      subject === s.name
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Topic</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Photosynthesis, Quadratic Equations, Parts of Speech..."
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                onKeyDown={(e) => e.key === "Enter" && generateNotes()}
              />
            </div>
            <Button onClick={generateNotes} disabled={!topic.trim() || isLoading} className="w-full gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating Notes...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Study Notes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated notes */}
        {notes && (
          <Card className="border-none shadow-sm" ref={notesRef}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-lg">
                  {subject}: {topic}
                </h3>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{notes}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default StudyNotes;
