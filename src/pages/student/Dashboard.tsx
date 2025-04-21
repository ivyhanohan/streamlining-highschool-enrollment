
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Calendar, CheckCircle, AlertCircle, Home } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

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
  
  useEffect(() => {
    // Get user ID (in a real app, this would come from authentication)
    const userId = localStorage.getItem('currentUserId') || 'demo-user';
    
    const fetchEnrollmentData = async () => {
      try {
        const enrollmentRef = doc(db, 'enrollments', userId);
        const enrollmentSnap = await getDoc(enrollmentRef);
        
        if (enrollmentSnap.exists()) {
          setApplicationStatus(enrollmentSnap.data() as EnrollmentData);
        } else {
          // If no enrollment data found in Firebase, use mock data
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
            ]
          });
        }
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
        // Use mock data as fallback
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
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnrollmentData();
  }, []);
  
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
