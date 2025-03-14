
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { AttendanceRecord } from '@/components/AttendanceTable';

interface AddAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<AttendanceRecord, 'id'>) => void;
}

const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({ isOpen, onClose, onSave }) => {
  const [student, setStudent] = useState('');
  const [classTitle, setClassTitle] = useState('');
  const [status, setStatus] = useState<'present' | 'absent' | 'late' | 'excused'>('present');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student || !classTitle) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
    
    const newRecord: Omit<AttendanceRecord, 'id'> = {
      student,
      class: classTitle,
      status,
      date: currentDate,
      timeIn: status === 'present' || status === 'late' ? (timeIn || '09:00 AM') : undefined,
      timeOut: status === 'present' || status === 'late' ? (timeOut || '10:30 AM') : undefined,
    };
    
    onSave(newRecord);
    resetForm();
  };
  
  const resetForm = () => {
    setStudent('');
    setClassTitle('');
    setStatus('present');
    setTimeIn('');
    setTimeOut('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Attendance Record</DialogTitle>
          <DialogDescription>
            Create a new attendance record. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student Name <span className="text-red-500">*</span></Label>
              <Input
                id="student"
                value={student}
                onChange={(e) => setStudent(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class">Class <span className="text-red-500">*</span></Label>
              <Input
                id="class"
                value={classTitle}
                onChange={(e) => setClassTitle(e.target.value)}
                placeholder="Mathematics 101"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Attendance Status <span className="text-red-500">*</span></Label>
              <RadioGroup value={status} onValueChange={(value) => setStatus(value as 'present' | 'absent' | 'late' | 'excused')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="present" id="present" />
                  <Label htmlFor="present">Present</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="absent" id="absent" />
                  <Label htmlFor="absent">Absent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="late" id="late" />
                  <Label htmlFor="late">Late</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excused" id="excused" />
                  <Label htmlFor="excused">Excused</Label>
                </div>
              </RadioGroup>
            </div>
            
            {(status === 'present' || status === 'late') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeIn">Time In</Label>
                  <Input
                    id="timeIn"
                    value={timeIn}
                    onChange={(e) => setTimeIn(e.target.value)}
                    placeholder="09:00 AM"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeOut">Time Out</Label>
                  <Input
                    id="timeOut"
                    value={timeOut}
                    onChange={(e) => setTimeOut(e.target.value)}
                    placeholder="10:30 AM"
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">Save Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttendanceModal;
