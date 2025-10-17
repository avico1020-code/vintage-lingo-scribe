import { DailyTimer } from "@/components/DailyTimer";
import { NavigationCard } from "@/components/NavigationCard";
import { BookOpen, Bookmark, Mic, Dices, Settings, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-1">מילון וינטג׳</h1>
            <p className="text-sm text-muted-foreground">המלווה שלך ללימוד שפות</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button 
            className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center"
          >
            <Search className="w-5 h-5 text-primary" />
          </button>
          <button 
            onClick={() => navigate("/settings")}
            className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      {/* Daily Timer */}
      <DailyTimer />

      {/* Navigation Cards */}
      <div className="max-w-md mx-auto space-y-4">
        <NavigationCard
          icon={BookOpen}
          title="אוצר מילים"
          emoji="📘"
          to="/vocabulary"
          delay={0}
        />
        <NavigationCard
          icon={Bookmark}
          title="מילים שימושיות"
          emoji="📗"
          to="/useful-words"
          delay={100}
        />
        <NavigationCard
          icon={Mic}
          title="הכתבה אקראית"
          emoji="🎯"
          to="/dictation"
          delay={200}
        />
        <NavigationCard
          icon={Dices}
          title="רולטה"
          emoji="🎰"
          to="/roulette"
          delay={300}
        />
      </div>
    </div>
  );
};

export default Index;
