
import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2, User, FileText, CalendarCheck, CreditCard, Mail } from 'lucide-react';
import { cn } from "@/lib/utils";

const EnrollmentSteps = () => {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const steps = [
    {
      id: 1,
      title: "Create Account",
      description: "Sign up for a student account with your basic information.",
      icon: User,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Submit Documents",
      description: "Upload all required documents and transcripts.",
      icon: FileText,
      color: "bg-indigo-500",
    },
    {
      id: 3,
      title: "Select Programs",
      description: "Choose your preferred academic programs and electives.",
      icon: CheckCircle2,
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Schedule Interview",
      description: "If required, schedule an admission interview online.",
      icon: CalendarCheck,
      color: "bg-pink-500",
    },
    {
      id: 5,
      title: "Complete Payment",
      description: "Pay the registration fee to secure your spot.",
      icon: CreditCard,
      color: "bg-red-500",
    },
    {
      id: 6,
      title: "Receive Confirmation",
      description: "Get your enrollment confirmation and welcome package.",
      icon: Mail,
      color: "bg-orange-500",
    },
  ];

  return (
    <section 
      id="enrollment" 
      className="py-20 bg-secondary relative"
      ref={sectionRef}
    >
      <div className="container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="heading-lg mb-4">
            Enroll in <span className="text-gradient">6 Easy Steps</span>
          </h2>
          <p className="text-foreground/70 text-lg">
            Our streamlined enrollment process is designed to be intuitive and hassle-free, 
            guiding you from application to confirmation with minimal effort.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={cn(
                "bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-bounce relative overflow-hidden",
                inView ? "animate-scale-in opacity-100" : "opacity-0"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center text-white shrink-0",
                  step.color
                )}>
                  <step.icon size={24} />
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Step {step.id}</span>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-foreground/70">{step.description}</p>
                </div>
              </div>
              
              {/* Connecting line for desktop */}
              {index < steps.length - 1 && (index + 1) % 3 !== 0 && (
                <div className="hidden lg:block absolute top-12 right-0 w-8 h-px bg-border" style={{
                  transform: "translateX(100%)"
                }} />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <a 
            href="#start-enrollment" 
            className="btn-primary px-8 py-3 text-lg flex items-center space-x-2"
          >
            <span>Start Enrollment</span>
            <CheckCircle2 size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default EnrollmentSteps;
