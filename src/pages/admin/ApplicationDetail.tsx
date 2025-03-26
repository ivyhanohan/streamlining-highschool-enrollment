
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  School, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Edit, 
  Save
} from 'lucide-react';

// Mock student data
const studentData = {
  id: "APP-2023-0003",
  personalInfo: {
    firstName: "Robert",
    middleName: "James",
    lastName: "Johnson",
    dateOfBirth: "2007-08-15",
    gender: "Male",
    email: "robert.johnson@example.com",
    phone: "(555) 123-4567",
    address: "789 Oak Street, Apt 12",
    city: "Springfield",
    state: "IL",
    zipCode: "62704"
  },
  educationalInfo: {
    gradeLevel: "Grade 11",
    previousSchool: "Springfield Middle School",
    previousGPA: "3.8",
    desiredProgram: "Science and Technology"
  },
  documents: [
    { name: "Birth Certificate", status: "Verified", date: "2023-05-12", link: "#" },
    { name: "Report Card / Form 138", status: "Verified", date: "2023-05-12", link: "#" },
    { name: "Certificate of Good Moral Character", status: "Pending", date: "2023-05-12", link: "#" },
    { name: "2x2 ID Pictures", status: "Verified", date: "2023-05-12", link: "#" },
    { name: "Medical Certificate", status: "Not Submitted", date: "-", link: "#" },
  ],
  emergencyContact: {
    name: "Margaret Johnson",
    relationship: "Mother",
    phone: "(555) 987-6543",
    email: "margaret.johnson@example.com",
    address: "Same as student"
  },
  status: "Pending",
  submittedDate: "2023-05-12",
  lastUpdated: "2023-05-13",
  notes: "Student has expressed interest in joining the debate club."
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [status, setStatus] = useState(studentData.status);
  const [notes, setNotes] = useState(studentData.notes);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(studentData);
  
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    
    toast({
      title: "Status Updated",
      description: `Application status has been changed to ${newStatus}.`,
    });
  };
  
  const handleSaveNotes = () => {
    toast({
      title: "Notes Saved",
      description: "Application notes have been updated.",
    });
  };
  
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    
    // When canceling edit, revert changes
    if (isEditing) {
      setEditedStudent(studentData);
    }
  };
  
  const handleSaveChanges = () => {
    // In a real app, this would send updated data to the server
    
    toast({
      title: "Changes Saved",
      description: "Student information has been updated.",
    });
    
    setIsEditing(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
    setEditedStudent({
      ...editedStudent,
      [section]: {
        ...editedStudent[section as keyof typeof editedStudent],
        [field]: e.target.value
      }
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return <CheckCircle className="mr-2 h-4 w-4 text-green-500" />;
      case "pending":
        return <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />;
      case "not submitted":
        return <AlertCircle className="mr-2 h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={toggleEdit}>
              {isEditing ? "Cancel" : <><Edit className="mr-2 h-4 w-4" /> Edit</>}
            </Button>
            
            {isEditing && (
              <Button onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Details Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-2xl">Student Details</CardTitle>
                  <CardDescription>
                    Application ID: {editedStudent.id}
                  </CardDescription>
                </div>
                
                <div className={`px-4 py-1 rounded-full text-sm font-medium ${
                  status === "Approved" ? "bg-green-100 text-green-700" :
                  status === "Rejected" ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {status}
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <UserCircle className="mr-2 h-5 w-5 text-primary" />
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground block">Full Name</label>
                        {isEditing ? (
                          <div className="grid grid-cols-3 gap-2">
                            <Input 
                              value={editedStudent.personalInfo.firstName} 
                              onChange={(e) => handleInputChange(e, "personalInfo", "firstName")}
                            />
                            <Input 
                              value={editedStudent.personalInfo.middleName} 
                              onChange={(e) => handleInputChange(e, "personalInfo", "middleName")}
                            />
                            <Input 
                              value={editedStudent.personalInfo.lastName} 
                              onChange={(e) => handleInputChange(e, "personalInfo", "lastName")}
                            />
                          </div>
                        ) : (
                          <p className="font-medium">
                            {editedStudent.personalInfo.firstName} {editedStudent.personalInfo.middleName} {editedStudent.personalInfo.lastName}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block">Date of Birth</label>
                        {isEditing ? (
                          <Input 
                            type="date" 
                            value={editedStudent.personalInfo.dateOfBirth} 
                            onChange={(e) => handleInputChange(e, "personalInfo", "dateOfBirth")}
                          />
                        ) : (
                          <p className="font-medium">
                            {new Date(editedStudent.personalInfo.dateOfBirth).toLocaleDateString('en-US', {
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block">Gender</label>
                        {isEditing ? (
                          <Input 
                            value={editedStudent.personalInfo.gender} 
                            onChange={(e) => handleInputChange(e, "personalInfo", "gender")}
                          />
                        ) : (
                          <p className="font-medium">{editedStudent.personalInfo.gender}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block">Email</label>
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          {isEditing ? (
                            <Input 
                              value={editedStudent.personalInfo.email} 
                              onChange={(e) => handleInputChange(e, "personalInfo", "email")}
                            />
                          ) : (
                            <p className="font-medium">{editedStudent.personalInfo.email}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block">Phone</label>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          {isEditing ? (
                            <Input 
                              value={editedStudent.personalInfo.phone} 
                              onChange={(e) => handleInputChange(e, "personalInfo", "phone")}
                            />
                          ) : (
                            <p className="font-medium">{editedStudent.personalInfo.phone}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="text-sm text-muted-foreground block">Address</label>
                        <div className="flex items-start">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-1" />
                          {isEditing ? (
                            <div className="grid grid-cols-1 gap-2 w-full">
                              <Input 
                                value={editedStudent.personalInfo.address} 
                                onChange={(e) => handleInputChange(e, "personalInfo", "address")}
                              />
                              <div className="grid grid-cols-3 gap-2">
                                <Input 
                                  placeholder="City"
                                  value={editedStudent.personalInfo.city} 
                                  onChange={(e) => handleInputChange(e, "personalInfo", "city")}
                                />
                                <Input 
                                  placeholder="State"
                                  value={editedStudent.personalInfo.state} 
                                  onChange={(e) => handleInputChange(e, "personalInfo", "state")}
                                />
                                <Input 
                                  placeholder="ZIP Code"
                                  value={editedStudent.personalInfo.zipCode} 
                                  onChange={(e) => handleInputChange(e, "personalInfo", "zipCode")}
                                />
                              </div>
                            </div>
                          ) : (
                            <p className="font-medium">
                              {editedStudent.personalInfo.address}, {editedStudent.personalInfo.city}, {editedStudent.personalInfo.state} {editedStudent.personalInfo.zipCode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Educational Information */}
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <School className="mr-2 h-5 w-5 text-primary" />
                      Educational Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground block">Grade Level</label>
                        {isEditing ? (
                          <Input 
                            value={editedStudent.educationalInfo.gradeLevel} 
                            onChange={(e) => handleInputChange(e, "educationalInfo", "gradeLevel")}
                          />
                        ) : (
                          <p className="font-medium">{editedStudent.educationalInfo.gradeLevel}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block">Previous School</label>
                        {isEditing ? (
                          <Input 
                            value={editedStudent.educationalInfo.previousSchool} 
                            onChange={(e) => handleInputChange(e, "educationalInfo", "previousSchool")}
                          />
                        ) : (
                          <p className="font-medium">{editedStudent.educationalInfo.previousSchool}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block">Previous GPA</label>
                        {isEditing ? (
                          <Input 
                            value={editedStudent.educationalInfo.previousGPA} 
                            onChange={(e) => handleInputChange(e, "educationalInfo", "previousGPA")}
                          />
                        ) : (
                          <p className="font-medium">{editedStudent.educationalInfo.previousGPA}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block">Desired Program</label>
                        {isEditing ? (
                          <Input 
                            value={editedStudent.educationalInfo.desiredProgram} 
                            onChange={(e) => handleInputChange(e, "educationalInfo", "desiredProgram")}
                          />
                        ) : (
                          <p className="font-medium">{editedStudent.educationalInfo.desiredProgram}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Emergency Contact */}
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <Phone className="mr-2 h-5 w-5 text-primary" />
                      Emergency Contact
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground block">Name</label>
                        {isEditing ? (
                          <Input 
                            value={editedStudent.emergencyContact.name} 
                            onChange={(e) => handleInputChange(e, "emergencyContact", "name")}
                          />
                        ) : (
                          <p className="font-medium">{editedStudent.emergencyContact.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block">Relationship</label>
                        {isEditing ? (
                          <Input 
                            value={editedStudent.emergencyContact.relationship} 
                            onChange={(e) => handleInputChange(e, "emergencyContact", "relationship")}
                          />
                        ) : (
                          <p className="font-medium">{editedStudent.emergencyContact.relationship}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block">Phone</label>
                        {isEditing ? (
                          <Input 
                            value={editedStudent.emergencyContact.phone} 
                            onChange={(e) => handleInputChange(e, "emergencyContact", "phone")}
                          />
                        ) : (
                          <p className="font-medium">{editedStudent.emergencyContact.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block">Email</label>
                        {isEditing ? (
                          <Input 
                            value={editedStudent.emergencyContact.email} 
                            onChange={(e) => handleInputChange(e, "emergencyContact", "email")}
                          />
                        ) : (
                          <p className="font-medium">{editedStudent.emergencyContact.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Documents Card */}
            <Card>
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
                <CardDescription>
                  Review and verify student documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editedStudent.documents.map((doc, index) => (
                      <TableRow key={index}>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusIcon(doc.status)}
                            <span>{doc.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>
                  Update the status of this application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Current Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      status === "Approved" ? "bg-green-100 text-green-700" :
                      status === "Rejected" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {status}
                    </span>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Submitted:</span>
                      <span>{editedStudent.submittedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span>{editedStudent.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleStatusChange("Approved")}
                    disabled={status === "Approved"}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve Application
                  </Button>
                  
                  <Button 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => handleStatusChange("Pending")}
                    disabled={status === "Pending"}
                  >
                    <Calendar className="mr-2 h-4 w-4" /> Mark as Pending
                  </Button>
                  
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleStatusChange("Rejected")}
                    disabled={status === "Rejected"}
                  >
                    <AlertCircle className="mr-2 h-4 w-4" /> Reject Application
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Notes Card */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>
                  Add private notes to this application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Add notes about this student..." 
                  className="min-h-[150px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotes} className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Save Notes
                </Button>
              </CardFooter>
            </Card>
            
            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Application History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4">
                    <p className="text-sm text-muted-foreground">May 13, 2023 - 10:45 AM</p>
                    <p className="font-medium">Initial review completed</p>
                    <p className="text-sm">by Admin User</p>
                  </div>
                  
                  <div className="border-l-2 border-primary pl-4">
                    <p className="text-sm text-muted-foreground">May 12, 2023 - 2:30 PM</p>
                    <p className="font-medium">Documents received</p>
                    <p className="text-sm">Birth Certificate, Report Card verified</p>
                  </div>
                  
                  <div className="border-l-2 border-primary pl-4">
                    <p className="text-sm text-muted-foreground">May 12, 2023 - 9:15 AM</p>
                    <p className="font-medium">Application submitted</p>
                    <p className="text-sm">by Robert Johnson</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
