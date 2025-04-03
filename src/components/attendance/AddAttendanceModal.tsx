
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getSubjectsByClass } from '@/types/results';
import { AttendanceRecord } from '../AttendanceTable';

interface AddAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<AttendanceRecord, 'id'>) => void;
}

const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({ isOpen, onClose, onSave }) => {
  const [student, setStudent] = useState('');
  const [classValue, setClassValue] = useState('Class 1');
  const [status, setStatus] = useState<'present' | 'absent' | 'late' | 'excused'>('present');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  
  // Get class number from class value
  const classNumber = parseInt(classValue.split(' ')[1]);
  
  // Get subjects for the selected class
  const subjectsForClass = getSubjectsByClass(classNumber);
  const [subject, setSubject] = useState(subjectsForClass[0]);

  const handleSubmit = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    
    onSave({
      student,
      class: classValue,
      subject, // Added subject field
      status,
      date: formattedDate,
      timeIn,
      timeOut
    });
    
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setStudent('');
    setClassValue('Class 1');
    setStatus('present');
    setTimeIn('');
    setTimeOut('');
    setSubject(subjectsForClass[0]);
  };
  
  const handleClassChange = (value: string) => {
    setClassValue(value);
    const newClassNumber = parseInt(value.split(' ')[1]);
    const newSubjectsForClass = getSubjectsByClass(newClassNumber);
    setSubject(newSubjectsForClass[0]);
  };
  
  // Generate class options (Class 1 to Class 10)
  const classOptions = Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Attendance Record</DialogTitle>
          <DialogDescription>
            Create a new attendance record for a student.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="student">Student Name</Label>
            <Input
              id="student"
              placeholder="Enter student name"
              value={student}
              onChange={(e) => setStudent(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="class">Class</Label>
              <Select value={classValue} onValueChange={handleClassChange}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject">
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
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: 'present' | 'absent' | 'late' | 'excused') => setStatus(value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="excused">Excused</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="timeIn">Time In</Label>
              <Input
                id="timeIn"
                placeholder="e.g., 09:00 AM"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
                disabled={status === 'absent' || status === 'excused'}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="timeOut">Time Out</Label>
              <Input
                id="timeOut"
                placeholder="e.g., 10:30 AM"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
                disabled={status === 'absent' || status === 'excused'}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!student}>Save Record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttendanceModal;
