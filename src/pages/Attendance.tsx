
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

const sampleAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    student: 'Alice Johnson',
    status: 'present',
    class: 'Anatomy',
    date: 'Apr 15, 2023',
    timeIn: '09:00 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '2',
    student: 'Bob Smith',
    status: 'late',
    class: 'Physiology',
    date: 'Apr 15, 2023',
    timeIn: '09:15 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '3',
    student: 'Charlie Brown',
    status: 'absent',
    class: 'Pathology',
    date: 'Apr 15, 2023',
    timeIn: undefined,
    timeOut: undefined,
  },
  {
    id: '4',
    student: 'Diana Prince',
    status: 'present',
    class: 'Microbiology',
    date: 'Apr 15, 2023',
    timeIn: '09:02 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '5',
    student: 'Edward Stark',
    status: 'excused',
    class: 'Pharmacology',
    date: 'Apr 15, 2023',
    timeIn: undefined,
    timeOut: undefined,
  },
  {
    id: '6',
    student: 'Fiona Green',
    status: 'present',
    class: 'Mathematics 101',
    date: 'Apr 15, 2023',
    timeIn: '08:55 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '7',
    student: 'George Wilson',
    status: 'present',
    class: 'Mathematics 101',
    date: 'Apr 15, 2023',
    timeIn: '08:59 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '8',
    student: 'Helen Martin',
    status: 'present',
    class: 'Mathematics 101',
    date: 'Apr 15, 2023',
    timeIn: '08:50 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '9',
    student: 'Ivan Rogers',
    status: 'late',
    class: 'Mathematics 101',
    date: 'Apr 15, 2023',
    timeIn: '09:20 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '10',
    student: 'Janet Lee',
    status: 'present',
    class: 'Mathematics 101',
    date: 'Apr 15, 2023',
    timeIn: '09:05 AM',
    timeOut: '10:30 AM',
  },
  {
    id: '11',
    student: 'Kevin Clark',
    status: 'absent',
    class: 'Mathematics 101',
    date: 'Apr 15, 2023',
    timeIn: undefined,
    timeOut: undefined,
  },
  {
    id: '12',
    student: 'Laura Hill',
    status: 'present',
    class: 'Mathematics 101',
    date: 'Apr 15, 2023',
    timeIn: '09:01 AM',
    timeOut: '10:30 AM',
  },
];

const Attendance = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { downloadAllResources } = useDownloadUtils();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [records, setRecords] = useState(sampleAttendanceRecords);
  const [activeTab, setActiveTab] = useState("quick");
  
  const canAdd = role === 'admin' || role === 'teacher';
  
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
