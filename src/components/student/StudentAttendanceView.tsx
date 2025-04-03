
import React, { useState } from 'react';
import { Calendar, Search, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useDownloadUtils } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getSubjectsByClass } from '@/types/results';

export interface StudentAttendanceRecord {
  id: string;
  studentId: string;
  class: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  timeIn?: string;
  timeOut?: string;
}

// Sample data - in a real app, this would come from an API
const sampleStudentAttendance: StudentAttendanceRecord[] = [
  {
    id: '1',
    studentId: 'student-1',
    class: 'Class 5',
    subject: 'Mathematics',
    date: 'Apr 15, 2023',
    status: 'present',
    timeIn: '09:00 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '2',
    studentId: 'student-1',
    class: 'Class 5',
    subject: 'Hindi',
    date: 'Apr 16, 2023',
    status: 'late',
    timeIn: '09:15 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '3',
    studentId: 'student-1',
    class: 'Class 5',
    subject: 'Environmental Science',
    date: 'Apr 17, 2023',
    status: 'absent',
    timeIn: undefined,
    timeOut: undefined,
  },
  {
    id: '4',
    studentId: 'student-1',
    class: 'Class 5',
    subject: 'English',
    date: 'Apr 18, 2023',
    status: 'present',
    timeIn: '09:02 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '5',
    studentId: 'student-1',
    class: 'Class 5',
    subject: 'General Knowledge',
    date: 'Apr 19, 2023',
    status: 'excused',
    timeIn: undefined,
    timeOut: undefined,
  },
  {
    id: '6',
    studentId: 'student-2', // This shouldn't show for student-1
    class: 'Class 3',
    subject: 'Mathematics',
    date: 'Apr 15, 2023',
    status: 'present',
    timeIn: '08:55 AM',
    timeOut: '10:30 AM',
  },
];

const StudentAttendanceView: React.FC = () => {
  const { user } = useAuth();
  const { downloadSingleResource } = useDownloadUtils();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedSubject, setSelectedSubject] = useState('all-subjects');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  
  // Filter records to only show current student
  const studentRecords = sampleStudentAttendance.filter(record => 
    record.studentId === user?.id
  );
  
  // Get class number from user's department (if available)
  const classNumber = user?.department ? parseInt(user.department.split(' ')[1]) : 5;
  
  // Get appropriate subjects based on class
  const subjectsForClass = getSubjectsByClass(classNumber);
  
  // Apply additional filters
  const filteredRecords = studentRecords.filter(record => {
    const matchesSubject = selectedSubject === 'all-subjects' || record.subject === selectedSubject;
    const matchesDate = !date || record.date === format(date, 'MMM d, yyyy');
    return matchesSubject && matchesDate;
  });
  
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  
  // Calculate attendance statistics
  const totalClasses = studentRecords.length;
  const presentCount = studentRecords.filter(r => r.status === 'present').length;
  const lateCount = studentRecords.filter(r => r.status === 'late').length;
  const absentCount = studentRecords.filter(r => r.status === 'absent').length;
  const excusedCount = studentRecords.filter(r => r.status === 'excused').length;
  
  const attendancePercentage = totalClasses > 0 
    ? Math.round(((presentCount + lateCount) / totalClasses) * 100) 
    : 0;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'absent':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'late':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'excused':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
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
    <div className="space-y-6">
      {/* Registration number display */}
      {user?.registrationNumber && (
        <div className="bg-muted/50 p-3 rounded-lg text-sm inline-flex items-center">
          <span className="font-medium mr-2">Registration Number:</span> 
          {user.registrationNumber}
        </div>
      )}
      
      {/* Attendance statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={attendancePercentage} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>{attendancePercentage}%</span>
                <span className="text-muted-foreground">{totalClasses} classes</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-green-600 dark:text-green-400">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentCount}</div>
            <div className="text-sm text-muted-foreground">
              {totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0}% of total
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-yellow-600 dark:text-yellow-400">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lateCount}</div>
            <div className="text-sm text-muted-foreground">
              {totalClasses > 0 ? Math.round((lateCount / totalClasses) * 100) : 0}% of total
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-red-600 dark:text-red-400">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absentCount + excusedCount}</div>
            <div className="text-sm text-muted-foreground">
              {totalClasses > 0 ? Math.round(((absentCount + excusedCount) / totalClasses) * 100) : 0}% of total
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
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
      
      {/* Attendance records table */}
      <div className="bg-white dark:bg-black/40 rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-left">
                <th className="p-3 font-medium">Subject</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Time In</th>
                <th className="p-3 font-medium">Time Out</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3">{record.subject}</td>
                    <td className="p-3">{record.date}</td>
                    <td className="p-3">
                      <span className={cn("px-2 py-1 rounded-full text-xs capitalize", getStatusColor(record.status))}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-3">{record.timeIn || '-'}</td>
                    <td className="p-3">{record.timeOut || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length > 0 && (
          <div className="p-4 border-t flex items-center justify-between text-sm">
            <div>
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">
                {indexOfLastRecord > filteredRecords.length ? filteredRecords.length : indexOfLastRecord}
              </span>{" "}
              of <span className="font-medium">{filteredRecords.length}</span> records
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2">Page {currentPage}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceView;
