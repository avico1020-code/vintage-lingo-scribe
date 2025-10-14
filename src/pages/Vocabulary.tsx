import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Vocabulary = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate("/")}
          className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            📘 אוצר מילים
          </h1>
          <p className="text-sm text-muted-foreground">בנה את אוסף המילים שלך</p>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        <div className="vintage-shadow bg-card rounded-xl p-8 border-2 border-border text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">בקרוב</h2>
          <p className="text-muted-foreground">
            תכונת תרגול אוצר המילים שלך בהכנה
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vocabulary;
