
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Calendar, CheckCircle, AlertCircle, Home, LogOut } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = useState<EnrollmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.email || localStorage.getItem('currentUserId') || 'demo-user';
    
    console.log("Dashboard: Loading data for user", userId);
    
    const fetchEnrollmentData = async () => {
      try {
        // First check in enrollments array for this user's enrollment
        const allEnrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
        const userEnrollment = allEnrollments.find((e: any) => e.userId === userId || e.email === userId);
        
        // Then check for direct enrollment key
        const enrollmentKey = `enrollments-${userId}`;
        const directEnrollmentData = localStorage.getItem(enrollmentKey);
        
        console.log("Dashboard: Found enrollment data?", !!userEnrollment || !!directEnrollmentData);
        
        if (userEnrollment) {
          setApplicationStatus(userEnrollment);
        } else if (directEnrollmentData) {
          setApplicationStatus(JSON.parse(directEnrollmentData));
        } else {
          // If not in localStorage, use mock data
          const mockData = {
            id: "APP-2023-12345",
            firstName: currentUser.firstName || "John",
            lastName: currentUser.lastName || "Doe",
            email: userId,
            status: "Pending Review",
            submittedDate: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString().split('T')[0],
            academicYear: "2023-2024",
            gradeLevel: "Grade 9",
            documents: [
              { id: 1, name: "Birth Certificate", status: "Verified", date: new Date().toISOString().split('T')[0] },
              { id: 2, name: "Report Card / Form 138", status: "Pending", date: new Date().toISOString().split('T')[0] },
              { id: 3, name: "Certificate of Good Moral Character", status: "Pending", date: new Date().toISOString().split('T')[0] },
              { id: 4, name: "2x2 ID Pictures", status: "Pending", date: new Date().toISOString().split('T')[0] },
            ]
          };
          
          setApplicationStatus(mockData);
        }
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
        toast({
          title: "Error Loading Data",
          description: "Could not load your enrollment details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnrollmentData();
  }, [toast]);
  
  const handleLogout = () => {
    // Clear user session but keep enrollment data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserId');
    toast({ title: "Logged Out", description: "You have been logged out successfully." });
    navigate("/login");
  };
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!applicationStatus) {
    return <div className="flex justify-center items-center min-h-screen">No enrollment data found.</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => navigate("/")}>
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
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
        
        {/* Application Details */}
        <Card className="shadow-lg">
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
                  <p className="font-medium">{applicationStatus.gradeLevel}</p>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
