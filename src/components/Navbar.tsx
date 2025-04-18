import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'programs', label: 'Programs', href: '#programs' },
    { id: 'enrollment', label: 'Enrollment', href: '#enrollment' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-soft py-4 px-6 md:px-12 lg:px-24",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-xl">
          EduEnroll
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href={item.href}
              className={cn(
                "nav-item",
                activeSection === item.id && "nav-item-active"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <a href="#login" className="text-foreground/80 hover:text-foreground transition-colors">Log in</a>
          <a href="#enroll-now" className="btn-primary">Enroll Now</a>
        </div>
        
        <button onClick={toggleMenu} className="md:hidden text-foreground">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <div className={cn(
        "md:hidden fixed inset-x-0 bg-white/95 backdrop-blur-md transition-all duration-300 ease-out-expo",
        isMenuOpen ? "top-16 opacity-100" : "top-[-100%] opacity-0"
      )}>
        <div className="p-6 space-y-4">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href={item.href}
              className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 border-t border-border flex flex-col space-y-3">
            <a href="#login" className="py-2 text-foreground/80 hover:text-foreground transition-colors">
              Log in
            </a>
            <a href="#enroll-now" className="btn-primary text-center">
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
