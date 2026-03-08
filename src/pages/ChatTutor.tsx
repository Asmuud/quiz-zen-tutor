import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";

type Subject = "Mathematics" | "English" | "Biology" | "Government";
type Message = { role: "user" | "assistant"; content: string };

const subjectPrompts: Record<Subject, string> = {
  Mathematics: "I'm your Math tutor! Ask me about algebra, geometry, calculus, or any math topic.",
  English: "I'm your English tutor! Ask about grammar, literature, essay writing, or vocabulary.",
  Biology: "I'm your Biology tutor! Ask about cells, genetics, ecology, or human anatomy.",
  Government: "I'm your Government tutor! Ask about civic education, political systems, or the constitution.",
};

const subjects: { name: Subject; icon: string; color: string }[] = [
  { name: "Mathematics", icon: "📐", color: "bg-subject-math" },
  { name: "English", icon: "📖", color: "bg-subject-english" },
  { name: "Biology", icon: "🧬", color: "bg-subject-biology" },
  { name: "Government", icon: "🏛️", color: "bg-subject-government" },
];

const getAIResponse = (subject: Subject, question: string): string => {
  const responses: Record<Subject, string[]> = {
    Mathematics: [
      "Great question! Let me break this down step by step. In mathematics, we often approach problems by identifying what we know and what we need to find. Could you share the specific equation or concept you're working with?",
      "That's an interesting math problem! Remember, the key to solving equations is to isolate the variable. Try working through it one step at a time.",
      "In mathematics, practice is everything. Let me explain the concept: first identify the formula, then substitute values, and finally simplify. Would you like me to walk through an example?",
    ],
    English: [
      "Good question about English! When analyzing literature, consider the author's purpose, the historical context, and the literary devices used. Which aspect would you like to explore?",
      "For essay writing, remember the structure: introduction with thesis, body paragraphs with evidence, and a strong conclusion. Would you like help with any specific part?",
      "Grammar tip: Subject-verb agreement is essential. The subject and verb must agree in number. For example, 'The students study' (plural) vs 'The student studies' (singular).",
    ],
    Biology: [
      "In Biology, understanding cell structure is fundamental. Remember: the cell membrane controls what enters and exits, the nucleus contains DNA, and mitochondria produce energy (ATP).",
      "Great biology question! Genetics follows Mendel's laws. Dominant alleles are expressed when present, while recessive alleles need two copies. Would you like me to explain Punnett squares?",
      "Ecology involves studying how organisms interact with their environment. Key concepts include food chains, ecosystems, and biodiversity. What specific area interests you?",
    ],
    Government: [
      "In civic education, understanding the three arms of government is crucial: the Legislature (makes laws), Executive (enforces laws), and Judiciary (interprets laws). Which would you like to learn more about?",
      "Great question about government! Democracy is built on principles like rule of law, separation of powers, and fundamental human rights. Let me explain further.",
      "The constitution is the supreme law of the land. It outlines citizens' rights and responsibilities, government structure, and the amendment process. What aspect would you like to explore?",
    ],
  };

  const subjectResponses = responses[subject];
  return subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
};

const ChatTutor = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setMessages([{ role: "assistant", content: subjectPrompts[subject] }]);
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedSubject) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getAIResponse(selectedSubject, userMsg.content);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  if (!selectedSubject) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-8 pb-20 sm:pb-8">
          <h1 className="text-2xl font-bold font-display mb-2">AI Tutor Chat</h1>
          <p className="text-muted-foreground mb-6">Choose a subject to start learning</p>
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
      <div className="flex flex-col h-[calc(100vh-57px)] sm:h-[calc(100vh-57px)] pb-14 sm:pb-0">
        {/* Subject header */}
        <div className="border-b bg-card px-4 py-2 flex items-center gap-2">
          <button
            onClick={() => { setSelectedSubject(null); setMessages([]); }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
          <span className="text-sm font-medium">{subjects.find(s => s.name === selectedSubject)?.icon} {selectedSubject}</span>
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
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-secondary" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
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
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2 max-w-3xl mx-auto"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${selectedSubject}...`}
              className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button type="submit" size="icon" disabled={!input.trim()} className="rounded-xl shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatTutor;
