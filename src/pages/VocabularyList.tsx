import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Word {
  id: string;
  original: string;
  translation: string;
}

const VocabularyList = () => {
  const navigate = useNavigate();
  const { listId } = useParams();
  const { toast } = useToast();
  const [listName, setListName] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [newOriginal, setNewOriginal] = useState("");
  const [newTranslation, setNewTranslation] = useState("");

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

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate("/vocabulary")}
          className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            📘 {listName}
          </h1>
          <p className="text-sm text-muted-foreground">נהל את רשימת המילים שלך</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
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
      </div>
    </div>
  );
};

export default VocabularyList;
