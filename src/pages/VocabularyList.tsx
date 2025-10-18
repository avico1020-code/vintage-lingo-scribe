import { ArrowLeft, Plus, Trash2, Settings, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DailyTimer } from "@/components/DailyTimer";

interface Word {
  id: string;
  original: string;
  translation: string;
}

interface DictationAnswer {
  wordId: string;
  userAnswer: string;
  isCorrect: boolean;
}

const VocabularyList = () => {
  const navigate = useNavigate();
  const { listId } = useParams();
  const { toast } = useToast();
  const [listName, setListName] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [newOriginal, setNewOriginal] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [direction, setDirection] = useState<"heb-eng" | "eng-heb">("heb-eng");
  const [isDictationMode, setIsDictationMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<DictationAnswer[] | null>(null);

  const MAX_WORDS = 60;

  useEffect(() => {
    // Load list name
    const savedLists = localStorage.getItem("vocabularyLists");
    if (savedLists) {
      const lists = JSON.parse(savedLists);
      const currentList = lists.find((l: any) => l.id === listId);
      if (currentList) {
        setListName(currentList.name);
      }
    }

    // Load words for this list
    const savedWords = localStorage.getItem(`vocabularyWords_${listId}`);
    if (savedWords) {
      setWords(JSON.parse(savedWords));
    }
  }, [listId]);

  const saveWords = (updatedWords: Word[]) => {
    localStorage.setItem(`vocabularyWords_${listId}`, JSON.stringify(updatedWords));
    setWords(updatedWords);
  };

  const addWord = () => {
    if (!newOriginal.trim() || !newTranslation.trim()) {
      toast({
        title: "שגיאה",
        description: "יש למלא את שני השדות",
        variant: "destructive",
      });
      return;
    }

    if (words.length >= MAX_WORDS) {
      toast({
        title: "שגיאה",
        description: `רשימה יכולה להכיל מקסימום ${MAX_WORDS} מילים`,
        variant: "destructive",
      });
      return;
    }

    const newWord: Word = {
      id: Date.now().toString(),
      original: newOriginal.trim(),
      translation: newTranslation.trim(),
    };

    const updatedWords = [...words, newWord];
    saveWords(updatedWords);
    setNewOriginal("");
    setNewTranslation("");

    toast({
      title: "נוסף בהצלחה",
      description: "המילה נוספה לרשימה",
    });
  };

  const deleteWord = (id: string) => {
    const updatedWords = words.filter(w => w.id !== id);
    saveWords(updatedWords);
    
    toast({
      title: "נמחק בהצלחה",
      description: "המילה הוסרה מהרשימה",
    });
  };

  const startDictation = () => {
    if (words.length === 0) {
      toast({
        title: "שגיאה",
        description: "אין מילים ברשימה להכתבה",
        variant: "destructive",
      });
      return;
    }
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
            <h1 className="text-3xl font-bold text-primary mb-1">📘 {listName}</h1>
            <p className="text-sm text-muted-foreground">
              {words.length}/{MAX_WORDS} מילים
            </p>
          </div>
          <button 
            onClick={() => navigate("/vocabulary")}
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
          <button className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center opacity-50 cursor-not-allowed">
            <Search className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        {!isDictationMode ? (
          <>
            {/* Direction Selection and Dictation Button */}
            {words.length > 0 && (
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
            )}

            {/* Add New Word */}
            <div className="bg-card rounded-xl vintage-shadow border-2 border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">הוסף מילה חדשה</h2>
              <div className="space-y-3">
                <Input
                  placeholder="מילה במקור"
                  value={newOriginal}
                  onChange={(e) => setNewOriginal(e.target.value)}
                  className="text-right"
                />
                <Input
                  placeholder="תרגום"
                  value={newTranslation}
                  onChange={(e) => setNewTranslation(e.target.value)}
                  className="text-right"
                />
                <Button onClick={addWord} className="w-full">
                  <Plus className="w-4 h-4 ml-2" />
                  הוסף מילה
                </Button>
              </div>
            </div>

            {/* Words List */}
            <div className="space-y-3">
              {words.length === 0 ? (
                <div className="bg-card rounded-xl vintage-shadow border-2 border-border p-8 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">אין מילים עדיין</h2>
                  <p className="text-muted-foreground">
                    התחל להוסיף מילים לרשימה שלך
                  </p>
                </div>
              ) : (
                words.map((word) => (
                  <div
                    key={word.id}
                    className="bg-card rounded-xl vintage-shadow border-2 border-border p-4 flex items-center justify-between"
                  >
                    <button
                      onClick={() => deleteWord(word.id)}
                      className="w-10 h-10 bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-all flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                    <div className="flex-1 text-right mr-4">
                      <div className="text-lg font-semibold text-foreground">{word.original}</div>
                      <div className="text-sm text-muted-foreground">{word.translation}</div>
                    </div>
                  </div>
                ))
              )}
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

export default VocabularyList;
