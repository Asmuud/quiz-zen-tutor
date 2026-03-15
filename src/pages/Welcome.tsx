import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Sparkles } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const { displayName, user } = useAuth();
  const [fadeOut, setFadeOut] = useState(false);

  const name = displayName || user?.email?.split("@")[0] || "Student";

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2500);
    const redirectTimer = setTimeout(() => navigate("/", { replace: true }), 3200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-background px-6 transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-[bounce_1s_ease-in-out] mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
          <BookOpen className="w-8 h-8 text-primary-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        <h1 className="text-3xl font-bold text-foreground font-display">Welcome Back!</h1>
        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
      </div>

      <p className="text-lg text-muted-foreground text-center max-w-xs">
        Great to see you, <span className="font-semibold text-foreground">{name}</span>. Let's keep learning!
      </p>

      <div className="mt-8 w-48 h-1 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-[progress_3s_ease-in-out_forwards]" />
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Welcome;
