import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, User, Calendar, School, MapPin } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

// Mock application data - in a real app, this would come from a database
const mockApplications = [
  {
    id: "app1",
    studentName: "John Smith",
    email: "john.smith@example.com",
    dateOfBirth: "2006-05-15",
    grade: "9",
    previousSchool: "Lincoln Middle School",
    address: "123 Main St, Anytown, USA",
    parentName: "Mary Smith",
    parentEmail: "mary.smith@example.com",
    parentPhone: "(555) 123-4567",
    documents: [
      { name: "Birth Certificate", status: "verified" },
      { name: "Proof of Address", status: "pending" },
      { name: "Academic Records", status: "verified" }
    ],
    status: "under_review",
    submittedDate: "2023-03-10",
    notes: [
      { date: "2023-03-12", author: "Admin", content: "Called parent to request additional documentation." },
      { date: "2023-03-15", author: "Admin", content: "Received updated proof of address, reviewing now." }
    ]
  },
  {
    id: "app2",
    studentName: "Emma Johnson",
    email: "emma.johnson@example.com",
    dateOfBirth: "2005-11-22",
    grade: "10",
    previousSchool: "Washington High School",
    address: "456 Oak Ave, Somewhere, USA",
    parentName: "Robert Johnson",
    parentEmail: "robert.johnson@example.com",
    parentPhone: "(555) 987-6543",
    documents: [
      { name: "Birth Certificate", status: "verified" },
      { name: "Proof of Address", status: "verified" },
      { name: "Academic Records", status: "verified" }
    ],
    status: "approved",
    submittedDate: "2023-02-28",
    notes: [
      { date: "2023-03-01", author: "Admin", content: "All documents verified, application looks good." },
      { date: "2023-03-05", author: "Admin", content: "Approved for enrollment. Welcome email sent." }
    ]
  }
];

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    // In a real app, this would fetch from a database
    const fetchApplication = () => {
      setLoading(true);
      
      // Find the application in our mock data
      const foundApp = mockApplications.find(app => app.id === id);
      
      if (foundApp) {
        setApplication(foundApp);
      }
      
      setLoading(false);
    };
    
    fetchApplication();
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    // In a real app, this would update the database
    setApplication({
      ...application,
      status: newStatus
    });
    
    toast({
      title: "Status Updated",
      description: `Application status changed to ${newStatus.replace('_', ' ')}.`,
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    // In a real app, this would update the database
    const updatedNotes = [
      ...application.notes,
      {
        date: new Date().toISOString().split('T')[0],
        author: "Admin",
        content: newNote
      }
    ];
    
    setApplication({
      ...application,
      notes: updatedNotes
    });
    
    setNewNote("");
    
    toast({
      title: "Note Added",
      description: "Your note has been added to this application.",
    });
  };

  const handleDocumentStatusChange = (documentName: string, newStatus: string) => {
    // In a real app, this would update the database
    const updatedDocuments = application.documents.map((doc: any) => 
      doc.name === documentName ? { ...doc, status: newStatus } : doc
    );
    
    setApplication({
      ...application,
      documents: updatedDocuments
    });
    
    toast({
      title: "Document Status Updated",
      description: `${documentName} status changed to ${newStatus}.`,
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading application details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!application) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4">Application Not Found</h2>
          <p className="mb-6">The application you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-500">Under Review</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Application Details</h1>
          <div className="ml-auto">
            {getStatusBadge(application.status)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
                <CardDescription>Personal details and application information</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Student Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <User className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Full Name</p>
                              <p className="text-muted-foreground">{application.studentName}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Date of Birth</p>
                              <p className="text-muted-foreground">{application.dateOfBirth}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <School className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Previous School</p>
                              <p className="text-muted-foreground">{application.previousSchool}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Address</p>
                              <p className="text-muted-foreground">{application.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Parent/Guardian Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <User className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Full Name</p>
                              <p className="text-muted-foreground">{application.parentName}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="font-medium">Email</p>
                              <p className="text-muted-foreground">{application.parentEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                              <p className="font-medium">Phone</p>
                              <p className="text-muted-foreground">{application.parentPhone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documents">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-4">Required Documents</h3>
                      
                      {application.documents.map((doc: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                          <div className="flex items-center">
                            {getDocumentStatusIcon(doc.status)}
                            <span className="ml-2">{doc.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant={doc.status === 'verified' ? 'default' : 'outline'} 
                              onClick={() => handleDocumentStatusChange(doc.name, 'verified')}
                              className={doc.status === 'verified' ? 'bg-green-500 hover:bg-green-600' : ''}
                            >
                              Verify
                            </Button>
                            <Button 
                              size="sm" 
                              variant={doc.status === 'rejected' ? 'default' : 'outline'} 
                              onClick={() => handleDocumentStatusChange(doc.name, 'rejected')}
                              className={doc.status === 'rejected' ? 'bg-red-500 hover:bg-red-600' : ''}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-4">Application Notes</h3>
                      
                      <div className="flex space-x-2 mb-4">
                        <input
                          type="text"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add a note about this application..."
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <Button onClick={handleAddNote}>Add Note</Button>
                      </div>
                      
                      <div className="space-y-3">
                        {application.notes.length > 0 ? (
                          application.notes.map((note: any, index: number) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">{note.author}</span>
                                <span className="text-sm text-muted-foreground">{note.date}</span>
                              </div>
                              <p>{note.content}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No notes have been added yet.</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Submitted on {application.submittedDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    className={`w-full ${application.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    onClick={() => handleStatusChange('approved')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`w-full ${application.status === 'under_review' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}`}
                    onClick={() => handleStatusChange('under_review')}
                  >
                    <Clock className="mr-2 h-4 w-4" /> Mark as Under Review
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`w-full ${application.status === 'rejected' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
                    onClick={() => handleStatusChange('rejected')}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  <p>All status changes are logged and cannot be deleted.</p>
                </div>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Applicant
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Application
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Download Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ApplicationDetail;
