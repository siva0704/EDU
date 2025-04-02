
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { VideoProps } from '@/components/VideoCard';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type RecordingsFilterProps = {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoProps[];
  onApplyFilter: (filterOptions: {
    subjects: string[];
    teachers: string[];
    dateRange: 'all' | 'today' | 'week' | 'month';
  }) => void;
};

const RecordingsFilter: React.FC<RecordingsFilterProps> = ({
  isOpen,
  onClose,
  videos,
  onApplyFilter,
}) => {
  // Extract unique subjects and teachers
  const subjects = [...new Set(videos.map(video => video.subject))];
  const teachers = [...new Set(videos.map(video => video.teacher))];
  
  // Initialize state with empty arrays
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects(prev => [...prev, subject]);
    } else {
      setSelectedSubjects(prev => prev.filter(s => s !== subject));
    }
  };
  
  const handleTeacherChange = (teacher: string, checked: boolean) => {
    if (checked) {
      setSelectedTeachers(prev => [...prev, teacher]);
    } else {
      setSelectedTeachers(prev => prev.filter(t => t !== teacher));
    }
  };
  
  const handleApply = () => {
    onApplyFilter({
      subjects: selectedSubjects,
      teachers: selectedTeachers,
      dateRange
    });
    onClose();
  };
  
  const handleReset = () => {
    setSelectedSubjects([]);
    setSelectedTeachers([]);
    setDateRange('all');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Recordings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Subjects filter */}
          <div className="space-y-3">
            <Label className="font-medium">Subjects</Label>
            <ScrollArea className="h-[120px] rounded-md border p-2">
              <div className="space-y-2">
                {subjects.map(subject => (
                  <div className="flex items-center space-x-2" key={subject}>
                    <Checkbox 
                      id={`subject-${subject}`}
                      checked={selectedSubjects.includes(subject)}
                      onCheckedChange={(checked) => 
                        handleSubjectChange(subject, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`subject-${subject}`}
                      className="text-sm font-normal"
                    >
                      {subject}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <Separator />
          
          {/* Teachers filter */}
          <div className="space-y-3">
            <Label className="font-medium">Teachers</Label>
            <ScrollArea className="h-[120px] rounded-md border p-2">
              <div className="space-y-2">
                {teachers.map(teacher => (
                  <div className="flex items-center space-x-2" key={teacher}>
                    <Checkbox 
                      id={`teacher-${teacher}`}
                      checked={selectedTeachers.includes(teacher)}
                      onCheckedChange={(checked) => 
                        handleTeacherChange(teacher, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`teacher-${teacher}`}
                      className="text-sm font-normal"
                    >
                      {teacher}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <Separator />
          
          {/* Date range filter */}
          <div className="space-y-3">
            <Label className="font-medium">Date Range</Label>
            <RadioGroup value={dateRange} onValueChange={setDateRange as any}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="dr-all" />
                <Label htmlFor="dr-all">All Time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="today" id="dr-today" />
                <Label htmlFor="dr-today">Today</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="dr-week" />
                <Label htmlFor="dr-week">This Week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="dr-month" />
                <Label htmlFor="dr-month">This Month</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingsFilter;
