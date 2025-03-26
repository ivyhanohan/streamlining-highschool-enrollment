
import React from 'react';
import { Clock, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ProgramCardProps {
  title: string;
  description: string;
  category: string;
  duration: string;
  startDate: string;
  level: string;
  imageUrl: string;
  index: number;
  inView: boolean;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  title,
  description,
  category,
  duration,
  startDate,
  level,
  imageUrl,
  index,
  inView
}) => {
  return (
    <div 
      className={cn(
        "group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-bounce relative",
        inView ? "animate-scale-in opacity-100" : "opacity-0"
      )}
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 ease-out-expo"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
            {category}
          </span>
          <span className="text-sm text-muted-foreground">{level}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4">
          <div className="flex items-center space-x-1.5">
            <Clock size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{duration}</span>
          </div>
          
          <div className="flex items-center space-x-1.5">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Starts: {startDate}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="text-sm font-medium">Program Details</span>
          <button className="p-2 rounded-full bg-secondary text-foreground/80 hover:bg-primary hover:text-white transition-colors">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
