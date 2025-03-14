
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { VideoProps } from '../VideoCard';

interface FilterOptions {
  subjects: string[];
  teachers: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
}

interface RecordingsFilterProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoProps[];
  onApplyFilter: (filterOptions: FilterOptions) => void;
}

const RecordingsFilter: React.FC<RecordingsFilterProps> = ({ 
  isOpen, 
  onClose, 
  videos, 
  onApplyFilter 
}) => {
  // Extract unique subjects and teachers from videos
  const allSubjects = Array.from(new Set(videos.map(video => video.subject)));
  const allTeachers = Array.from(new Set(videos.map(video => video.teacher)));
  
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };
  
  const handleTeacherChange = (teacher: string) => {
    setSelectedTeachers(prev => 
      prev.includes(teacher) 
        ? prev.filter(t => t !== teacher) 
        : [...prev, teacher]
    );
  };
  
  const handleApplyFilter = () => {
    onApplyFilter({
      subjects: selectedSubjects,
      teachers: selectedTeachers,
      dateRange
    });
    onClose();
  };
  
  const handleResetFilter = () => {
    setSelectedSubjects([]);
    setSelectedTeachers([]);
    setDateRange('all');
    
    onApplyFilter({
      subjects: [],
      teachers: [],
      dateRange: 'all'
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filter Recordings</DialogTitle>
          <DialogDescription>
            Filter recordings by subject, teacher, or date.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Subject filters */}
          <div className="space-y-4">
            <Label className="text-base">Subjects</Label>
            <div className="grid grid-cols-2 gap-2">
              {allSubjects.map(subject => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`subject-${subject}`} 
                    checked={selectedSubjects.includes(subject)}
                    onCheckedChange={() => handleSubjectChange(subject)}
                  />
                  <label 
                    htmlFor={`subject-${subject}`}
                    className="text-sm cursor-pointer"
                  >
                    {subject}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Teacher filters */}
          <div className="space-y-4">
            <Label className="text-base">Teachers</Label>
            <div className="grid grid-cols-2 gap-2">
              {allTeachers.map(teacher => (
                <div key={teacher} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`teacher-${teacher}`} 
                    checked={selectedTeachers.includes(teacher)}
                    onCheckedChange={() => handleTeacherChange(teacher)}
                  />
                  <label 
                    htmlFor={`teacher-${teacher}`}
                    className="text-sm cursor-pointer"
                  >
                    {teacher}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Date range filters */}
          <div className="space-y-4">
            <Label className="text-base">Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' }
              ].map(range => (
                <div key={range.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`date-${range.value}`} 
                    checked={dateRange === range.value}
                    onCheckedChange={() => setDateRange(range.value as any)}
                  />
                  <label 
                    htmlFor={`date-${range.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {range.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleResetFilter}>
            Reset
          </Button>
          <Button type="button" onClick={handleApplyFilter}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingsFilter;
