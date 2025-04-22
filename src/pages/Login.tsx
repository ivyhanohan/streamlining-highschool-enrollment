
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from 'lucide-react';

// Form validation schema with more flexible email validation for admin
const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

// Mock registered users - in a real app, this would come from a database
const registeredUsers = [
  // Admin user
  { email: "admin@school.edu", password: "admin123", role: "admin" },
  
  // Mock registered students - these would be added when students register
  { email: "john.doe@example.com", password: "password123", role: "student" },
  { email: "jane.smith@example.com", password: "password123", role: "student" }
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check if there are registered users from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      // We don't overwrite the admin user, just add the stored users to our validation list
    }
  }, []);

  const onSubmit = (values: FormValues) => {
    // Check for valid users
    const user = registeredUsers.find(
      u => u.email === values.email && u.password === values.password
    );
    
    // Check registeredUsers in localStorage as well
    const storedUsers = localStorage.getItem('registeredUsers');
    let localStorageUser = null;
    
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      localStorageUser = parsedUsers.find(
        (u: any) => u.email === values.email && u.password === values.password
      );
    }
    
    // If user found in hardcoded list or localStorage
    if (user || localStorageUser) {
      const validUser = user || localStorageUser;
      
      // Set user in localStorage for session management
      localStorage.setItem('currentUser', JSON.stringify({
        email: validUser.email,
        role: validUser.role || 'student'
      }));
      
      if (validUser.role === 'admin' || user?.email === 'admin@school.edu') {
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard",
        });
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/student/welcome");
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">S</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Log in to your account</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="" 
                          {...field} 
                        />
                        <button 
                          type="button" 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <p className="text-sm text-blue-700">
                  <strong>Admin Login:</strong> admin@school.edu / admin123
                </p>
              </div>
              
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" /> Log in
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <Link to="/forgot-password" className="underline underline-offset-4 hover:text-primary">
              Forgot your password?
            </Link>
          </div>
          <div className="text-sm text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              Back to home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
