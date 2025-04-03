
import React, { useState } from 'react';
import { useResults } from '@/context/ResultsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student } from '@/types/results';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface StudentFormProps {
  initialData: Student | null;
  onClose: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ initialData, onClose }) => {
  const { addStudent, updateStudent } = useResults();
  
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [registrationNumber, setRegistrationNumber] = useState(initialData?.registrationNumber || '');
  const [department, setDepartment] = useState(initialData?.department || '');
  const [enrollmentDate, setEnrollmentDate] = useState<Date | undefined>(
    initialData?.enrollmentDate ? new Date(initialData.enrollmentDate) : new Date()
  );
  const [semester, setSemester] = useState(initialData?.semester || '');
  const [yearOfStudy, setYearOfStudy] = useState(initialData?.yearOfStudy?.toString() || '1');
  const [isActive, setIsActive] = useState(initialData?.status !== 'inactive');
  
  const classes = [
    'Class 1',
    'Class 2',
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10'
  ];
  
  const semesters = [
    '2023-2024',
    '2022-2023',
    '2021-2022'
  ];
  
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  
  const handleSubmit = () => {
    if (!name || !email || !registrationNumber || !department || !enrollmentDate || !semester || !yearOfStudy) {
      alert('Please fill all required fields');
      return;
    }
    
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    const studentData = {
      name,
      email,
      registrationNumber,
      department,
      enrollmentDate: enrollmentDate.toISOString().split('T')[0],
      semester,
      yearOfStudy: parseInt(yearOfStudy),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${registrationNumber}`,
      status: isActive ? 'active' as const : 'inactive' as const
    };
    
    if (initialData) {
      updateStudent(initialData.id, studentData);
    } else {
      addStudent(studentData);
    }
    
    onClose();
  };
  
  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Student's full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.com"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Registration Number</Label>
          <Input 
            id="registrationNumber"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="STU20230001"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">Class</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map(cls => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Enrollment Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !enrollmentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {enrollmentDate ? format(enrollmentDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={enrollmentDate}
                onSelect={setEnrollmentDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="semester">Academic Year</Label>
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map(sem => (
                <SelectItem key={sem} value={sem}>{sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="yearOfStudy">Section</Label>
          <Select value={yearOfStudy} onValueChange={setYearOfStudy}>
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {['A', 'B', 'C', 'D'].map(section => (
                <SelectItem key={section} value={section}>Section {section}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2 pt-8">
          <Switch 
            id="status" 
            checked={isActive} 
            onCheckedChange={setIsActive} 
          />
          <Label htmlFor="status">Active Student</Label>
        </div>
      </div>
      
      <Separator />
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Update Student' : 'Add Student'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default StudentForm;
