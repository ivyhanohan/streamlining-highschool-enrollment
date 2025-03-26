
import React from 'react';
import { Quote } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TestimonialProps {
  quote: string;
  name: string;
  position: string;
  imageUrl: string;
  index: number;
  inView: boolean;
}

const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  name,
  position,
  imageUrl,
  index,
  inView
}) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-xl p-8 relative",
        inView ? "animate-fade-in opacity-100" : "opacity-0"
      )}
      style={{ animationDelay: `${0.3 + index * 0.15}s` }}
    >
      <div className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
        <Quote size={20} />
      </div>
      
      <p className="text-foreground/80 mb-6 italic relative z-10">
        "{quote}"
      </p>
      
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-sm text-foreground/60">{position}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
