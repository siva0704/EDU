
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSubjectsByClass } from '@/types/results';

// Import new components
import AttendanceStats from './attendance/AttendanceStats';
import AttendanceFilters from './attendance/AttendanceFilters';
import AttendanceRecordsTable from './attendance/AttendanceRecordsTable';

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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedSubject, setSelectedSubject] = useState('all-subjects');
  
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
      <AttendanceStats studentRecords={studentRecords} />
      
      {/* Filters */}
      <AttendanceFilters 
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        date={date}
        setDate={setDate}
        subjectsForClass={subjectsForClass}
      />
      
      {/* Attendance records table */}
      <AttendanceRecordsTable filteredRecords={filteredRecords} />
    </div>
  );
};

export default StudentAttendanceView;

// Missing format function import
import { format } from 'date-fns';
