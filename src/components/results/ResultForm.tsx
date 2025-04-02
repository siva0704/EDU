import React, { useState, useEffect } from 'react';
import { useResults } from '@/context/ResultsContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamResult, calculateGrade } from '@/types/results';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ResultFormProps {
  initialData: ExamResult | null;
  onClose: () => void;
}

const ResultForm: React.FC<ResultFormProps> = ({ initialData, onClose }) => {
  const { addResult, updateResult, students } = useResults();
  const { user } = useAuth();
  
  const [studentId, setStudentId] = useState(initialData?.studentId || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [examName, setExamName] = useState(initialData?.examName || '');
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : new Date()
  );
  const [score, setScore] = useState(initialData?.score?.toString() || '');
  const [totalMarks, setTotalMarks] = useState(initialData?.totalMarks?.toString() || '100');
  const [feedback, setFeedback] = useState(initialData?.feedback || '');
  const [semester, setSemester] = useState(initialData?.semester || '');
  
  // Get unique semesters from students
  const semesters = [...new Set(students.map(s => s.semester))];
  
  // Get unique subjects
  const subjects = [
    'Mathematics 101', 
    'Physics 201', 
    'Computer Science 102', 
    'Biology 101',
    'Chemistry 201',
    'Literature 101',
    'Programming 202'
  ];
  
  // Calculate grade based on score
  const grade = score && totalMarks 
    ? calculateGrade(parseInt(score), parseInt(totalMarks))
    : '';
  
  const handleSubmit = () => {
    const selectedStudent = students.find(s => s.id === studentId);
    
    if (!selectedStudent) {
      alert('Please select a valid student');
      return;
    }
    
    if (!subject || !examName || !date || !score || !totalMarks || !semester) {
      alert('Please fill all required fields');
      return;
    }
    
    const resultData = {
      studentId,
      studentName: selectedStudent.name,
      subject,
      examName,
      date: date.toISOString().split('T')[0],
      score: parseInt(score),
      totalMarks: parseInt(totalMarks),
      grade: calculateGrade(parseInt(score), parseInt(totalMarks)),
      semester,
      department: selectedStudent.department,
      feedback: feedback || undefined,
      announcedBy: user?.name,
      status: 'draft' as const,
    };
    
    if (initialData) {
      updateResult(initialData.id, resultData);
    } else {
      addResult(resultData);
    }
    
    onClose();
  };
  
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="student">Student</Label>
        <Select value={studentId} onValueChange={setStudentId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a student" />
          </SelectTrigger>
          <SelectContent>
            {students.map(student => (
              <SelectItem key={student.id} value={student.id}>
                {student.name} ({student.registrationNumber})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(sub => (
                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="examName">Exam Name</Label>
          <Input 
            id="examName"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="Mid-term Exam, Quiz 1, etc."
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Exam Date</Label>
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
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Select a semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map(sem => (
                <SelectItem key={sem} value={sem}>{sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="score">Score</Label>
          <Input 
            id="score" 
            type="number"
            value={score} 
            onChange={(e) => setScore(e.target.value)}
            placeholder="Student's score"
            min="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="totalMarks">Total Marks</Label>
          <Input 
            id="totalMarks" 
            type="number"
            value={totalMarks} 
            onChange={(e) => setTotalMarks(e.target.value)}
            placeholder="Total possible marks"
            min="1"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Grade</Label>
          <Input 
            value={grade} 
            disabled 
            className="bg-muted" 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="feedback">Feedback (Optional)</Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Provide feedback for the student"
          className="min-h-24"
        />
      </div>
      
      <Separator />
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Update Result' : 'Add Result'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ResultForm;
