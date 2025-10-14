import { DailyTimer } from "@/components/DailyTimer";
import { NavigationCard } from "@/components/NavigationCard";
import { BookOpen, Bookmark, Mic, Dices, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-1">VocabVintage</h1>
          <p className="text-sm text-muted-foreground">Your Daily Language Companion</p>
        </div>
        <Link to="/settings">
          <button className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </button>
        </Link>
      </header>

      {/* Daily Timer */}
      <DailyTimer />

      {/* Navigation Cards */}
      <div className="max-w-md mx-auto space-y-4">
        <NavigationCard
          icon={BookOpen}
          title="Vocabulary"
          emoji="📘"
          to="/vocabulary"
          delay={0}
        />
        <NavigationCard
          icon={Bookmark}
          title="Useful Words"
          emoji="📗"
          to="/useful-words"
          delay={100}
        />
        <NavigationCard
          icon={Mic}
          title="Random Dictation"
          emoji="🎯"
          to="/dictation"
          delay={200}
        />
        <NavigationCard
          icon={Dices}
          title="Roulette"
          emoji="🎰"
          to="/roulette"
          delay={300}
        />
      </div>
    </div>
  );
};

export default Index;
