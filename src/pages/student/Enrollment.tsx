
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, FileText, ArrowRight, Save } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.string().min(1, { message: "Please select a gender" }),
  address: z.string().min(10, { message: "Please enter your complete address" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State/Province is required" }),
  zipCode: z.string().min(5, { message: "Valid ZIP code is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  gradeLevel: z.string().min(1, { message: "Please select a grade level" }),
  previousSchool: z.string().optional(),
  emergencyContactName: z.string().min(2, { message: "Emergency contact name is required" }),
  emergencyContactPhone: z.string().min(10, { message: "Valid emergency contact phone is required" }),
  emergencyContactRelationship: z.string().min(2, { message: "Relationship is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const Enrollment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      email: "",
      phone: "",
      gradeLevel: "",
      previousSchool: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Mock submission (in a real app, this would send data to a server)
    console.log("Enrollment form data:", values);
    
    toast({
      title: "Enrollment Submitted",
      description: "Your enrollment application has been submitted successfully.",
    });
    
    // Navigate to dashboard
    navigate("/student/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Student Enrollment Form</h1>
          <p className="text-lg text-muted-foreground">
            Please fill out all required information accurately.
          </p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Enter your personal details for enrollment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Michael" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Address Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Address Information</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="123 Main St, Apt 4B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP/Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Educational Background */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Educational Information</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="gradeLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level Applying For</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="9">Grade 9 (Freshman)</SelectItem>
                              <SelectItem value="10">Grade 10 (Sophomore)</SelectItem>
                              <SelectItem value="11">Grade 11 (Junior)</SelectItem>
                              <SelectItem value="12">Grade 12 (Senior)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="previousSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous School (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Lincoln Middle School" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Emergency Contact Information</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emergencyContactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="emergencyContactRelationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                              <Input placeholder="Parent" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Document Upload Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Required Documents</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium">Birth Certificate</p>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" /> Upload
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Original or certified true copy</p>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium">Report Card / Form 138</p>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" /> Upload
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">From previous school year</p>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium">Certificate of Good Moral Character</p>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" /> Upload
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">From previous school</p>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium">2x2 ID Pictures</p>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" /> Upload
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">White background, 4 copies</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button type="button" variant="outline">
                        <FileText className="mr-2 h-4 w-4" /> Download Requirements Checklist
                      </Button>
                      
                      <Button type="button" variant="secondary" onClick={() => form.reset()}>
                        Clear Form
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => navigate("/student/welcome")}>
                    Back
                  </Button>
                  
                  <div className="space-x-2">
                    <Button type="button" variant="outline">
                      <Save className="mr-2 h-4 w-4" /> Save Draft
                    </Button>
                    <Button type="submit">
                      Submit Application <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Enrollment;
