import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "@/hooks/use-toast";

export const DailyTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [goalReached, setGoalReached] = useState(false);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);

  useEffect(() => {
    // Load today's session data
    const loadSessionData = () => {
      const today = new Date().toDateString();
      const savedDate = localStorage.getItem("timerDate");
      const savedSeconds = localStorage.getItem("timerSeconds");
      const savedGoalReached = localStorage.getItem("goalReached");
      const savedGoal = localStorage.getItem("dailyGoalMinutes");

      if (savedGoal) {
        setDailyGoalMinutes(parseInt(savedGoal));
      }

      if (savedDate === today) {
        setSeconds(parseInt(savedSeconds || "0"));
        setGoalReached(savedGoalReached === "true");
      } else {
        // New day, reset
        localStorage.setItem("timerDate", today);
        localStorage.setItem("timerSeconds", "0");
        localStorage.setItem("goalReached", "false");
        setSeconds(0);
        setGoalReached(false);
      }
    };

    loadSessionData();

    // Update timer every second
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const newSeconds = prev + 1;
        localStorage.setItem("timerSeconds", newSeconds.toString());

        // Check if goal reached
        const minutes = Math.floor(newSeconds / 60);
        if (minutes >= dailyGoalMinutes && !goalReached) {
          celebrateGoal();
          setGoalReached(true);
          localStorage.setItem("goalReached", "true");
        }

        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [goalReached, dailyGoalMinutes]);

  const celebrateGoal = () => {
    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4A574', '#8B5A3C', '#C9973B'],
    });

    // Success sound (using Web Audio API)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // C5
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Toast notification
    toast({
      title: "כל הכבוד! 🎉",
      description: "הגעת ליעד היומי שלך!",
      duration: 3000,
    });
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const progressPercent = Math.min((seconds / (dailyGoalMinutes * 60)) * 100, 100);

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="vintage-shadow bg-card rounded-xl p-6 border-2 border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">התרגול היומי</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {formatTime(seconds)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative w-full h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-accent transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-2 text-sm text-muted-foreground text-center">
          יעד: {dailyGoalMinutes} דקות
          {goalReached && " ✨ הושלם!"}
        </div>
      </div>
    </div>
  );
};
