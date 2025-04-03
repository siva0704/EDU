
import React from 'react';
import { Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { useDownloadUtils } from '@/utils/downloadUtils';

interface AttendanceFiltersProps {
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  subjectsForClass: string[];
}

const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  selectedSubject,
  setSelectedSubject,
  date,
  setDate,
  subjectsForClass
}) => {
  const { downloadSingleResource } = useDownloadUtils();
  
  const handleExport = () => {
    downloadSingleResource({
      id: 'my-attendance-export',
      title: 'My Attendance Records',
      type: 'attendance',
      url: '/attendance/export'
    });
    
    toast({
      title: "Export Started",
      description: "Your attendance records are being downloaded.",
    });
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      toast({
        title: "Date Selected",
        description: `Selected: ${format(selectedDate, 'PPP')}`,
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="w-full sm:w-48">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger>
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-subjects">All Subjects</SelectItem>
            {subjectsForClass.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-10">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{date ? format(date, 'PP') : 'Select Date'}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      <div className="flex-1"></div>
      
      <Button variant="outline" size="sm" className="h-10" onClick={handleExport}>
        <Download className="h-4 w-4 mr-2" />
        <span>Export My Records</span>
      </Button>
    </div>
  );
};

export default AttendanceFilters;
