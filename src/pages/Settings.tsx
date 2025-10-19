import { ArrowLeft, Clock, Globe, Volume2, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { SearchDialog } from "@/components/SearchDialog";

const Settings = () => {
  const navigate = useNavigate();
  const [dailyGoal, setDailyGoal] = useState(15);

  useEffect(() => {
    const savedGoal = localStorage.getItem("dailyGoalMinutes");
    if (savedGoal) {
      setDailyGoal(parseInt(savedGoal));
    }
  }, []);

  const handleDailyGoalChange = (value: string) => {
    const minutes = parseInt(value);
    if (minutes >= 5 && minutes <= 120) {
      setDailyGoal(minutes);
      localStorage.setItem("dailyGoalMinutes", minutes.toString());
      toast({
        title: "היעד עודכן",
        description: `יעד יומי חדש: ${minutes} דקות`,
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="w-12 h-12 bg-card rounded-xl vintage-shadow border-2 border-border hover:border-accent transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h1 className="text-3xl font-bold text-primary">הגדרות</h1>
        </div>
        <SearchDialog />
      </header>

      <div className="max-w-md mx-auto space-y-4">
        <div className="vintage-shadow bg-card rounded-xl p-6 border-2 border-border">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">יעד יומי</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            הגדר את יעד זמן התרגול היומי שלך
          </p>
          <input
            type="number"
            value={dailyGoal}
            onChange={(e) => handleDailyGoalChange(e.target.value)}
            min={5}
            max={120}
            className="w-full px-4 py-2 bg-secondary rounded-lg border-2 border-border focus:border-accent outline-none"
          />
          <span className="text-xs text-muted-foreground mt-1 block">דקות ביום</span>
        </div>

        <div className="vintage-shadow bg-card rounded-xl p-6 border-2 border-border">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">שפת הלימוד</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            בחר את השפה שאתה לומד
          </p>
          <select className="w-full px-4 py-2 bg-secondary rounded-lg border-2 border-border focus:border-accent outline-none">
            <option>אנגלית</option>
            <option>ספרדית</option>
            <option>צרפתית</option>
            <option>גרמנית</option>
            <option>איטלקית</option>
            <option>פורטוגזית</option>
            <option>יפנית</option>
            <option>קוריאנית</option>
            <option>סינית</option>
          </select>
        </div>

        <div className="vintage-shadow bg-card rounded-xl p-6 border-2 border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">אפקטי קול</h3>
                <p className="text-xs text-muted-foreground">השמע צלילים בעת השגת הישגים</p>
              </div>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-full h-full bg-secondary rounded-full peer-checked:bg-accent transition-all cursor-pointer border-2 border-border"></div>
              <div className="absolute top-1 left-1 w-4 h-4 bg-card rounded-full transition-all peer-checked:translate-x-6"></div>
            </label>
          </div>
        </div>

        <div className="vintage-shadow bg-card rounded-xl p-6 border-2 border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">תזכורות יומיות</h3>
                <p className="text-xs text-muted-foreground">קבל התראות לתרגול</p>
              </div>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-full h-full bg-secondary rounded-full peer-checked:bg-accent transition-all cursor-pointer border-2 border-border"></div>
              <div className="absolute top-1 left-1 w-4 h-4 bg-card rounded-full transition-all peer-checked:translate-x-6"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
