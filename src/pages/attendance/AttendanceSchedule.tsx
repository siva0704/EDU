
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { addDays, format, isSameDay } from 'date-fns';
import { ArrowLeft, Clock, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface ScheduledClass {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  room: string;
  students: number;
  repeatWeekly: boolean;
}

// Sample scheduled classes
const initialSchedules: ScheduledClass[] = [
  {
    id: '1',
    title: 'Mathematics 101',
    date: addDays(new Date(), 1),
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    room: 'Room A101',
    students: 30,
    repeatWeekly: true
  },
  {
    id: '2',
    title: 'Science 102',
    date: addDays(new Date(), 2),
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    room: 'Lab B202',
    students: 25,
    repeatWeekly: true
  },
  {
    id: '3',
    title: 'History 103',
    date: addDays(new Date(), 3),
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    room: 'Room C303',
    students: 28,
    repeatWeekly: false
  },
  {
    id: '4',
    title: 'English 104',
    date: addDays(new Date(), 4),
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    room: 'Room D404',
    students: 22,
    repeatWeekly: true
  }
];

const AttendanceSchedule = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<ScheduledClass[]>(initialSchedules);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledClass | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');
  const [students, setStudents] = useState('');
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };
  
  const getSchedulesForSelectedDate = () => {
    return schedules.filter(schedule => isSameDay(schedule.date, date));
  };
  
  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    resetForm();
    setOpenDialog(true);
  };
  
  const handleEditSchedule = (schedule: ScheduledClass) => {
    setSelectedSchedule(schedule);
    setTitle(schedule.title);
    setStartTime(schedule.startTime);
    setEndTime(schedule.endTime);
    setRoom(schedule.room);
    setStudents(schedule.students.toString());
    setRepeatWeekly(schedule.repeatWeekly);
    setOpenDialog(true);
  };
  
  const resetForm = () => {
    setTitle('');
    setStartTime('');
    setEndTime('');
    setRoom('');
    setStudents('');
    setRepeatWeekly(false);
  };
  
  const handleSaveSchedule = () => {
    if (!title || !startTime || !endTime || !room || !students) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedSchedule) {
      // Update existing schedule
      const updatedSchedules = schedules.map(schedule => 
        schedule.id === selectedSchedule.id 
          ? {
              ...schedule,
              title,
              startTime,
              endTime,
              room,
              students: parseInt(students),
              repeatWeekly
            }
          : schedule
      );
      
      setSchedules(updatedSchedules);
      toast({
        title: "Schedule Updated",
        description: `${title} has been updated.`
      });
    } else {
      // Add new schedule
      const newSchedule: ScheduledClass = {
        id: `${schedules.length + 1}`,
        title,
        date,
        startTime,
        endTime,
        room,
        students: parseInt(students),
        repeatWeekly
      };
      
      setSchedules([...schedules, newSchedule]);
      toast({
        title: "Schedule Added",
        description: `${title} has been scheduled for ${format(date, 'PPP')}.`
      });
    }
    
    setOpenDialog(false);
    resetForm();
  };
  
  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    toast({
      title: "Schedule Deleted",
      description: "The class has been removed from the schedule."
    });
  };
  
  const schedulesForToday = getSchedulesForSelectedDate();
  
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
                <h2 className="text-2xl font-bold">Attendance Schedule</h2>
                <p className="text-muted-foreground">Manage class schedules and attendance planning</p>
              </div>
            </div>
            
            <Button onClick={handleAddSchedule}>
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Class Calendar</CardTitle>
                <CardDescription>Select a date to view scheduled classes</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="rounded-md border mx-auto"
                />
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Scheduled Classes</CardTitle>
                  <CardDescription>
                    For {format(date, 'MMMM d, yyyy')}
                  </CardDescription>
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past Classes</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {schedulesForToday.length > 0 ? (
                  <div className="space-y-4">
                    {schedulesForToday.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            schedule.title.includes("Mathematics") && "bg-blue-100 text-blue-700",
                            schedule.title.includes("Science") && "bg-green-100 text-green-700",
                            schedule.title.includes("History") && "bg-yellow-100 text-yellow-700",
                            schedule.title.includes("English") && "bg-purple-100 text-purple-700",
                          )}>
                            {schedule.title.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium">{schedule.title}</h4>
                            <div className="flex items-center text-muted-foreground text-sm">
                              <Clock className="h-3 w-3 mr-1" />
                              {schedule.startTime} - {schedule.endTime}
                              <span className="mx-2">•</span>
                              {schedule.room}
                              <span className="mx-2">•</span>
                              <Users className="h-3 w-3 mr-1" />
                              {schedule.students} students
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditSchedule(schedule)}>
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteSchedule(schedule.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <p className="text-muted-foreground">No classes scheduled for this date.</p>
                    <Button className="mt-4" onClick={handleAddSchedule}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Class
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{selectedSchedule ? 'Edit Class Schedule' : 'Add New Class Schedule'}</DialogTitle>
            <DialogDescription>
              Schedule a class for {format(date, 'MMMM d, yyyy')}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Class Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="e.g. Mathematics 101"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="col-span-3"
                placeholder="e.g. 09:00 AM"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Input
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="col-span-3"
                placeholder="e.g. 10:30 AM"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Room
              </Label>
              <Input
                id="room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="col-span-3"
                placeholder="e.g. Room A101"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="students" className="text-right">
                Students
              </Label>
              <Input
                id="students"
                type="number"
                value={students}
                onChange={(e) => setStudents(e.target.value)}
                className="col-span-3"
                placeholder="e.g. 30"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <div></div>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox 
                  id="repeat" 
                  checked={repeatWeekly} 
                  onCheckedChange={(checked) => setRepeatWeekly(checked === true)}
                />
                <Label htmlFor="repeat">Repeat weekly</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setOpenDialog(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule}>
              {selectedSchedule ? 'Save Changes' : 'Add Class'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceSchedule;
