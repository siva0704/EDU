
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { AttendanceRecord } from '@/components/AttendanceTable';

interface EditAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: AttendanceRecord) => void;
  record: AttendanceRecord | null;
}

const EditAttendanceModal: React.FC<EditAttendanceModalProps> = ({ isOpen, onClose, onSave, record }) => {
  const [student, setStudent] = useState('');
  const [classTitle, setClassTitle] = useState('');
  const [status, setStatus] = useState<'present' | 'absent' | 'late' | 'excused'>('present');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  
  useEffect(() => {
    if (record) {
      setStudent(record.student);
      setClassTitle(record.class);
      setStatus(record.status);
      setTimeIn(record.timeIn || '');
      setTimeOut(record.timeOut || '');
    }
  }, [record]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!record) return;
    
    if (!student || !classTitle) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedRecord: AttendanceRecord = {
      ...record,
      student,
      class: classTitle,
      status,
      timeIn: status === 'present' || status === 'late' ? timeIn : undefined,
      timeOut: status === 'present' || status === 'late' ? timeOut : undefined,
    };
    
    onSave(updatedRecord);
    onClose();
    
    toast({
      title: "Record Updated",
      description: `Attendance record for ${student} has been updated.`,
    });
  };
  
  if (!record) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Attendance Record</DialogTitle>
          <DialogDescription>
            Update attendance record for {record.student}.
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
                  <RadioGroupItem value="present" id="edit-present" />
                  <Label htmlFor="edit-present">Present</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="absent" id="edit-absent" />
                  <Label htmlFor="edit-absent">Absent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="late" id="edit-late" />
                  <Label htmlFor="edit-late">Late</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excused" id="edit-excused" />
                  <Label htmlFor="edit-excused">Excused</Label>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAttendanceModal;
