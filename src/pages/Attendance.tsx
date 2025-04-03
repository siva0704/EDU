
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AttendanceTable, { AttendanceRecord } from '../components/AttendanceTable';
import AddAttendanceModal from '../components/attendance/AddAttendanceModal';
import QuickAttendanceForm from '../components/attendance/QuickAttendanceForm';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Plus, FileText, Clock, Calendar } from 'lucide-react';
import { useDownloadUtils } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import ThemeControls from '@/components/ThemeControls';
import StudentAttendanceView from '@/components/student/StudentAttendanceView';
import { getSubjectsByClass } from '@/types/results';

// Sample attendance records using Indian education system classes and subjects
const sampleAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    student: 'Rahul Sharma',
    status: 'present',
    class: 'Class 5',
    subject: 'Mathematics',
    date: 'Apr 15, 2023',
    timeIn: '09:00 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '2',
    student: 'Priya Patel',
    status: 'late',
    class: 'Class 3',
    subject: 'Hindi',
    date: 'Apr 15, 2023',
    timeIn: '09:15 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '3',
    student: 'Arjun Singh',
    status: 'absent',
    class: 'Class 7',
    subject: 'Science',
    date: 'Apr 15, 2023',
    timeIn: undefined,
    timeOut: undefined,
  },
  {
    id: '4',
    student: 'Ananya Gupta',
    status: 'present',
    class: 'Class 9',
    subject: 'Social Science',
    date: 'Apr 15, 2023',
    timeIn: '09:02 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '5',
    student: 'Vikram Iyer',
    status: 'excused',
    class: 'Class 10',
    subject: 'Information Technology',
    date: 'Apr 15, 2023',
    timeIn: undefined,
    timeOut: undefined,
  },
  {
    id: '6',
    student: 'Neha Kapoor',
    status: 'present',
    class: 'Class 2',
    subject: 'Environmental Science',
    date: 'Apr 15, 2023',
    timeIn: '08:55 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '7',
    student: 'Amit Kumar',
    status: 'present',
    class: 'Class 8',
    subject: 'English',
    date: 'Apr 15, 2023',
    timeIn: '08:59 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '8',
    student: 'Riya Malhotra',
    status: 'present',
    class: 'Class 1',
    subject: 'Art & Craft',
    date: 'Apr 15, 2023',
    timeIn: '08:50 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '9',
    student: 'Karan Mehra',
    status: 'late',
    class: 'Class 6',
    subject: 'Sanskrit',
    date: 'Apr 15, 2023',
    timeIn: '09:20 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '10',
    student: 'Divya Reddy',
    status: 'present',
    class: 'Class 4',
    subject: 'General Knowledge',
    date: 'Apr 15, 2023',
    timeIn: '09:05 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '11',
    student: 'Raj Sharma',
    status: 'absent',
    class: 'Class 5',
    subject: 'Hindi',
    date: 'Apr 15, 2023',
    timeIn: undefined,
    timeOut: undefined,
  },
  {
    id: '12',
    student: 'Sneha Gupta',
    status: 'present',
    class: 'Class 3',
    subject: 'Mathematics',
    date: 'Apr 15, 2023',
    timeIn: '09:01 AM',
    timeOut: '10:30 AM',
  },
];

const Attendance = () => {
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const { downloadAllResources } = useDownloadUtils();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [records, setRecords] = useState(sampleAttendanceRecords);
  const [activeTab, setActiveTab] = useState("quick");
  
  const canAdd = role === 'admin' || role === 'teacher';
  const isStudent = role === 'student';
  
  const handleDownloadAll = () => {
    const resources = [{
      id: 'attendance-sheet',
      title: 'Attendance Records',
      type: 'attendance',
      url: '/attendance/export'
    }];
    
    downloadAllResources(resources, 'All Attendance Records');
    
    toast({
      title: "Download Started",
      description: "Your attendance records are being downloaded.",
    });
  };
  
  const handleAddRecord = () => {
    setAddModalOpen(true);
  };
  
  const handleSaveNewRecord = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord = {
      id: `${records.length + 1}`,
      ...record
    };
    
    setRecords(prev => [newRecord, ...prev]);
    
    toast({
      title: "Record Added",
      description: `Attendance record for ${record.student} has been added.`,
    });
  };
  
  const handleSaveMultipleRecords = (newRecords: Omit<AttendanceRecord, 'id'>[]) => {
    const recordsToAdd = newRecords.map((record, index) => ({
      id: `${records.length + index + 1}`,
      ...record
    }));
    
    setRecords(prev => [...recordsToAdd, ...prev]);
  };
  
  const handleEditRecord = (updatedRecord: AttendanceRecord) => {
    setRecords(prev => 
      prev.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };
  
  const navigateToReports = () => {
    navigate('/attendance/reports');
  };
  
  const navigateToHistory = () => {
    navigate('/attendance/history');
  };
  
  const navigateToSchedule = () => {
    navigate('/attendance/schedule');
  };
  
  if (isStudent) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        
        <div className="flex-1">
          <Header />
          
          <main className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold">My Attendance</h2>
                <p className="text-muted-foreground">View your attendance records</p>
              </div>
            </div>
            
            <StudentAttendanceView />
          </main>
        </div>
        
        <ThemeControls />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Digital Attendance</h2>
              <p className="text-muted-foreground">View and manage attendance records</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={navigateToReports}>
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
              
              <Button variant="outline" onClick={navigateToHistory}>
                <Clock className="h-4 w-4 mr-2" />
                History
              </Button>
              
              <Button variant="outline" onClick={navigateToSchedule}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              
              {canAdd && activeTab === "records" && (
                <Button className="h-10" onClick={handleAddRecord}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              )}
              
              <Button variant="outline" className="h-10" onClick={handleDownloadAll}>
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="quick">Take Attendance</TabsTrigger>
              <TabsTrigger value="records">Attendance Records</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quick" className="space-y-4">
              {canAdd ? (
                <QuickAttendanceForm onSubmit={handleSaveMultipleRecords} />
              ) : (
                <div className="text-center p-10 border rounded-lg">
                  <p>You don't have permission to take attendance.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="records">
              <div className="mb-6">
                <AttendanceTable records={records} onEdit={handleEditRecord} />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <AddAttendanceModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveNewRecord}
      />
      
      <ThemeControls />
    </div>
  );
};

export default Attendance;
