
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const attendanceData = [
  { name: 'Monday', present: 24, absent: 3, late: 3 },
  { name: 'Tuesday', present: 23, absent: 5, late: 2 },
  { name: 'Wednesday', present: 25, absent: 2, late: 3 },
  { name: 'Thursday', present: 22, absent: 4, late: 4 },
  { name: 'Friday', present: 20, absent: 6, late: 4 },
];

const statusData = [
  { name: 'Present', value: 114, color: '#22c55e' },
  { name: 'Absent', value: 20, color: '#ef4444' },
  { name: 'Late', value: 16, color: '#f97316' },
];

const classData = [
  { name: 'Class 1', present: 95, absent: 10, late: 15 },
  { name: 'Class 3', present: 88, absent: 12, late: 20 },
  { name: 'Class 5', present: 80, absent: 15, late: 25 },
  { name: 'Class 7', present: 90, absent: 8, late: 22 },
  { name: 'Class 9', present: 85, absent: 10, late: 25 },
];

const subjectData = [
  { name: 'Mathematics', present: 92, absent: 8, late: 10 },
  { name: 'Hindi', present: 88, absent: 10, late: 12 },
  { name: 'English', present: 85, absent: 12, late: 13 },
  { name: 'Science', present: 90, absent: 7, late: 13 },
  { name: 'Social Science', present: 84, absent: 11, late: 15 },
];

const AttendanceReports = () => {
  const [reportType, setReportType] = useState('weekly');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  
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
                <h2 className="text-2xl font-bold">Attendance Reports</h2>
                <p className="text-muted-foreground">Analyze attendance patterns and statistics</p>
              </div>
            </div>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Sessions</CardTitle>
                <CardDescription>All recorded classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">125</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Attendance</CardTitle>
                <CardDescription>Present rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">86%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Absent Rate</CardTitle>
                <CardDescription>Total absences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">14%</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <Card className="flex-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Weekly Attendance Overview</CardTitle>
                    <CardDescription>Attendance patterns for this week</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="class1">Class 1</SelectItem>
                        <SelectItem value="class2">Class 2</SelectItem>
                        <SelectItem value="class3">Class 3</SelectItem>
                        <SelectItem value="class4">Class 4</SelectItem>
                        <SelectItem value="class5">Class 5</SelectItem>
                        <SelectItem value="class6">Class 6</SelectItem>
                        <SelectItem value="class7">Class 7</SelectItem>
                        <SelectItem value="class8">Class 8</SelectItem>
                        <SelectItem value="class9">Class 9</SelectItem>
                        <SelectItem value="class10">Class 10</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="socialScience">Social Science</SelectItem>
                        <SelectItem value="sanskrit">Sanskrit</SelectItem>
                        <SelectItem value="computerScience">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" stackId="a" fill="#22c55e" />
                    <Bar dataKey="absent" stackId="a" fill="#ef4444" />
                    <Bar dataKey="late" stackId="a" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="w-full lg:w-[350px]">
              <CardHeader>
                <CardTitle>Attendance Status</CardTitle>
                <CardDescription>Overall distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="class" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="class">Attendance by Class</TabsTrigger>
              <TabsTrigger value="subject">Attendance by Subject</TabsTrigger>
            </TabsList>
            
            <TabsContent value="class">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance by Class</CardTitle>
                  <CardDescription>Compare attendance rates across different classes</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={classData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#22c55e" />
                      <Bar dataKey="absent" fill="#ef4444" />
                      <Bar dataKey="late" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subject">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance by Subject</CardTitle>
                  <CardDescription>Compare attendance rates across different subjects</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#22c55e" />
                      <Bar dataKey="absent" fill="#ef4444" />
                      <Bar dataKey="late" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AttendanceReports;
