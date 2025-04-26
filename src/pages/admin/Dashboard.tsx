import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download, 
  Filter, 
  LogOut, 
  PieChart, 
  Users, 
  FileText, 
  Calendar
} from 'lucide-react';

type StudentApplication = {
  id: string;
  firstName: string;
  lastName: string;
  name?: string; // For backward compatibility
  gradeLevel: string;
  submittedDate: string;
  status: string;
  email: string;
  documents?: any[];
};

const initialStudentApplications = [
  { 
    id: "APP-2023-0001", 
    firstName: "John",
    lastName: "Smith",
    name: "John Smith", 
    gradeLevel: "Grade 9", 
    submittedDate: "2023-05-10", 
    status: "Approved", 
    email: "john.smith@example.com" 
  },
  { 
    id: "APP-2023-0002", 
    firstName: "Maria",
    lastName: "Garcia",
    name: "Maria Garcia", 
    gradeLevel: "Grade 10", 
    submittedDate: "2023-05-11", 
    status: "Pending", 
    email: "maria.garcia@example.com" 
  },
  { 
    id: "APP-2023-0003", 
    firstName: "Robert",
    lastName: "Johnson",
    name: "Robert Johnson", 
    gradeLevel: "Grade 11", 
    submittedDate: "2023-05-12", 
    status: "Pending", 
    email: "robert.johnson@example.com" 
  },
  { 
    id: "APP-2023-0004", 
    firstName: "Emily",
    lastName: "Wang",
    name: "Emily Wang", 
    gradeLevel: "Grade 9", 
    submittedDate: "2023-05-13", 
    status: "Rejected", 
    email: "emily.wang@example.com" 
  },
  { 
    id: "APP-2023-0005", 
    firstName: "Michael",
    lastName: "Brown",
    name: "Michael Brown", 
    gradeLevel: "Grade 12", 
    submittedDate: "2023-05-14", 
    status: "Approved", 
    email: "michael.brown@example.com" 
  },
];

