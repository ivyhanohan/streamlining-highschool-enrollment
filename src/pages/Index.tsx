import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EnrollmentSteps from '@/components/EnrollmentSteps';
import ProgramCard from '@/components/ProgramCard';
import Testimonial from '@/components/Testimonial';
import Footer from '@/components/Footer';
import { ArrowRight, Calendar, LogIn, UserPlus } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

// Mock data for programs
const programs = [
  {
    id: 1,
    title: "STEM Advanced Program",
    description: "A comprehensive curriculum focusing on Science, Technology, Engineering, and Mathematics with hands-on projects and advanced coursework.",
    category: "STEM",
    duration: "1 Year",
    startDate: "Sep 2024",
    level: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1581092921461-d3217ed8b073?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    title: "Creative Arts & Design",
    description: "Develop artistic skills across multiple mediums including digital design, painting, sculpture, and photography with professional guidance.",
    category: "Arts",
    duration: "1 Year",
    startDate: "Sep 2024",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1452802447250-470a88ac82bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    title: "Business Leadership",
    description: "Learn fundamental business concepts, entrepreneurship, marketing, and leadership skills through case studies and real-world projects.",
    category: "Business",
    duration: "1 Year",
    startDate: "Sep 2024",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 4,
    title: "Computer Science",
    description: "Master programming, algorithms, data structures, and software development with practical coding projects and industry-standard tools.",
    category: "Technology",
    duration: "1 Year",
    startDate: "Sep 2024",
    level: "All Levels",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 5,
    title: "Liberal Arts & Humanities",
    description: "Explore literature, philosophy, history, and cultural studies to develop critical thinking, writing, and analytical skills.",
    category: "Humanities",
    duration: "1 Year", 
    startDate: "Sep 2024",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 6,
    title: "Health Sciences",
    description: "Study anatomy, physiology, nutrition, and medical concepts with lab work and practical healthcare applications for future medical careers.",
    category: "Health",
    duration: "1 Year",
    startDate: "Sep 2024",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }
];

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    quote: "The enrollment process was incredibly smooth. I was able to sign up for all my classes in less than 30 minutes, and the support team was very helpful.",
    name: "Sarah Johnson",
    position: "Student, Class of 2023",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    quote: "As a parent, I appreciate how transparent and straightforward the enrollment platform is. It made choosing the right program for my child much easier.",
    name: "Michael Rodriguez",
    position: "Parent",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    quote: "The academic counseling feature helped me select courses that align perfectly with my college aspirations. I'm confident in my educational path now.",
    name: "Emily Chen",
    position: "Student, Class of 2024",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  }
];

// Important dates
const importantDates = [
  {
    id: 1,
    title: "Early Enrollment Begins",
    date: "March 15, 2024",
    description: "Priority enrollment opens for returning students"
  },
  {
    id: 2,
    title: "Regular Enrollment Period",
    date: "April 1 - June 30, 2024",
    description: "Open enrollment for all new and returning students"
  },
  {
    id: 3,
    title: "Late Enrollment Deadline",
    date: "August 15, 2024",
    description: "Final deadline for all enrollment applications"
  },
  {
    id: 4,
    title: "Orientation Day",
    date: "September 1, 2024",
    description: "Mandatory orientation for all new students"
  },
  {
    id: 5,
    title: "First Day of Classes",
    date: "September 5, 2024",
    description: "Academic year officially begins"
  }
];

