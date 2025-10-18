import { Settings, Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DailyTimer } from "@/components/DailyTimer";
import { usefulWordsData } from "@/data/usefulWords";

const UsefulWords = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-1">📗 מילים שימושיות</h1>
            <p className="text-sm text-muted-foreground">ביטויים וביטויים חיוניים</p>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5 text-primary" />
          </button>
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

      {/* Lists */}
      <div className="max-w-md mx-auto mt-8">
        <div className="space-y-3">
          {usefulWordsData.map((list) => (
            <button
              key={list.id}
              onClick={() => navigate(`/useful-words/${list.id}`)}
              className="w-full bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all p-6 text-right"
            >
              <h3 className="text-xl font-semibold text-foreground">{list.name}</h3>
              <p className="text-sm text-muted-foreground">{list.nameEn}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsefulWords;
