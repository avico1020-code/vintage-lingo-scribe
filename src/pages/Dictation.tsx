import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Dictation = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 flex items-center gap-4">
        <Link to="/">
          <button className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            🎯 Random Dictation
          </h1>
          <p className="text-sm text-muted-foreground">Practice listening and writing</p>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        <div className="vintage-shadow bg-card rounded-xl p-8 border-2 border-border text-center">
          <div className="text-6xl mb-4">🎧</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            Test your listening skills with random dictation exercises
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dictation;
