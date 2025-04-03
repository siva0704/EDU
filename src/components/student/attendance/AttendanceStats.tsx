
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StudentAttendanceRecord } from '../StudentAttendanceView';

interface AttendanceStatsProps {
  studentRecords: StudentAttendanceRecord[];
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ studentRecords }) => {
  // Calculate attendance statistics
  const totalClasses = studentRecords.length;
  const presentCount = studentRecords.filter(r => r.status === 'present').length;
  const lateCount = studentRecords.filter(r => r.status === 'late').length;
  const absentCount = studentRecords.filter(r => r.status === 'absent').length;
  const excusedCount = studentRecords.filter(r => r.status === 'excused').length;
  
  const attendancePercentage = totalClasses > 0 
    ? Math.round(((presentCount + lateCount) / totalClasses) * 100) 
    : 0;
  
  return (
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
  );
};

export default AttendanceStats;
