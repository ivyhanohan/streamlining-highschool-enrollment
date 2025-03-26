
import React, { useState } from 'react';
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

// Mock data for students
const studentApplications = [
  { 
    id: "APP-2023-0001", 
    name: "John Smith", 
    gradeLevel: "Grade 9", 
    submittedDate: "2023-05-10", 
    status: "Approved", 
    email: "john.smith@example.com" 
  },
  { 
    id: "APP-2023-0002", 
    name: "Maria Garcia", 
    gradeLevel: "Grade 10", 
    submittedDate: "2023-05-11", 
    status: "Pending", 
    email: "maria.garcia@example.com" 
  },
  { 
    id: "APP-2023-0003", 
    name: "Robert Johnson", 
    gradeLevel: "Grade 11", 
    submittedDate: "2023-05-12", 
    status: "Pending", 
    email: "robert.johnson@example.com" 
  },
  { 
    id: "APP-2023-0004", 
    name: "Emily Wang", 
    gradeLevel: "Grade 9", 
    submittedDate: "2023-05-13", 
    status: "Rejected", 
    email: "emily.wang@example.com" 
  },
  { 
    id: "APP-2023-0005", 
    name: "Michael Brown", 
    gradeLevel: "Grade 12", 
    submittedDate: "2023-05-14", 
    status: "Approved", 
    email: "michael.brown@example.com" 
  },
  { 
    id: "APP-2023-0006", 
    name: "Sarah Wilson", 
    gradeLevel: "Grade 10", 
    submittedDate: "2023-05-15", 
    status: "Pending", 
    email: "sarah.wilson@example.com" 
  },
  { 
    id: "APP-2023-0007", 
    name: "James Lee", 
    gradeLevel: "Grade 9", 
    submittedDate: "2023-05-16", 
    status: "Pending", 
    email: "james.lee@example.com" 
  },
];

// Summary data for dashboard
const summaryData = {
  totalApplications: 156,
  pending: 48,
  approved: 98,
  rejected: 10,
  today: 12,
  thisWeek: 37,
  gradeDistribution: {
    grade9: 67,
    grade10: 42,
    grade11: 31,
    grade12: 16
  }
};

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(studentApplications);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term === "") {
      filterByStatus(selectedStatus);
    } else {
      const filtered = studentApplications.filter(student => 
        student.name.toLowerCase().includes(term.toLowerCase()) ||
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
              student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    
    // In a real app, this would be an API call to update the database
    // For now, we'll just update our local state for demonstration
    
    toast({
      title: "Status Updated",
      description: `Application ${id} has been ${newStatus.toLowerCase()}.`,
    });
    
    // Update displayed students
    filterByStatus(selectedStatus);
  };
  
  const handleDelete = (id: string) => {
    // In a real app, this would be an API call to delete from the database
    // For now, we'll just update our local state for demonstration
    const updatedStudents = studentApplications.filter(student => student.id !== id);
    
    toast({
      title: "Application Deleted",
      description: `Application ${id} has been removed.`,
      variant: "destructive",
    });
    
    // Update displayed students
    filterByStatus(selectedStatus);
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
        {/* Summary Cards */}
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
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
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
                          <span>Grade 9</span>
                          <span>{summaryData.gradeDistribution.grade9}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${(summaryData.gradeDistribution.grade9 / summaryData.totalApplications) * 100}%` }}
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
                            style={{ width: `${(summaryData.gradeDistribution.grade10 / summaryData.totalApplications) * 100}%` }}
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
                            style={{ width: `${(summaryData.gradeDistribution.grade11 / summaryData.totalApplications) * 100}%` }}
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
                            style={{ width: `${(summaryData.gradeDistribution.grade12 / summaryData.totalApplications) * 100}%` }}
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
          
          {/* Student Applications Table */}
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
                            <TableCell>{student.name}</TableCell>
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
                                  className="h-8 w-8 p-0"
                                  onClick={() => navigate(`/admin/application/${student.id}`)}
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
