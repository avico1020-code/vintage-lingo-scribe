import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationCardProps {
  icon: LucideIcon;
  title: string;
  emoji: string;
  to: string;
  delay?: number;
}

export const NavigationCard = ({ icon: Icon, title, emoji, to, delay = 0 }: NavigationCardProps) => {
  return (
    <Link to={to}>
      <div
        className="vintage-shadow bg-card rounded-xl p-6 border-2 border-border hover:border-accent transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center text-3xl">
            {emoji}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Icon className="w-5 h-5 text-primary" />
              {title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
};
