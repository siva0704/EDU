import React, { useState } from 'react';
import { Calendar, Search, Download, Filter, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useDownloadUtils } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import EditAttendanceModal from './attendance/EditAttendanceModal';

export interface AttendanceRecord {
  id: string;
  student: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  class: string;
  date: string;
  timeIn?: string;
  timeOut?: string;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onEdit: (record: AttendanceRecord) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, onEdit }) => {
  const { role } = useAuth();
  const { downloadSingleResource } = useDownloadUtils();
  const canEdit = role === 'admin' || role === 'teacher';
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const recordsPerPage = 10;
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null);
  
  const filteredRecords = records.filter(record => 
    record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.class.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  
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
      id: 'attendance-export',
      title: 'Attendance Records',
      type: 'attendance',
      url: '/attendance/export'
    });
  };
  
  const handleFilter = () => {
    toast({
      title: "Filter Applied",
      description: "Attendance records filtered by selected criteria.",
    });
  };
  
  const handleEditRecord = (record: AttendanceRecord) => {
    setCurrentRecord(record);
    setEditModalOpen(true);
  };
  
  const handleSaveEdit = (updatedRecord: AttendanceRecord) => {
    onEdit(updatedRecord);
    setEditModalOpen(false);
    setCurrentRecord(null);
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
    <>
      <div className="bg-white dark:bg-black/40 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search student or class..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 self-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{date ? format(date, 'PP') : 'Date Range'}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="sm" className="h-10" onClick={handleFilter}>
              <Filter className="h-4 w-4 mr-2" />
              <span>Filter</span>
            </Button>
            
            <Button variant="outline" size="sm" className="h-10" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-left">
                <th className="p-3 font-medium">Student</th>
                <th className="p-3 font-medium">Class</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Time In</th>
                <th className="p-3 font-medium">Time Out</th>
                {canEdit && <th className="p-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <tr key={record.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3">{record.student}</td>
                  <td className="p-3">{record.class}</td>
                  <td className="p-3">{record.date}</td>
                  <td className="p-3">
                    <span className={cn("px-2 py-1 rounded-full text-xs capitalize", getStatusColor(record.status))}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-3">{record.timeIn || '-'}</td>
                  <td className="p-3">{record.timeOut || '-'}</td>
                  {canEdit && (
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditRecord(record)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
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
      </div>
      
      <EditAttendanceModal 
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setCurrentRecord(null);
        }}
        onSave={handleSaveEdit}
        record={currentRecord}
      />
    </>
  );
};

export default AttendanceTable;
