import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, Brain, BookOpen, TrendingUp, Menu, X, LogOut, User, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/chat", label: "Ask AI Tutor", icon: MessageCircle },
  { path: "/quiz", label: "Practice Quiz", icon: Brain },
  { path: "/notes", label: "Study Notes", icon: BookOpen },
  { path: "/progress", label: "Student Progress", icon: TrendingUp },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, displayName, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">SmartStudy AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-muted"
              >
                <User className="w-4 h-4" />
                {displayName || user.email?.split("@")[0]}
              </Link>
              <button
                onClick={signOut}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-muted"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="text-sm font-medium text-primary hover:underline">
              Sign In
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b px-4 py-2 z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
          {user ? (
            <button
              onClick={() => { signOut(); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-primary"
            >
              <User className="w-5 h-5" />
              Sign In
            </Link>
          )}
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-card px-4 py-6 text-center text-sm text-muted-foreground pb-20 md:pb-6">
        <p>&copy; {new Date().getFullYear()} AsmudEmpire. All rights reserved.</p>
        <p className="mt-1">
          Contact: <a href="tel:08149659720" className="text-primary hover:underline">08149659720</a> | <a href="mailto:mudassirsalihu20@gmail.com" className="text-primary hover:underline">mudassirsalihu20@gmail.com</a>
        </p>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t flex justify-around py-2 z-50">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label.split(" ").pop()}
            </Link>
          );
        })}
        <Link
          to="/progress"
          className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
            location.pathname === "/progress" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          Progress
        </Link>
      </nav>
    </div>
  );
};

export default AppLayout;
