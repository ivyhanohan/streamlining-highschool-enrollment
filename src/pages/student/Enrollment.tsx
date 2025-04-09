
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, ArrowRight, Save, Upload, Trash2 } from 'lucide-react';
import PaymentForm from "@/components/PaymentForm";

// Required documents
const requiredDocuments = [
  { id: 1, name: "Birth Certificate", description: "Original or certified true copy", required: true },
  { id: 2, name: "Report Card / Form 138", description: "From previous school year", required: true },
  { id: 3, name: "Certificate of Good Moral Character", description: "From previous school", required: true },
  { id: 4, name: "2x2 ID Pictures", description: "White background, 4 copies", required: true },
];

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

// Type for document upload
type UploadedDocument = {
  id: number;
  file: File;
  name: string;
};

const Enrollment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [draftSaved, setDraftSaved] = useState(false);
  
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

  // Load draft data on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('enrollmentDraft');
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      form.reset(parsed);
      
      // Also load saved documents if any
      const savedDocuments = localStorage.getItem('uploadedDocuments');
      if (savedDocuments) {
        try {
          // We can't store actual File objects in localStorage, 
          // so we'll just acknowledge that documents were uploaded
          toast({
            title: "Draft Loaded",
            description: "Your previously saved documents were noted. Please re-upload them."
          });
        } catch (error) {
          console.error("Error loading saved documents:", error);
        }
      }
    }
  }, [form]);

  const onSubmit = (values: FormValues) => {
    // Check if all required documents are uploaded
    const requiredDocIds = requiredDocuments.filter(doc => doc.required).map(doc => doc.id);
    const uploadedDocIds = uploadedDocuments.map(doc => doc.id);
    
    const allRequiredDocsUploaded = requiredDocIds.every(id => 
      uploadedDocIds.includes(id)
    );
    
    if (!allRequiredDocsUploaded) {
      toast({
        title: "Missing Documents",
        description: "Please upload all required documents before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    // Save the form data for later submission after payment
    setFormData(values);
    // Show the payment form
    setShowPayment(true);
  };

  const handleUpload = (docId: number, docName: string) => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,.pdf';
    
    // Handle the file selection
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        
        // Add to uploaded documents
        setUploadedDocuments(prev => {
          // Remove previous upload for this document if exists
          const filtered = prev.filter(doc => doc.id !== docId);
          return [...filtered, { id: docId, file, name: docName }];
        });
        
        toast({
          title: "Document Uploaded",
          description: `${docName} has been successfully uploaded.`,
        });
      }
    };
    
    // Trigger file dialog
    fileInput.click();
  };

  const removeDocument = (docId: number) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast({
      title: "Document Removed",
      description: "The document has been removed.",
    });
  };

  const handlePaymentComplete = () => {
    if (!formData) return;
    
    // Create enrollment data object to store
    const enrollmentData = {
      ...formData,
      id: `APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: "Pending",
      documents: uploadedDocuments.map(doc => ({
        id: doc.id,
        name: doc.name,
        status: "Pending",
        date: new Date().toISOString().split('T')[0]
      }))
    };
    
    // Save enrollment data to localStorage (simulating database)
    saveEnrollmentData(enrollmentData);
    
    // Clear the draft from local storage
    localStorage.removeItem('enrollmentDraft');
    localStorage.removeItem('uploadedDocuments');
    
    toast({
      title: "Enrollment Completed",
      description: "Your enrollment application has been submitted and payment received.",
    });
    
    // Navigate to dashboard
    navigate("/student/dashboard");
  };

  const saveEnrollmentData = (data: any) => {
    // Get existing enrollments or initialize empty array
    const existingEnrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
    
    // Add new enrollment
    const updatedEnrollments = [...existingEnrollments, data];
    
    // Save back to localStorage
    localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
    
    // Also save to student's personal enrollment data
    localStorage.setItem('currentStudentEnrollment', JSON.stringify(data));
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const handleSaveDraft = () => {
    const values = form.getValues();
    localStorage.setItem('enrollmentDraft', JSON.stringify(values));
    
    // Save document upload state (we can't save the actual files)
    localStorage.setItem('uploadedDocuments', JSON.stringify(
      uploadedDocuments.map(doc => ({ id: doc.id, name: doc.name }))
    ));
    
    setDraftSaved(true);
    toast({
      title: "Draft Saved",
      description: "Your enrollment form has been saved as a draft.",
    });
    
    // Reset the draft saved flag after 3 seconds
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleClearForm = () => {
    // Reset the form
    form.reset();
    // Clear uploaded documents
    setUploadedDocuments([]);
    // Clear from localStorage
    localStorage.removeItem('enrollmentDraft');
    localStorage.removeItem('uploadedDocuments');
    
    toast({
      title: "Form Cleared",
      description: "The enrollment form has been reset.",
    });
  };

  // If payment screen is showing, display only the payment component
  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Payment</h1>
            <p className="text-lg text-muted-foreground">
              Please complete your payment to finalize your enrollment.
            </p>
          </div>
          
          <PaymentForm 
            onPaymentComplete={handlePaymentComplete}
            onCancel={handlePaymentCancel}
          />
        </div>
      </div>
    );
  }

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
                              <SelectItem value="7">Grade 7</SelectItem>
                              <SelectItem value="8">Grade 8</SelectItem>
                              <SelectItem value="9">Grade 9 </SelectItem>
                              <SelectItem value="10">Grade 10 </SelectItem>
                              <SelectItem value="11">Grade 11 </SelectItem>
                              <SelectItem value="12">Grade 12 </SelectItem>
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
                  
                  {draftSaved && (
                    <Alert className="mb-4 bg-green-50 border-green-500">
                      <AlertDescription className="text-green-700">
                        Your enrollment form draft has been saved successfully.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {requiredDocuments.map((doc) => (
                        <div key={doc.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">
                              {doc.name} {doc.required && <span className="text-red-500">*</span>}
                            </p>
                            <div className="flex space-x-2">
                              {uploadedDocuments.some(uploaded => uploaded.id === doc.id) ? (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => removeDocument(doc.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Remove
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpload(doc.id, doc.name)}
                                >
                                  <Upload className="h-4 w-4 mr-2" /> Upload
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                          {uploadedDocuments.some(uploaded => uploaded.id === doc.id) && (
                            <p className="text-sm text-green-600 mt-1">
                              Document uploaded successfully
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => {}}>
                        <FileText className="mr-2 h-4 w-4" /> Download Requirements Checklist
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={handleClearForm}
                      >
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
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleSaveDraft}
                    >
                      <Save className="mr-2 h-4 w-4" /> Save Draft
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!uploadedDocuments.filter(doc => 
                        requiredDocuments.find(reqDoc => reqDoc.id === doc.id)?.required
                      ).length === requiredDocuments.filter(doc => doc.required).length}
                    >
                      Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
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
