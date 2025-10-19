import { ArrowLeft, Settings, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DailyTimer } from "@/components/DailyTimer";
import { SearchDialog } from "@/components/SearchDialog";
import { usefulWordsData, UsefulWord } from "@/data/usefulWords";

interface DictationAnswer {
  wordId: string;
  userAnswer: string;
  isCorrect: boolean;
}

const UsefulWordsList = () => {
  const navigate = useNavigate();
  const { listId } = useParams();
  const { toast } = useToast();
  const [direction, setDirection] = useState<"heb-eng" | "eng-heb">("heb-eng");
  const [isDictationMode, setIsDictationMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<DictationAnswer[] | null>(null);

  const currentList = usefulWordsData.find(list => list.id === listId);
  
  if (!currentList) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">רשימה לא נמצאה</h2>
          <Button onClick={() => navigate("/useful-words")}>חזור לרשימות</Button>
        </div>
      </div>
    );
  }

  const words = currentList.words;

  const startDictation = () => {
    setIsDictationMode(true);
    setUserAnswers({});
    setResults(null);
  };

  const checkAnswers = () => {
    const checkedResults: DictationAnswer[] = words.map(word => {
      const userAnswer = userAnswers[word.id]?.trim() || "";
      const correctAnswer = direction === "heb-eng" ? word.translation : word.original;
      
      return {
        wordId: word.id,
        userAnswer,
        isCorrect: userAnswer.toLowerCase() === correctAnswer.toLowerCase(),
      };
    });

    setResults(checkedResults);

    const correctCount = checkedResults.filter(r => r.isCorrect).length;
    const totalCount = checkedResults.length;
    const percentage = (correctCount / totalCount) * 100;

    let message = "";
    if (percentage >= 90) {
      message = "מעולה! 🎉 המשך כך!";
    } else if (percentage >= 70) {
      message = "יפה מאוד! 👏 אתה בדרך הנכונה!";
    } else if (percentage >= 50) {
      message = "לא רע! 💪 המשך להתאמן!";
    } else {
      message = "לא נורא! 📚 תתאמן עוד קצת ותשתפר!";
    }

    toast({
      title: `${correctCount}/${totalCount} תשובות נכונות`,
      description: message,
    });
  };

  const exitDictation = () => {
    setIsDictationMode(false);
    setUserAnswers({});
    setResults(null);
  };

  const getEncouragementMessage = () => {
    if (!results) return "";
    const correctCount = results.filter(r => r.isCorrect).length;
    const totalCount = results.length;
    const percentage = (correctCount / totalCount) * 100;

    if (percentage >= 90) {
      return "מעולה! 🎉 המשך כך!";
    } else if (percentage >= 70) {
      return "יפה מאוד! 👏 אתה בדרך הנכונה!";
    } else if (percentage >= 50) {
      return "לא רע! 💪 המשך להתאמן!";
    } else {
      return "לא נורא! 📚 תתאמן עוד קצת ותשתפר!";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-primary mb-1">📗 {currentList.name}</h1>
            <p className="text-sm text-muted-foreground">
              {currentList.nameEn} • {words.length} מילים
            </p>
          </div>
          <button 
            onClick={() => navigate("/useful-words")}
            className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
        </div>
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate("/settings")}
            className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-primary" />
          </button>
          <DailyTimer />
          <SearchDialog />
        </div>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        {!isDictationMode ? (
          <>
            {/* Direction Selection and Dictation Button */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  variant={direction === "heb-eng" ? "default" : "outline"}
                  onClick={() => setDirection("heb-eng")}
                  className="flex-1"
                >
                  עברית - English
                </Button>
                <Button
                  variant={direction === "eng-heb" ? "default" : "outline"}
                  onClick={() => setDirection("eng-heb")}
                  className="flex-1"
                >
                  English - עברית
                </Button>
              </div>
              <Button onClick={startDictation} className="w-full" size="lg">
                התחל הכתבה
              </Button>
            </div>

            {/* Words List - Read Only */}
            <div className="space-y-3">
              {words.map((word) => (
                <div
                  key={word.id}
                  className="bg-card rounded-xl vintage-shadow border-2 border-border p-4 text-right"
                >
                  <div className="text-lg font-semibold text-foreground">{word.original}</div>
                  <div className="text-sm text-muted-foreground">{word.translation}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Dictation Mode */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button onClick={exitDictation} variant="outline">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  חזור לרשימה
                </Button>
                <h2 className="text-xl font-bold text-primary">
                  הכתבה: {direction === "heb-eng" ? "עברית → English" : "English → עברית"}
                </h2>
              </div>

              {results && (
                <div className="bg-card rounded-xl vintage-shadow border-2 border-border p-6 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {results.filter(r => r.isCorrect).length}/{results.length} תשובות נכונות
                  </h3>
                  <p className="text-lg text-muted-foreground">{getEncouragementMessage()}</p>
                </div>
              )}

              <div className="space-y-3">
                {words.map((word) => {
                  const result = results?.find(r => r.wordId === word.id);
                  const question = direction === "heb-eng" ? word.original : word.translation;
                  const correctAnswer = direction === "heb-eng" ? word.translation : word.original;

                  return (
                    <div
                      key={word.id}
                      className={`bg-card rounded-xl vintage-shadow border-2 p-4 ${
                        result
                          ? result.isCorrect
                            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                            : "border-red-500 bg-red-50 dark:bg-red-950/20"
                          : "border-border"
                      }`}
                    >
                      <div className="text-right mb-3">
                        <span className="text-lg font-semibold text-foreground">{question}</span>
                      </div>
                      <Input
                        placeholder="הקלד את התרגום..."
                        value={userAnswers[word.id] || ""}
                        onChange={(e) => setUserAnswers({ ...userAnswers, [word.id]: e.target.value })}
                        disabled={!!results}
                        className={`text-right ${
                          result
                            ? result.isCorrect
                              ? "border-green-500"
                              : "border-red-500"
                            : ""
                        }`}
                      />
                      {result && !result.isCorrect && (
                        <div className="mt-2 text-right">
                          <span className="text-sm text-muted-foreground">התשובה הנכונה: </span>
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {correctAnswer}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={results ? exitDictation : checkAnswers}
                className="w-full"
                size="lg"
              >
                {results ? "סיים הכתבה" : "בדיקה"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UsefulWordsList;
