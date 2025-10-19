import { useState } from "react";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usefulWordsData } from "@/data/usefulWords";

interface Word {
  id: string;
  original: string;
  translation: string;
  source: string;
}

export const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getAllWords = (): Word[] => {
    const allWords: Word[] = [];

    // Get words from usefulWords
    usefulWordsData.forEach(list => {
      list.words.forEach(word => {
        allWords.push({
          ...word,
          source: list.name,
        });
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
            allWords.push({
              ...word,
              source: list.name,
            });
          });
        }
      });
    }

    return allWords;
  };

  const filteredWords = getAllWords().filter(word => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return (
      word.original.toLowerCase().includes(query) ||
      word.translation.toLowerCase().includes(query)
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center"
        >
          <Search className="w-5 h-5 text-primary" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-right text-2xl">🔍 חיפוש מילים</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="חפש מילה בעברית או באנגלית..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-right pr-10"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <ScrollArea className="h-[400px]">
            {!searchQuery.trim() ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>הקלד מילה כדי לחפש</p>
              </div>
            ) : filteredWords.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>לא נמצאו תוצאות עבור "{searchQuery}"</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-right mb-4">
                  נמצאו {filteredWords.length} תוצאות
                </p>
                {filteredWords.map((word) => (
                  <div
                    key={`${word.source}-${word.id}`}
                    className="bg-card rounded-xl vintage-shadow border-2 border-border p-4 hover:border-accent transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="text-left flex-1">
                        <div className="text-lg font-semibold text-foreground">{word.translation}</div>
                        <div className="text-sm text-muted-foreground mt-1">עברית</div>
                      </div>
                      <div className="text-right flex-1">
                        <div className="text-lg font-semibold text-foreground">{word.original}</div>
                        <div className="text-sm text-muted-foreground mt-1">English</div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">מקור: {word.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
