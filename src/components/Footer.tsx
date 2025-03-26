
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="container-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">E</span>
              </div>
              <span className="font-display font-bold text-xl">EduEnroll</span>
            </div>
            <p className="text-white/70 mb-6">
              Making education accessible through a streamlined online enrollment platform. 
              Start your academic journey with us today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Programs', 'Enrollment', 'About', 'Contact', 'FAQ', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/70 hover:text-white transition-colors inline-block py-1">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Programs</h3>
            <ul className="space-y-3">
              {['STEM', 'Humanities', 'Arts & Design', 'Business', 'Computer Science', 'Languages', 'Physical Education'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/70 hover:text-white transition-colors inline-block py-1">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary mt-0.5" />
                <span className="text-white/70">123 Education Street, Academic City, CA 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-primary" />
                <span className="text-white/70">(123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-primary" />
                <span className="text-white/70">admissions@eduenroll.com</span>
              </li>
            </ul>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-bold mb-3">Subscribe to our newsletter</h4>
              <form className="flex">
                <input 
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-md bg-white/10 border-y border-l border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} EduEnroll. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
