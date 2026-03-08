import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamChat, type Msg } from "@/lib/stream-chat";
import { toast } from "sonner";

type Subject = "Mathematics" | "English" | "Biology" | "Government";

const subjects: { name: Subject; icon: string; color: string }[] = [
  { name: "Mathematics", icon: "📐", color: "bg-subject-math" },
  { name: "English", icon: "📖", color: "bg-subject-english" },
  { name: "Biology", icon: "🧬", color: "bg-subject-biology" },
  { name: "Government", icon: "🏛️", color: "bg-subject-government" },
];

const ChatTutor = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setMessages([
      {
        role: "assistant",
        content: `Hi there! 👋 I'm your ${subject} tutor. Ask me any question about ${subject} and I'll explain it step by step. I'm here to help you learn and prepare for your exams!`,
      },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedSubject || isLoading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    await streamChat({
      endpoint: "chat",
      body: {
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        subject: selectedSubject,
      },
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && prev.length > newMessages.length) {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
          }
          return [...prev, { role: "assistant", content: assistantContent }];
        });
      },
      onDone: () => setIsLoading(false),
      onError: (err) => {
        toast.error(err);
        setIsLoading(false);
      },
    });
  };

  if (!selectedSubject) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-8 pb-20 sm:pb-8">
          <h1 className="text-2xl font-bold font-display mb-2">Ask AI Tutor</h1>
          <p className="text-muted-foreground mb-6">
            Choose a subject and ask any question. Your AI tutor will explain it in simple language with examples.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((s) => (
              <button
                key={s.name}
                onClick={() => selectSubject(s.name)}
                className={`${s.color} text-primary-foreground rounded-xl p-5 text-left hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span className="text-3xl block mb-2">{s.icon}</span>
                <span className="font-display font-bold text-lg">{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-57px)] pb-14 sm:pb-0">
        {/* Subject header */}
        <div className="border-b bg-card px-4 py-2 flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedSubject(null);
              setMessages([]);
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
          <span className="text-sm font-medium">
            {subjects.find((s) => s.name === selectedSubject)?.icon} {selectedSubject}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-secondary" />
                </div>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-card p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2 max-w-3xl mx-auto"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${selectedSubject}...`}
              className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="rounded-xl shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatTutor;
