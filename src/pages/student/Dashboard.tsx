
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Calendar, FileText, Download, CheckCircle, AlertCircle, ArrowRight, Home } from 'lucide-react';

// Type for application status
type EnrollmentData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  submittedDate: string;
  lastUpdated?: string;
  academicYear?: string;
  gradeLevel: string;
  documents: {
    id: number;
    name: string;
    status: string;
    date: string;
  }[];
  nextSteps?: string[];
};

// Default next steps
const defaultNextSteps = [
  "Wait for document verification.",
  "Complete entrance assessment (schedule will be sent via email).",
  "Attend orientation session."
];

// Mock data for upcoming events
const upcomingEvents = [
  { id: 1, title: "Document Verification", date: "June 1, 2023", description: "Your submitted documents will be reviewed." },
  { id: 2, title: "Entrance Assessment", date: "June 15, 2023", description: "Online assessment for placement purposes." },
  { id: 3, title: "Orientation Session", date: "July 10, 2023", description: "School introduction and program overview." },
  { id: 4, title: "First Day of Classes", date: "August 15, 2023", description: "Official start of the academic year." },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = useState<EnrollmentData | null>(null);
  
  useEffect(() => {
    // Try to get enrollment data from localStorage
    const enrollmentData = localStorage.getItem('currentStudentEnrollment');
    
    if (enrollmentData) {
      const parsedData = JSON.parse(enrollmentData);
      
      // Ensure we have all required fields
      const enrichedData = {
        ...parsedData,
        lastUpdated: parsedData.lastUpdated || new Date().toISOString().split('T')[0],
        academicYear: parsedData.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        nextSteps: parsedData.nextSteps || defaultNextSteps
      };
      
      setApplicationStatus(enrichedData);
    } else {
      // If no enrollment data found, use mock data
      setApplicationStatus({
        id: "APP-2023-12345",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        status: "Pending Review",
        submittedDate: "2023-05-15",
        lastUpdated: "2023-05-16",
        academicYear: "2023-2024",
        gradeLevel: "Grade 9",
        documents: [
          { id: 1, name: "Birth Certificate", status: "Verified", date: "2023-05-16" },
          { id: 2, name: "Report Card / Form 138", status: "Pending", date: "2023-05-15" },
          { id: 3, name: "Certificate of Good Moral Character", status: "Pending", date: "2023-05-15" },
          { id: 4, name: "2x2 ID Pictures", status: "Pending", date: "2023-05-15" },
        ],
        nextSteps: defaultNextSteps
      });
    }
  }, []);
  
  if (!applicationStatus) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
        </div>
        
        {/* Status Summary Card */}
        <Card className="mb-8 shadow-lg border-l-4 border-amber-500">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h2 className="text-2xl font-bold text-amber-700">Application Status: {applicationStatus.status}</h2>
                <p className="text-muted-foreground mt-1">Application ID: {applicationStatus.id}</p>
              </div>
              
              <div className="mt-4 md:mt-0 space-y-1">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Submitted: {applicationStatus.submittedDate}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Last Updated: {applicationStatus.lastUpdated}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Application Details */}
          <div className="md:col-span-2">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>
                  Track the status of your enrollment application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Academic Year</p>
                      <p className="font-medium">{applicationStatus.academicYear}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Grade Level</p>
                      <p className="font-medium">Grade {applicationStatus.gradeLevel}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Document Status</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applicationStatus.documents.map((doc, index) => (
                          <TableRow key={index}>
                            <TableCell>{doc.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {doc.status === "Verified" ? (
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                ) : doc.status === "Pending" ? (
                                  <Clock className="mr-2 h-4 w-4 text-amber-500" />
                                ) : (
                                  <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                                )}
                                {doc.status}
                              </div>
                            </TableCell>
                            <TableCell>{doc.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Next Steps</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {applicationStatus.nextSteps?.map((step, index) => (
                        <li key={index} className="text-muted-foreground">{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> View Application
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Download Receipt
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Upcoming Events */}
          <div>
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Important dates for your enrollment process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center mb-2">
                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                        <p className="font-medium text-primary">{event.date}</p>
                      </div>
                      <h3 className="font-bold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  View Full Calendar <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Additional Resources */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
            <CardDescription>
              Helpful documents and information for new students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-6 justify-start flex-col items-start text-left">
                <div className="flex items-center w-full">
                  <FileText className="h-5 w-5 mr-2" />
                  <span className="font-medium">Student Handbook</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  School policies, rules, and guidelines
                </p>
              </Button>
              
              <Button variant="outline" className="h-auto py-6 justify-start flex-col items-start text-left">
                <div className="flex items-center w-full">
                  <FileText className="h-5 w-5 mr-2" />
                  <span className="font-medium">Academic Calendar</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Important dates for the school year
                </p>
              </Button>
              
              <Button variant="outline" className="h-auto py-6 justify-start flex-col items-start text-left">
                <div className="flex items-center w-full">
                  <FileText className="h-5 w-5 mr-2" />
                  <span className="font-medium">School Supplies List</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Required materials for each grade level
                </p>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
