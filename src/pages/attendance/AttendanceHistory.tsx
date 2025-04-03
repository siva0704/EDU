
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar as CalendarIcon, Download, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AttendanceRecord } from '@/components/AttendanceTable';
import { getSubjectsByClass } from '@/types/results';

// Sample data
const historyData: (AttendanceRecord & { semester: string, week: number })[] = [
  {
    id: '1',
    student: 'Rahul Sharma',
    status: 'present',
    class: 'Class 5',
    subject: 'Mathematics',
    date: 'Apr 15, 2023',
    timeIn: '09:00 AM',
    timeOut: '10:30 AM',
    semester: '2023-2024',
    week: 10,
  },
  {
    id: '2',
    student: 'Priya Patel',
    status: 'late',
    class: 'Class 3',
    subject: 'Hindi',
    date: 'Apr 14, 2023',
    timeIn: '09:15 AM',
    timeOut: '10:45 AM',
    semester: '2023-2024',
    week: 10,
  },
  {
    id: '3',
    student: 'Arjun Singh',
    status: 'absent',
    class: 'Class 7',
    subject: 'Science',
    date: 'Apr 13, 2023',
    timeIn: undefined,
    timeOut: undefined,
    semester: '2023-2024',
    week: 10,
  },
  {
    id: '4',
    student: 'Ananya Gupta',
    status: 'present',
    class: 'Class 9',
    subject: 'Social Science',
    date: 'Apr 12, 2023',
    timeIn: '09:02 AM',
    timeOut: '10:30 AM',
    semester: '2023-2024',
    week: 9,
  },
  {
    id: '5',
    student: 'Vikram Iyer',
    status: 'excused',
    class: 'Class 10',
    subject: 'Mathematics',
    date: 'Apr 11, 2023',
    timeIn: undefined,
    timeOut: undefined,
    semester: '2023-2024',
    week: 9,
  },
  {
    id: '6',
    student: 'Neha Kapoor',
    status: 'present',
    class: 'Class 2',
    subject: 'Environmental Science',
    date: 'Apr 10, 2023',
    timeIn: '08:55 AM',
    timeOut: '10:25 AM',
    semester: '2023-2024',
    week: 9,
  },
  {
    id: '7',
    student: 'Amit Kumar',
    status: 'present',
    class: 'Class 8',
    subject: 'English',
    date: 'Apr 7, 2023',
    timeIn: '08:59 AM',
    timeOut: '10:29 AM',
    semester: '2023-2024',
    week: 8,
  },
  {
    id: '8',
    student: 'Riya Malhotra',
    status: 'present',
    class: 'Class 1',
    subject: 'Hindi',
    date: 'Apr 6, 2023',
    timeIn: '08:50 AM',
    timeOut: '10:20 AM',
    semester: '2023-2024',
    week: 8,
  },
];

const classes = Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);

const AttendanceHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSemester, setSelectedSemester] = useState('all');
  
  // For subject filtering, get a list of all possible subjects across all classes
  const allSubjects = new Set<string>();
  for (let i = 1; i <= 10; i++) {
    getSubjectsByClass(i).forEach(subject => allSubjects.add(subject));
  }
  const subjectsList = Array.from(allSubjects);
  
  const filteredHistory = historyData.filter(record => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      record.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Class filter
    const matchesClass = selectedClass === 'all' || record.class === selectedClass;
    
    // Subject filter
    const matchesSubject = selectedSubject === 'all' || record.subject === selectedSubject;
    
    // Status filter
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    
    // Semester filter
    const matchesSemester = selectedSemester === 'all' || record.semester === selectedSemester;
    
    // Date filter
    const matchesDate = !selectedDate || record.date === format(selectedDate, 'MMM d, yyyy');
    
    return matchesSearch && matchesClass && matchesSubject && matchesStatus && matchesSemester && matchesDate;
  });
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedClass('all');
    setSelectedSubject('all');
    setSelectedStatus('all');
    setSelectedDate(undefined);
    setSelectedSemester('all');
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Link to="/attendance">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h2 className="text-2xl font-bold">Attendance History</h2>
                <p className="text-muted-foreground">View past attendance records</p>
              </div>
            </div>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export History
            </Button>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search student or class..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjectsList.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                    <SelectItem value="2021-2022">2021-2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-white rounded-md border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Student</th>
                    <th className="py-3 px-4 text-left font-medium">Class</th>
                    <th className="py-3 px-4 text-left font-medium">Subject</th>
                    <th className="py-3 px-4 text-left font-medium">Date</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-left font-medium">Time In</th>
                    <th className="py-3 px-4 text-left font-medium">Time Out</th>
                    <th className="py-3 px-4 text-left font-medium">Academic Year</th>
                    <th className="py-3 px-4 text-left font-medium">Week</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{record.student}</td>
                        <td className="py-3 px-4">{record.class}</td>
                        <td className="py-3 px-4">{record.subject}</td>
                        <td className="py-3 px-4">{record.date}</td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            record.status === 'present' && "bg-green-100 text-green-800",
                            record.status === 'absent' && "bg-red-100 text-red-800",
                            record.status === 'late' && "bg-yellow-100 text-yellow-800",
                            record.status === 'excused' && "bg-blue-100 text-blue-800"
                          )}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">{record.timeIn || '-'}</td>
                        <td className="py-3 px-4">{record.timeOut || '-'}</td>
                        <td className="py-3 px-4">{record.semester}</td>
                        <td className="py-3 px-4">Week {record.week}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-muted-foreground">
                        No records found with the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendanceHistory;