type SummaryData = {
  totalApplications: number;
  pending: number;
  approved: number;
  rejected: number;
  today: number;
  thisWeek: number;
  gradeDistribution: {
    grade7: number;
    grade8: number;
    grade9: number;
    grade10: number;
    grade11: number;
    grade12: number;
  };
};

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [studentApplications, setStudentApplications] = useState<StudentApplication[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentApplication[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    today: 0,
    thisWeek: 0,
    gradeDistribution: {
      grade7: 0,
      grade8: 0,
      grade9: 0,
      grade10: 0,
      grade11: 0,
      grade12: 0
    }
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const enrollmentsData = localStorage.getItem('enrollments');
    
    let applications: StudentApplication[] = [];
    
    if (enrollmentsData) {
      try {
        const parsedEnrollments = JSON.parse(enrollmentsData);
        applications = parsedEnrollments.map((enrollment: any) => ({
          id: enrollment.id || `APP-${Date.now()}`,
          firstName: enrollment.firstName || "",
          lastName: enrollment.lastName || "",
          name: `${enrollment.firstName} ${enrollment.lastName}`,
          gradeLevel: `Grade ${enrollment.gradeLevel}`,
          submittedDate: enrollment.submittedDate || new Date().toISOString().split('T')[0],
          status: enrollment.status || "Pending",
          email: enrollment.email || "",
          documents: enrollment.documents || []
        }));
      } catch (error) {
        console.error("Error parsing enrollments:", error);
        applications = [...initialStudentApplications];
      }
    } else {
      applications = [...initialStudentApplications];
    }
    
    setStudentApplications(applications);
    setFilteredStudents(applications);
    
    const summary = calculateSummaryData(applications);
    setSummaryData(summary);
  }, []);
  
  const calculateSummaryData = (applications: StudentApplication[]): SummaryData => {
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const pending = applications.filter(app => app.status.toLowerCase() === 'pending').length;
    const approved = applications.filter(app => app.status.toLowerCase() === 'approved').length;
    const rejected = applications.filter(app => app.status.toLowerCase() === 'rejected').length;
    const todayCount = applications.filter(app => app.submittedDate === today).length;
    const weekCount = applications.filter(app => {
      const appDate = new Date(app.submittedDate);
      return appDate >= lastWeek;
    }).length;
    
    const gradeDistribution = {
      grade7: applications.filter(app => app.gradeLevel.includes('7')).length,
      grade8: applications.filter(app => app.gradeLevel.includes('8')).length,
      grade9: applications.filter(app => app.gradeLevel.includes('9')).length,
      grade10: applications.filter(app => app.gradeLevel.includes('10')).length,
      grade11: applications.filter(app => app.gradeLevel.includes('11')).length,
      grade12: applications.filter(app => app.gradeLevel.includes('12')).length
    };
    
    return {
      totalApplications: applications.length,
      pending,
      approved,
      rejected,
      today: todayCount,
      thisWeek: weekCount,
      gradeDistribution
    };
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term === "") {
      filterByStatus(selectedStatus);
    } else {
      const filtered = studentApplications.filter(student => 
        student.name?.toLowerCase().includes(term.toLowerCase()) ||
        student.id.toLowerCase().includes(term.toLowerCase()) ||
        student.email.toLowerCase().includes(term.toLowerCase())
      );
      
      setFilteredStudents(
        selectedStatus === "all" 
          ? filtered 
          : filtered.filter(student => student.status.toLowerCase() === selectedStatus)
      );
    }
  };
  
  const filterByStatus = (status: string) => {
    setSelectedStatus(status);
    
    if (status === "all") {
      setFilteredStudents(
        searchTerm === "" 
          ? studentApplications 
          : studentApplications.filter(student => 
              student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
      );
    } else {
      const filtered = studentApplications.filter(
        student => student.status.toLowerCase() === status
      );
      
      setFilteredStudents(
        searchTerm === "" 
          ? filtered 
          : filtered.filter(student => 
              student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
      );
    }
  };
  
  const handleStatusChange = (id: string, newStatus: string) => {
    const updatedStudents = studentApplications.map(student => 
      student.id === id ? { ...student, status: newStatus } : student
    );
    
    setStudentApplications(updatedStudents);
    
    updateEnrollmentStatus(id, newStatus);
    
    toast({
      title: "Status Updated",
      description: `Application ${id} has been ${newStatus.toLowerCase()}.`,
    });
    
    filterByStatus(selectedStatus);
    setSummaryData(calculateSummaryData(updatedStudents));
  };
  
  const updateEnrollmentStatus = (id: string, newStatus: string) => {
    const enrollmentsData = localStorage.getItem('enrollments');
    
    if (enrollmentsData) {
      try {
        const enrollments = JSON.parse(enrollmentsData);
        const updatedEnrollments = enrollments.map((enrollment: any) => {
          if (enrollment.id === id) {
            return { ...enrollment, status: newStatus };
          }
          return enrollment;
        });
        
        localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
        
        const currentEnrollment = localStorage.getItem('currentStudentEnrollment');
        if (currentEnrollment) {
          const parsedCurrent = JSON.parse(currentEnrollment);
          if (parsedCurrent.id === id) {
            parsedCurrent.status = newStatus;
            localStorage.setItem('currentStudentEnrollment', JSON.stringify(parsedCurrent));
          }
        }
      } catch (error) {
        console.error("Error updating enrollment status:", error);
      }
    }
  };
  
  const handleDelete = (id: string) => {
    const updatedStudents = studentApplications.filter(student => student.id !== id);
    
    setStudentApplications(updatedStudents);
    
    deleteEnrollment(id);
    
    toast({
      title: "Application Deleted",
      description: `Application ${id} has been removed.`,
      variant: "destructive",
    });
    
    filterByStatus(selectedStatus);
    setSummaryData(calculateSummaryData(updatedStudents));
  };
  
  const deleteEnrollment = (id: string) => {
    const enrollmentsData = localStorage.getItem('enrollments');
    
    if (enrollmentsData) {
      try {
        const enrollments = JSON.parse(enrollmentsData);
        const updatedEnrollments = enrollments.filter((enrollment: any) => enrollment.id !== id);
        
        localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
        
        const currentEnrollment = localStorage.getItem('currentStudentEnrollment');
        if (currentEnrollment) {
          const parsedCurrent = JSON.parse(currentEnrollment);
          if (parsedCurrent.id === id) {
            localStorage.removeItem('currentStudentEnrollment');
          }
        }
      } catch (error) {
        console.error("Error deleting enrollment:", error);
      }
    }
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="mr-2 h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="mr-2 h-4 w-4 text-amber-500" />;
      case "rejected":
        return <AlertCircle className="mr-2 h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const handleEditApplication = (id: string) => {
    navigate(`/admin/application/${id}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-3xl font-bold">{summaryData.totalApplications}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-3xl font-bold">{summaryData.pending}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold">{summaryData.approved}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Applications</p>
                  <p className="text-3xl font-bold">{summaryData.today}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Enrollment overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Grade Distribution</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Grade 7</span>
                          <span>{summaryData.gradeDistribution.grade7}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div
                            className="h-2 bg-blue-400 rounded-full"
                            style={{ width: `${(summaryData.gradeDistribution.grade7 / Math.max(1, summaryData.totalApplications)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Grade 8</span>
                          <span>{summaryData.gradeDistribution.grade8}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div
                            className="h-2 bg-indigo-400 rounded-full"
                            style={{ width: `${(summaryData.gradeDistribution.grade8 / Math.max(1, summaryData.totalApplications)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Grade 9</span>
                          <span>{summaryData.gradeDistribution.grade9}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${(summaryData.gradeDistribution.grade9 / Math.max(1, summaryData.totalApplications)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Grade 10</span>
                          <span>{summaryData.gradeDistribution.grade10}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${(summaryData.gradeDistribution.grade10 / Math.max(1, summaryData.totalApplications)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Grade 11</span>
                          <span>{summaryData.gradeDistribution.grade11}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div
                            className="h-2 bg-amber-500 rounded-full"
                            style={{ width: `${(summaryData.gradeDistribution.grade11 / Math.max(1, summaryData.totalApplications)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Grade 12</span>
                          <span>{summaryData.gradeDistribution.grade12}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div
                            className="h-2 bg-purple-500 rounded-full"
                            style={{ width: `${(summaryData.gradeDistribution.grade12 / Math.max(1, summaryData.totalApplications)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Application Status</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                            Approved
                          </span>
                          <span>{summaryData.approved}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <div className="h-3 w-3 bg-amber-500 rounded-full mr-2"></div>
                            Pending
                          </span>
                          <span>{summaryData.pending}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                            Rejected
                          </span>
                          <span>{summaryData.rejected}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" /> View All Students
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" /> Export Applications
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <PieChart className="mr-2 h-4 w-4" /> Generate Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" /> Enrollment Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Student Applications</CardTitle>
                <CardDescription>
                  Manage and review student enrollment applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-2 sm:space-y-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, ID, or email"
                      className="pl-8 w-full sm:w-[300px]"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant={selectedStatus === "all" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => filterByStatus("all")}
                    >
                      All
                    </Button>
                    <Button 
                      variant={selectedStatus === "pending" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => filterByStatus("pending")}
                    >
                      <Clock className="mr-1 h-4 w-4" /> Pending
                    </Button>
                    <Button 
                      variant={selectedStatus === "approved" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => filterByStatus("approved")}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" /> Approved
                    </Button>
                    <Button 
                      variant={selectedStatus === "rejected" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => filterByStatus("rejected")}
                    >
                      <AlertCircle className="mr-1 h-4 w-4" /> Rejected
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Grade Level</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.id}</TableCell>
                            <TableCell>{student.name || `${student.firstName} ${student.lastName}`}</TableCell>
                            <TableCell>{student.gradeLevel}</TableCell>
                            <TableCell>{student.submittedDate}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getStatusIcon(student.status)}
                                <span>{student.status}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => handleEditApplication(student.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                
                                {student.status !== "approved" && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => handleStatusChange(student.id, "Approved")}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                {student.status !== "rejected" && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleStatusChange(student.id, "Rejected")}
                                  >
                                    <AlertCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDelete(student.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No applications found matching your search criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredStudents.length} of {studentApplications.length} applications
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
