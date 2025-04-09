
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, ArrowRight } from 'lucide-react';

const requirements = [
  { id: 1, name: "Birth Certificate", description: "Original or certified true copy", required: true },
  { id: 2, name: "Report Card / Form 138", description: "From previous school year", required: true },
  { id: 3, name: "Certificate of Good Moral Character", description: "From previous school", required: true },
  { id: 4, name: "2x2 ID Pictures", description: "White background, 4 copies", required: true },
  { id: 5, name: "Medical Certificate", description: "From a licensed physician", required: true },
  { id: 6, name: "Proof of Residency", description: "Utility bill or valid ID", required: false },
];

const Welcome = () => {
  const [checkedRequirements, setCheckedRequirements] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  
  const handleCheck = (id: number, checked: boolean) => {
    setCheckedRequirements(prev => ({
      ...prev,
      [id]: checked
    }));
  };
  
  const allRequiredChecked = requirements
    .filter(req => req.required)
    .every(req => checkedRequirements[req.id]);
  
  const handleContinue = () => {
    navigate("/student/enrollment");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Welcome to Streamline High School</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for registering! Before you proceed with your enrollment, please ensure you have the following requirements.
          </p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Enrollment Requirements</CardTitle>
            <CardDescription>
              Please check each item once you have prepared it. Documents marked with (*) are mandatory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Ready</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <Checkbox 
                        id={`req-${req.id}`}
                        checked={checkedRequirements[req.id] || false}
                        onCheckedChange={(checked) => handleCheck(req.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <label 
                        htmlFor={`req-${req.id}`} 
                        className="font-medium cursor-pointer"
                      >
                        {req.name} {req.required && <span className="text-red-500">*</span>}
                      </label>
                    </TableCell>
                    <TableCell>{req.description}</TableCell>
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
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Please prepare all required documents for the next step
            </p>
            <Button 
              onClick={handleContinue} 
              disabled={!allRequiredChecked}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                If you have any questions about the enrollment process or requirements, 
                please contact our admissions office:
              </p>
              <div className="mt-4">
                <p><strong>Email:</strong> admissions@streamlinehigh.edu</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Office Hours:</strong> Monday to Friday, 8:00 AM - 4:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
