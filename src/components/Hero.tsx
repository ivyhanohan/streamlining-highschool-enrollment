
import React, { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Calendar, BookOpen, Users } from 'lucide-react';
import { cn } from "@/lib/utils";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="home" 
      className="min-h-screen pt-20 overflow-hidden relative"
      ref={heroRef}
    >
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-bl-full -z-10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-tr-full -z-10 blur-3xl" />
      
      <div className="container-padding flex flex-col items-center">
        {/* Subtle badge */}
        <div className="mb-8 px-4 py-2 bg-secondary rounded-full flex items-center space-x-2 animate-slide-down opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-subtle" />
          <span className="text-sm font-medium text-secondary-foreground">Enrollment for 2024-2025 is now open</span>
        </div>
        
        {/* Main heading */}
        <h1 className="heading-xl text-center max-w-5xl mb-6 opacity-0 animate-slide-down" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          Your Future Begins With The <span className="text-gradient">Right Education</span>
        </h1>
        
        {/* Subheading */}
        <p className="text-center text-xl text-foreground/80 max-w-2xl mb-10 opacity-0 animate-slide-down" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          Our online enrollment platform makes it easy to register for the programs that will shape your future. Discover your path to success.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-16 opacity-0 animate-slide-down" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <a href="#enrollment" className="btn-primary flex items-center justify-center space-x-2 px-8 py-3">
            <span>Enroll Now</span>
            <ArrowRight size={18} />
          </a>
          <a href="#programs" className="btn-secondary flex items-center justify-center space-x-2 px-8 py-3">
            <span>Explore Programs</span>
          </a>
        </div>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl opacity-0 animate-slide-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <div className="glass-card rounded-xl p-6 flex flex-col items-start space-y-4 hover:translate-y-[-5px] transition-bounce">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Calendar size={24} />
            </div>
            <h3 className="text-xl font-bold">Flexible Schedule</h3>
            <p className="text-foreground/70">Choose from various time slots that fit your lifestyle and learning preferences.</p>
          </div>
          
          <div className="glass-card rounded-xl p-6 flex flex-col items-start space-y-4 hover:translate-y-[-5px] transition-bounce">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold">Diverse Programs</h3>
            <p className="text-foreground/70">From STEM to Arts, we offer a wide range of academic and extracurricular programs.</p>
          </div>
          
          <div className="glass-card rounded-xl p-6 flex flex-col items-start space-y-4 hover:translate-y-[-5px] transition-bounce">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold">Supportive Community</h3>
            <p className="text-foreground/70">Join a vibrant community of students, teachers, and mentors who support your growth.</p>
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-20 w-full max-w-4xl opacity-0 animate-fade-in" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase tracking-wider text-foreground/50 mb-6">Trusted by students and parents across the country</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
              {['92% Student Satisfaction', '4.8/5 Parent Rating', '95% Graduation Rate', '87% College Acceptance'].map((stat, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle size={18} className="text-primary" />
                  <span className="text-foreground/80 font-medium">{stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave separator */}
      <div className="w-full h-24 overflow-hidden relative -mb-1">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            fill="currentColor"
            className="text-secondary"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
