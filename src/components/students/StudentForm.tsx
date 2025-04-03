
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import type { Student } from '@/types/results';

interface StudentFormProps {
  initialData?: Student;
  onSubmit: (student: Omit<Student, 'id'>) => void;
  onClose: () => void;
}

const generateRegistrationNumber = (): string => {
  return `STU${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
};

const StudentForm: React.FC<StudentFormProps> = ({
  initialData,
  onSubmit,
  onClose
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [registrationNumber, setRegistrationNumber] = useState(
    initialData?.registrationNumber || generateRegistrationNumber()
  );
  const [department, setDepartment] = useState(initialData?.department || 'Class 1');
  const [enrollmentDate, setEnrollmentDate] = useState<Date>(
    initialData?.enrollmentDate ? new Date(initialData.enrollmentDate) : new Date()
  );
  const [semester, setSemester] = useState(initialData?.semester || '2023-2024');
  const [yearOfStudy, setYearOfStudy] = useState(initialData?.yearOfStudy || 'A');
  const [isActive, setIsActive] = useState(initialData?.status !== 'inactive');
  
  const classes = [
    { value: 'Class 1', label: 'Class 1' },
    { value: 'Class 2', label: 'Class 2' },
    { value: 'Class 3', label: 'Class 3' },
    { value: 'Class 4', label: 'Class 4' },
    { value: 'Class 5', label: 'Class 5' },
    { value: 'Class 6', label: 'Class 6' },
    { value: 'Class 7', label: 'Class 7' },
    { value: 'Class 8', label: 'Class 8' },
    { value: 'Class 9', label: 'Class 9' },
    { value: 'Class 10', label: 'Class 10' }
  ];
  
  const sections = [
    { value: 'A', label: 'Section A' },
    { value: 'B', label: 'Section B' },
    { value: 'C', label: 'Section C' },
    { value: 'D', label: 'Section D' },
  ];
  
  const academicYears = [
    { value: '2023-2024', label: '2023-2024' },
    { value: '2022-2023', label: '2022-2023' },
    { value: '2021-2022', label: '2021-2022' },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !department || !semester || !yearOfStudy) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const studentData = {
      name,
      email,
      registrationNumber,
      department,
      enrollmentDate: enrollmentDate.toISOString().split('T')[0],
      semester,
      yearOfStudy,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${registrationNumber}`,
      status: isActive ? 'active' as const : 'inactive' as const
    };
    
    onSubmit(studentData);
    
    toast({
      title: "Success",
      description: `Student ${initialData ? 'updated' : 'created'} successfully.`,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Student's full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="student@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="registration">Registration Number</Label>
          <Input
            id="registration"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            disabled={!!initialData}
            required
          />
          {!initialData && (
            <p className="text-sm text-muted-foreground">
              Auto-generated. You can change it if needed.
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="class">Class</Label>
          <Select value={department} onValueChange={setDepartment} required>
            <SelectTrigger id="class">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((classOption) => (
                <SelectItem key={classOption.value} value={classOption.value}>
                  {classOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="section">Section</Label>
          <Select value={yearOfStudy} onValueChange={setYearOfStudy} required>
            <SelectTrigger id="section">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section.value} value={section.value}>
                  {section.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="academic-year">Academic Year</Label>
          <Select value={semester} onValueChange={setSemester} required>
            <SelectTrigger id="academic-year">
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
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
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={enrollmentDate}
                onSelect={(date) => setEnrollmentDate(date || new Date())}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="active-status" checked={isActive} onCheckedChange={setIsActive} />
        <Label htmlFor="active-status">Active Student</Label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Student
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
