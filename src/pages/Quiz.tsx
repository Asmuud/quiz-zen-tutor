import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

type Subject = "Mathematics" | "English" | "Biology" | "Government";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const quizBank: Record<Subject, Question[]> = {
  Mathematics: [
    { question: "What is the value of x in 2x + 6 = 14?", options: ["2", "4", "6", "8"], correct: 1 },
    { question: "What is the area of a circle with radius 7? (π ≈ 22/7)", options: ["154 sq units", "44 sq units", "22 sq units", "49 sq units"], correct: 0 },
    { question: "Simplify: 3² + 4²", options: ["7", "12", "25", "49"], correct: 2 },
    { question: "What is 15% of 200?", options: ["15", "30", "25", "35"], correct: 1 },
    { question: "Find the LCM of 4 and 6", options: ["24", "12", "6", "2"], correct: 1 },
  ],
  English: [
    { question: "Which is a correct sentence?", options: ["He go to school", "He goes to school", "He going to school", "He gone to school"], correct: 1 },
    { question: "What is a synonym for 'happy'?", options: ["Sad", "Angry", "Joyful", "Tired"], correct: 2 },
    { question: "Identify the noun: 'The cat sat on the mat'", options: ["sat", "on", "the", "cat"], correct: 3 },
    { question: "What figure of speech is: 'The wind whispered'?", options: ["Simile", "Metaphor", "Personification", "Hyperbole"], correct: 2 },
    { question: "Which is the past tense of 'run'?", options: ["Ran", "Runned", "Running", "Runs"], correct: 0 },
  ],
  Biology: [
    { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], correct: 2 },
    { question: "Which blood cells fight infection?", options: ["Red blood cells", "Platelets", "White blood cells", "Plasma"], correct: 2 },
    { question: "What is the process by which plants make food?", options: ["Respiration", "Photosynthesis", "Osmosis", "Diffusion"], correct: 1 },
    { question: "DNA stands for:", options: ["Deoxyribonucleic Acid", "Dinitro Acid", "Deoxyribo Nucleic Atom", "None of the above"], correct: 0 },
    { question: "Which organ pumps blood in the human body?", options: ["Liver", "Kidney", "Heart", "Lungs"], correct: 2 },
  ],
  Government: [
    { question: "Which arm of government makes laws?", options: ["Executive", "Legislature", "Judiciary", "Military"], correct: 1 },
    { question: "What is the supreme law of a country?", options: ["Decree", "Constitution", "Manifesto", "Policy"], correct: 1 },
    { question: "Who is the head of the judiciary?", options: ["President", "Speaker", "Chief Justice", "Governor"], correct: 2 },
    { question: "What type of government is ruled by the people?", options: ["Monarchy", "Oligarchy", "Democracy", "Autocracy"], correct: 2 },
    { question: "Separation of powers was proposed by:", options: ["John Locke", "Montesquieu", "Aristotle", "Plato"], correct: 1 },
  ],
};

const subjects: { name: Subject; icon: string; color: string }[] = [
  { name: "Mathematics", icon: "📐", color: "bg-subject-math" },
  { name: "English", icon: "📖", color: "bg-subject-english" },
  { name: "Biology", icon: "🧬", color: "bg-subject-biology" },
  { name: "Government", icon: "🏛️", color: "bg-subject-government" },
];

const Quiz = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const startQuiz = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setFinished(false);
  };

  const questions = selectedSubject ? quizBank[selectedSubject] : [];
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
          <h1 className="text-2xl font-bold font-display mb-2">Quiz Generator</h1>
          <p className="text-muted-foreground mb-6">Select a subject to test your knowledge</p>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((s) => (
              <button
                key={s.name}
                onClick={() => startQuiz(s.name)}
                className={`${s.color} text-primary-foreground rounded-xl p-5 text-left hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span className="text-3xl block mb-2">{s.icon}</span>
                <span className="font-display font-bold text-lg">{s.name}</span>
                <span className="block text-sm opacity-80 mt-1">{quizBank[s.name].length} questions</span>
              </button>
            ))}
          </div>
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
          <p className="text-muted-foreground mb-6">{score} out of {questions.length} correct</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => startQuiz(selectedSubject)} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Retry
            </Button>
            <Button variant="outline" onClick={() => setSelectedSubject(null)}>
              Other Subjects
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

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
        <div className="space-y-2 mb-6">
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
