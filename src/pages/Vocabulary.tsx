import { Settings, Search, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DailyTimer } from "@/components/DailyTimer";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface VocabularyListItem {
  id: string;
  name: string;
}

const Vocabulary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lists, setLists] = useState<VocabularyListItem[]>([]);

  useEffect(() => {
    const savedLists = localStorage.getItem("vocabularyLists");
    if (savedLists) {
      setLists(JSON.parse(savedLists));
    } else {
      // Create initial list
      const initialList = { id: "1", name: "רשימה 1" };
      setLists([initialList]);
      localStorage.setItem("vocabularyLists", JSON.stringify([initialList]));
    }
  }, []);

  const addNewList = () => {
    const newId = String(lists.length + 1);
    const newList = { id: newId, name: `רשימה ${newId}` };
    const updatedLists = [...lists, newList];
    setLists(updatedLists);
    localStorage.setItem("vocabularyLists", JSON.stringify(updatedLists));
  };

  const deleteList = (listId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedLists = lists.filter(l => l.id !== listId);
    setLists(updatedLists);
    localStorage.setItem("vocabularyLists", JSON.stringify(updatedLists));
    localStorage.removeItem(`vocabularyWords_${listId}`);
    
    toast({
      title: "נמחק בהצלחה",
      description: "הרשימה הוסרה",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-1">אוצר מילים</h1>
            <p className="text-sm text-muted-foreground">בנה את אוסף המילים שלך</p>
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

      {/* Lists */}
      <div className="max-w-md mx-auto mt-8">
        <div className="space-y-3">
          {lists.map((list) => (
            <div key={list.id} className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/vocabulary/${list.id}`)}
                className="flex-1 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all p-6 text-right"
              >
                <h3 className="text-xl font-semibold text-foreground">{list.name}</h3>
              </button>
              <button
                onClick={(e) => deleteList(list.id, e)}
                className="w-12 h-12 bg-destructive/10 rounded-xl vintage-shadow border-2 border-destructive/20 hover:bg-destructive/20 transition-all flex items-center justify-center flex-shrink-0"
              >
                <Trash2 className="w-5 h-5 text-destructive" />
              </button>
            </div>
          ))}
          <button
            onClick={addNewList}
            className="w-full bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all p-6 flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vocabulary;
