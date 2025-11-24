import { useState } from "react";
import { ArrowLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchDialog } from "@/components/SearchDialog";
import { DailyTimer } from "@/components/DailyTimer";
import { SlotMachine } from "@/components/SlotMachine";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usefulWordsData } from "@/data/usefulWords";
import { toast } from "@/hooks/use-toast";

interface Word {
  id: string;
  original: string;
  translation: string;
}

const Roulette = () => {
  const navigate = useNavigate();
  const [direction, setDirection] = useState<"he-en" | "en-he">("he-en");
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const getAllWords = (): Word[] => {
    const allWords: Word[] = [];

    // Get words from usefulWords
    usefulWordsData.forEach(list => {
      list.words.forEach(word => {
        allWords.push(word);
      });
    });

    // Get words from vocabulary lists
    const savedLists = localStorage.getItem("vocabularyLists");
    if (savedLists) {
      const lists = JSON.parse(savedLists);
      lists.forEach((list: any) => {
        const savedWords = localStorage.getItem(`vocabularyWords_${list.id}`);
        if (savedWords) {
          const words = JSON.parse(savedWords);
          words.forEach((word: any) => {
            allWords.push(word);
          });
        }
      });
    }

    return allWords;
  };

  const pullHandle = () => {
    setIsSpinning(true);
    setIsChecked(false);
    setUserAnswer("");
    
    setTimeout(() => {
      const allWords = getAllWords();
      if (allWords.length > 0) {
        const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        setCurrentWord(randomWord);
      }
      setIsSpinning(false);
    }, 1000);
  };

  const checkAnswer = () => {
    if (!currentWord || !userAnswer.trim()) return;

    const correctAnswer = direction === "he-en" ? currentWord.original : currentWord.translation;
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
    
    setIsCorrect(isAnswerCorrect);
    setIsChecked(true);

    if (isAnswerCorrect) {
      toast({
        title: "🎉 מעולה!",
        description: "תשובה נכונה! המשך כך!",
        className: "bg-green-500 text-white",
      });
    } else {
      toast({
        title: "💪 כמעט!",
        description: `התשובה הנכונה היא: ${correctAnswer}`,
        className: "bg-red-500 text-white",
      });
    }
  };

  const displayWord = currentWord 
    ? (direction === "he-en" ? currentWord.translation : currentWord.original)
    : "";

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/")}
              className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                🎰 רולטה
              </h1>
              <SearchDialog />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <DailyTimer />
            <button 
              onClick={() => navigate("/settings")}
              className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center"
            >
              <Settings className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Language Selection */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">בחר שפה</h2>
          <div className="flex gap-4 justify-center">
            <Button
              variant={direction === "he-en" ? "default" : "outline"}
              onClick={() => setDirection("he-en")}
              className="flex-1 max-w-xs"
            >
              עברית - English
            </Button>
            <Button
              variant={direction === "en-he" ? "default" : "outline"}
              onClick={() => setDirection("en-he")}
              className="flex-1 max-w-xs"
            >
              English - עברית
            </Button>
          </div>
        </div>

        {/* Slot Machine */}
        <SlotMachine 
          currentWord={displayWord}
          isSpinning={isSpinning}
          onPullHandle={pullHandle}
        />

        {/* Answer Input */}
        {currentWord && !isSpinning && (
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  setIsChecked(false);
                }}
                placeholder={direction === "he-en" ? "הקלד באנגלית..." : "הקלד בעברית..."}
                className={`text-center text-xl h-14 ${
                  isChecked 
                    ? isCorrect 
                      ? "border-green-500 bg-green-50 dark:bg-green-950" 
                      : "border-red-500 bg-red-50 dark:bg-red-950"
                    : ""
                }`}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    checkAnswer();
                  }
                }}
              />
              {isChecked && !isCorrect && (
                <div className="absolute top-full mt-2 w-full text-center">
                  <p className="text-sm text-muted-foreground">
                    התשובה הנכונה: <span className="font-bold text-foreground">
                      {direction === "he-en" ? currentWord.original : currentWord.translation}
                    </span>
                  </p>
                </div>
              )}
            </div>
            
            <Button 
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="w-full h-12 text-lg"
            >
              בדיקה
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roulette;
