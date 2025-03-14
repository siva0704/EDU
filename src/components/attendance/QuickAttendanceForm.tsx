
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AttendanceRecord } from '@/components/AttendanceTable';
import { Check, X, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
}

interface QuickAttendanceFormProps {
  onSubmit: (records: Omit<AttendanceRecord, 'id'>[]) => void;
}

const sampleStudents: Student[] = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Charlie Brown' },
  { id: '4', name: 'Diana Prince' },
  { id: '5', name: 'Edward Stark' },
  { id: '6', name: 'Fiona Green' },
  { id: '7', name: 'George Wilson' },
  { id: '8', name: 'Helen Martin' },
  { id: '9', name: 'Ivan Rogers' },
  { id: '10', name: 'Janet Lee' },
  { id: '11', name: 'Kevin Clark' },
  { id: '12', name: 'Laura Hill' },
];

const QuickAttendanceForm: React.FC<QuickAttendanceFormProps> = ({ onSubmit }) => {
  const [classTitle, setClassTitle] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [search, setSearch] = useState('');
  
  const filteredStudents = search 
    ? sampleStudents.filter(student => 
        student.name.toLowerCase().includes(search.toLowerCase()))
    : sampleStudents;
  
  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
    
    // Provide immediate feedback
    const studentName = sampleStudents.find(s => s.id === studentId)?.name;
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    
    toast({
      title: `Marked ${statusText}`,
      description: `${studentName} marked as ${status}`,
      duration: 1500
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!classTitle) {
      toast({
        title: "Missing Information",
        description: "Please enter a class name",
        variant: "destructive"
      });
      return;
    }
    
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
    
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const records: Omit<AttendanceRecord, 'id'>[] = Object.entries(attendanceRecords).map(([studentId, status]) => {
      const student = sampleStudents.find(s => s.id === studentId);
      
      return {
        student: student?.name || '',
        class: classTitle,
        status,
        date: currentDate,
        timeIn: status === 'present' || status === 'late' ? currentTime : undefined,
        timeOut: undefined // This will be filled when ending the class
      };
    });
    
    if (records.length === 0) {
      toast({
        title: "No Attendance Recorded",
        description: "Please mark at least one student's attendance",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(records);
    
    // Reset form for next class
    setAttendanceRecords({});
    setClassTitle('');
    
    toast({
      title: "Attendance Saved",
      description: `Recorded attendance for ${records.length} students`,
    });
  };
  
  const getStatusColor = (studentId: string) => {
    const status = attendanceRecords[studentId];
    if (!status) return 'bg-gray-100 dark:bg-gray-800';
    
    switch (status) {
      case 'present':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'absent':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'late':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quick Attendance</CardTitle>
        <CardDescription>Mark attendance for your class quickly</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="class">Class Name</Label>
            <Select value={classTitle} onValueChange={setClassTitle}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Anatomy">Anatomy</SelectItem>
                <SelectItem value="Physiology">Physiology</SelectItem>
                <SelectItem value="Pathology">Pathology</SelectItem>
                <SelectItem value="Microbiology">Microbiology</SelectItem>
                <SelectItem value="Pharmacology">Pharmacology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="search">Students</Label>
              <div className="text-sm text-muted-foreground">
                {Object.keys(attendanceRecords).length} of {sampleStudents.length} marked
              </div>
            </div>
            
            <Input
              id="search"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            
            <div className="h-[350px] overflow-y-auto space-y-2 mt-2 pr-1">
              {filteredStudents.map((student) => (
                <div 
                  key={student.id}
                  className={cn(
                    "p-3 rounded-md border flex justify-between items-center transition-colors",
                    getStatusColor(student.id)
                  )}
                >
                  <span className="font-medium">{student.name}</span>
                  
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={attendanceRecords[student.id] === 'present' ? 'default' : 'outline'}
                      className="px-3 h-8"
                      onClick={() => handleStatusChange(student.id, 'present')}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Present
                    </Button>
                    
                    <Button
                      type="button"
                      size="sm"
                      variant={attendanceRecords[student.id] === 'absent' ? 'default' : 'outline'}
                      className="px-3 h-8"
                      onClick={() => handleStatusChange(student.id, 'absent')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Absent
                    </Button>
                    
                    <Button
                      type="button"
                      size="sm"
                      variant={attendanceRecords[student.id] === 'late' ? 'default' : 'outline'}
                      className="px-3 h-8"
                      onClick={() => handleStatusChange(student.id, 'late')}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Late
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <CardFooter className="px-0 pb-0 pt-6">
            <Button type="submit" className="w-full">Save Attendance</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickAttendanceForm;
