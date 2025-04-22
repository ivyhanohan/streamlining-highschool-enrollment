
import React, { useState } from 'react';
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

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Check if it's the admin
    if (values.email === "admin@school.edu" && values.password === "admin123") {
      localStorage.setItem('currentUser', JSON.stringify({
        email: values.email,
        role: 'admin'
      }));
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard",
      });
      navigate("/admin/dashboard");
      return;
    }

    // Check if it's a registered student
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find(
      (u: any) => u.email === values.email && u.password === values.password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'student'
      }));
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate("/student/welcome");
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
