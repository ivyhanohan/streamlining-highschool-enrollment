
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear the currentUser from localStorage
    localStorage.removeItem('currentUser');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center mr-3">
                <span className="text-primary-foreground font-bold text-xl">S</span>
              </div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
