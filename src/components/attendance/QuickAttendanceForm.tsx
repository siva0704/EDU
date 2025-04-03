
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { AttendanceRecord } from '../AttendanceTable';
import { getSubjectsByClass } from '@/types/results';

interface QuickAttendanceFormProps {
  onSubmit: (records: Omit<AttendanceRecord, 'id'>[]) => void;
}

// Sample students data for quick attendance
const sampleStudents = [
  { id: '1', name: 'Rahul Sharma', class: 'Class 5', section: 'A' },
  { id: '2', name: 'Priya Patel', class: 'Class 5', section: 'A' },
  { id: '3', name: 'Arjun Singh', class: 'Class 5', section: 'A' },
  { id: '4', name: 'Ananya Gupta', class: 'Class 5', section: 'A' },
  { id: '5', name: 'Vikram Iyer', class: 'Class 5', section: 'A' },
  { id: '6', name: 'Neha Kapoor', class: 'Class 5', section: 'B' },
  { id: '7', name: 'Amit Kumar', class: 'Class 5', section: 'B' },
  { id: '8', name: 'Riya Malhotra', class: 'Class 5', section: 'B' },
  { id: '9', name: 'Karan Mehra', class: 'Class 5', section: 'B' },
  { id: '10', name: 'Divya Reddy', class: 'Class 5', section: 'B' },
];

const QuickAttendanceForm: React.FC<QuickAttendanceFormProps> = ({ onSubmit }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [classValue, setClassValue] = useState('Class 5');
  const [section, setSection] = useState('A');
  const [timeIn, setTimeIn] = useState('09:00 AM');
  const [timeOut, setTimeOut] = useState('10:30 AM');
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: 'present' | 'absent' | 'late' }>({});
  
  // Get class number from class value
  const classNumber = parseInt(classValue.split(' ')[1]);
  
  // Get subjects for the selected class
  const subjectsForClass = getSubjectsByClass(classNumber);
  const [subject, setSubject] = useState(subjectsForClass[0]);
  
  // Filter students based on class and section selection
  const filteredStudents = sampleStudents.filter(
    student => student.class === classValue && student.section === section
  );
  
  // Initialize attendance status for all students
  React.useEffect(() => {
    const initialStatus: { [key: string]: 'present' | 'absent' | 'late' } = {};
    filteredStudents.forEach(student => {
      initialStatus[student.id] = 'present';
    });
    setAttendanceStatus(initialStatus);
  }, [filteredStudents]);
  
  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
  };
  
  const handleSubmit = () => {
    if (!date) {
      toast({
        title: "Date Required",
        description: "Please select a date for the attendance.",
        variant: "destructive"
      });
      return;
    }
    
    const formattedDate = format(date, 'MMM d, yyyy');
    
    const records = filteredStudents.map(student => ({
      student: student.name,
      class: classValue,
      subject: subject, // Added subject field
      status: attendanceStatus[student.id],
      date: formattedDate,
      timeIn: attendanceStatus[student.id] === 'present' ? timeIn : attendanceStatus[student.id] === 'late' ? '09:15 AM' : '',
      timeOut: attendanceStatus[student.id] === 'absent' ? '' : timeOut
    }));
    
    onSubmit(records);
    
    toast({
      title: "Attendance Saved",
      description: `Saved attendance records for ${filteredStudents.length} students.`,
      action: (
        <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        </div>
      )
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Quick Attendance</CardTitle>
        <CardDescription>
          Take attendance for a class in one go
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="mb-2 block">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="class-select" className="mb-2 block">Class</Label>
            <Select value={classValue} onValueChange={(value) => {
              setClassValue(value);
              const newClassNumber = parseInt(value.split(' ')[1]);
              const newSubjects = getSubjectsByClass(newClassNumber);
              setSubject(newSubjects[0]);
            }}>
              <SelectTrigger id="class-select">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 1} value={`Class ${i + 1}`}>
                    Class {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="section-select" className="mb-2 block">Section</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger id="section-select">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Section A</SelectItem>
                <SelectItem value="B">Section B</SelectItem>
                <SelectItem value="C">Section C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="subject-select" className="mb-2 block">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject-select">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectsForClass.map((subj) => (
                  <SelectItem key={subj} value={subj}>
                    {subj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm font-medium">Time</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time-in" className="mb-2 block">Time In</Label>
              <Select value={timeIn} onValueChange={setTimeIn}>
                <SelectTrigger id="time-in">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                  <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                  <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="time-out" className="mb-2 block">Time Out</Label>
              <Select value={timeOut} onValueChange={setTimeOut}>
                <SelectTrigger id="time-out">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:30 AM">09:30 AM</SelectItem>
                  <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                  <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                  <SelectItem value="12:30 PM">12:30 PM</SelectItem>
                  <SelectItem value="01:30 PM">01:30 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Students ({filteredStudents.length})</div>
          </div>
          
          <Card>
            <ScrollArea className="h-[300px]">
              <div className="p-4 space-y-4">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <div key={student.id} className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0">
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.class} - {student.section}</div>
                      </div>
                      <RadioGroup 
                        className="flex items-center space-x-2" 
                        value={attendanceStatus[student.id]} 
                        onValueChange={(value: 'present' | 'absent' | 'late') => handleStatusChange(student.id, value)}
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="present" id={`present-${student.id}`} />
                          <Label htmlFor={`present-${student.id}`} className="text-green-600 font-medium">Present</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="late" id={`late-${student.id}`} />
                          <Label htmlFor={`late-${student.id}`} className="text-yellow-600 font-medium">Late</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                          <Label htmlFor={`absent-${student.id}`} className="text-red-600 font-medium">Absent</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No students found for selected class and section.
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset</Button>
        <Button onClick={handleSubmit} disabled={filteredStudents.length === 0}>
          Save Attendance
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickAttendanceForm;