const Index = () => {
  const [programsInView, setProgramsInView] = useState(false);
  const [testimonialsInView, setTestimonialsInView] = useState(false);
  const [datesInView, setDatesInView] = useState(false);
  const programsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === programsRef.current) {
            setProgramsInView(true);
          } else if (entry.target === testimonialsRef.current) {
            setTestimonialsInView(true);
          } else if (entry.target === datesRef.current) {
            setDatesInView(true);
          }
          observer.unobserve(entry.target);
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1
    });
    
    if (programsRef.current) observer.observe(programsRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (datesRef.current) observer.observe(datesRef.current);
    
    return () => {
      if (programsRef.current) observer.unobserve(programsRef.current);
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
      if (datesRef.current) observer.unobserve(datesRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main>
        {/* Hero Banner with Login/Register Buttons */}
        <section id="home" className="py-24 md:py-32 relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container-padding max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <div className="h-16 w-16 rounded-xl bg-white flex items-center justify-center text-primary mx-auto mb-6">
                <span className="text-primary font-bold text-3xl">S</span>
              </div>
              <h1 className="heading-xl mb-6">
                Streamlining <span className="text-blue-200">High School</span> Enrollment
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
                Your path to academic success begins here. A simple, efficient enrollment process designed for today's students.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-blue-50">
                    <LogIn className="mr-2 h-5 w-5" /> 
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-transparent border-2 border-white hover:bg-white/10">
                    <UserPlus className="mr-2 h-5 w-5" /> 
                    Register
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
          </div>
        </section>
        
        <Hero />
        
        {/* Programs Section */}
        <section id="programs" className="py-20" ref={programsRef}>
          <div className="container-padding">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Discover
              </span>
              <h2 className="heading-lg mb-4">
                Explore Our <span className="text-gradient">Academic Programs</span>
              </h2>
              <p className="text-foreground/70 text-lg">
                We offer a wide range of programs designed to nurture diverse interests and talents,
                preparing students for future success in their chosen fields.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {programs.map((program, index) => (
                <ProgramCard
                  key={program.id}
                  {...program}
                  index={index}
                  inView={programsInView}
                />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <a 
                href="#all-programs" 
                className="inline-flex items-center space-x-2 text-primary font-medium hover:underline"
              >
                <span>View all programs</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
        
        <EnrollmentSteps />
        
        {/* Important Dates Section */}
        <section id="dates" className="py-20 bg-foreground text-white" ref={datesRef}>
          <div className="container-padding">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1 bg-white/10 text-white rounded-full text-sm font-medium mb-4">
                Mark Your Calendar
              </span>
              <h2 className="heading-lg mb-4 text-white">
                Important <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">Dates & Deadlines</span>
              </h2>
              <p className="text-white/70 text-lg">
                Stay on track with these key dates for the 2024-2025 academic year enrollment process.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/20 transform md:translate-x-[-0.5px]"></div>
                
                {/* Timeline items */}
                <div className="space-y-12">
                  {importantDates.map((item, index) => (
                    <div 
                      key={item.id}
                      className={cn(
                        "relative flex flex-col md:flex-row",
                        index % 2 === 0 ? "md:flex-row-reverse" : ""
                      )}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 md:left-1/2 w-6 h-6 rounded-full border-4 border-primary bg-foreground transform translate-x-[-10px] md:translate-x-[-12px] mt-4"></div>
                      
                      {/* Content */}
                      <div className={cn(
                        "md:w-1/2 pl-10 md:pl-0",
                        index % 2 === 0 ? "md:pl-12" : "md:pr-12 md:text-right",
                        datesInView ? "animate-fade-in opacity-100" : "opacity-0"
                      )}
                      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                      >
                        <div className="glass-card-dark rounded-xl p-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar size={18} className="text-primary" />
                            <span className="font-medium text-white/80">{item.date}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                          <p className="text-white/70">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-16 flex justify-center">
              <a 
                href="#calendar" 
                className="btn-primary px-6 py-3 flex items-center space-x-2 bg-white text-foreground hover:bg-white/90"
              >
                <Calendar size={20} />
                <span>Download Full Calendar</span>
              </a>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-20" ref={testimonialsRef}>
          <div className="container-padding">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Testimonials
              </span>
              <h2 className="heading-lg mb-4">
                What Our <span className="text-gradient">Students & Parents Say</span>
              </h2>
              <p className="text-foreground/70 text-lg">
                Hear from our community about their experiences with our enrollment platform and academic programs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Testimonial
                  key={testimonial.id}
                  {...testimonial}
                  index={index}
                  inView={testimonialsInView}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section with Login/Register Buttons */}
        <section id="cta" className="py-20 bg-primary text-white">
          <div className="container-padding">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="heading-lg mb-6">
                Ready to Begin Your Academic Journey?
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                Take the first step toward a bright future by enrolling in our programs today.
                Our team is ready to guide you through every step of the process.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-8 py-3 text-lg">
                    <LogIn className="mr-2 h-5 w-5" /> 
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    <UserPlus className="mr-2 h-5 w-5" /> 
                    Register Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
