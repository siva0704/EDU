
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Filter } from 'lucide-react';
import { LessonPlanProps } from '../../components/LessonPlanCard';

// Subjects by class level
const PRIMARY_SUBJECTS = [
  'Hindi',
  'English',
  'Mathematics',
  'Environmental Studies',
  'General Knowledge',
  'Art & Craft',
  'Physical Education'
];

const MIDDLE_SUBJECTS = [
  'Hindi',
  'English',
  'Mathematics',
  'Science',
  'Social Studies',
  'Sanskrit',
  'Art Education',
  'Physical Education',
  'Computer Science'
];

const HIGH_SUBJECTS = [
  'Hindi',
  'English',
  'Mathematics',
  'Science',
  'Social Science',
  'Sanskrit/Computer',
  'Physical Education',
  'Art Education'
];

// Sample data (updated with Indian education system)
const sampleLessonPlans: LessonPlanProps[] = [
  {
    id: '1',
    title: 'Introduction to Addition',
    subject: 'Mathematics',
    grade: 'Class 1',
    date: 'Apr 15, 2023',
    duration: '40 mins',
    objectives: [
      'Identify numbers 1 to 20',
      'Understand the concept of addition',
      'Solve simple addition problems'
    ],
    resources: [
      'Number cards',
      'Counting beads',
      'Worksheets with simple addition problems'
    ],
    teacher: 'Mrs. Sharma'
  },
  {
    id: '2',
    title: 'Living and Non-living Things',
    subject: 'Environmental Studies',
    grade: 'Class 3',
    date: 'Apr 16, 2023',
    duration: '45 mins',
    objectives: [
      'Distinguish between living and non-living things',
      'Identify characteristics of living things',
      'Classify objects as living or non-living'
    ],
    resources: [
      'Textbook: EVS Chapter 2',
      'Picture cards of various objects',
      'Nature walk materials'
    ],
    teacher: 'Mr. Verma'
  },
  {
    id: '3',
    title: 'Introduction to Photosynthesis',
    subject: 'Science',
    grade: 'Class 7',
    date: 'Apr 17, 2023',
    duration: '50 mins',
    objectives: [
      'Explain the process of photosynthesis',
      'Identify parts of a plant involved in photosynthesis',
      'Demonstrate understanding of energy conversion in plants'
    ],
    resources: [
      'Science textbook Chapter 5',
      'Plant specimens',
      'Diagram of photosynthesis process'
    ],
    teacher: 'Dr. Gupta'
  },
  {
    id: '4',
    title: 'पत्र लेखन (Letter Writing)',
    subject: 'Hindi',
    grade: 'Class 5',
    date: 'Apr 18, 2023',
    duration: '45 mins',
    objectives: [
      'Understand formal letter format',
      'Write a letter to a friend',
      'Use appropriate salutation and closing'
    ],
    resources: [
      'Hindi Textbook',
      'Sample letters',
      'Notebook and writing materials'
    ],
    teacher: 'Mrs. Rao'
  },
  {
    id: '5',
    title: 'Chemical Reactions and Equations',
    subject: 'Science',
    grade: 'Class 10',
    date: 'Apr 19, 2023',
    duration: '60 mins',
    objectives: [
      'Balance chemical equations',
      'Identify types of chemical reactions',
      'Write chemical equations for common reactions'
    ],
    resources: [
      'Science textbook Chapter 3',
      'Chemical equation cards',
      'Periodic table chart'
    ],
    teacher: 'Dr. Kumar'
  },
  {
    id: '6',
    title: 'Tenses in English',
    subject: 'English',
    grade: 'Class 8',
    date: 'Apr 20, 2023',
    duration: '50 mins',
    objectives: [
      'Identify different tenses in English',
      'Use present, past, and future tense correctly',
      'Convert sentences from one tense to another'
    ],
    resources: [
      'English Grammar Book',
      'Worksheet on tenses',
      'Flashcards with example sentences'
    ],
    teacher: 'Ms. D\'Souza'
  }
];

const FilterLessonPlans = () => {
  const navigate = useNavigate();
  
  // Extract unique grades and teachers from data
  const classes = Array.from(new Set(sampleLessonPlans.map(plan => plan.grade)));
  const teachers = Array.from(new Set(sampleLessonPlans.map(plan => plan.teacher)));
  
  // All available subjects
  const allSubjects = [...new Set([...PRIMARY_SUBJECTS, ...MIDDLE_SUBJECTS, ...HIGH_SUBJECTS])];
  
  // Filter state
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<string>('all');
  
  // Handle checkbox changes
  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };
  
  const toggleClass = (cls: string) => {
    setSelectedClasses(prev => 
      prev.includes(cls) 
        ? prev.filter(c => c !== cls) 
        : [...prev, cls]
    );
  };
  
  const toggleTeacher = (teacher: string) => {
    setSelectedTeachers(prev => 
      prev.includes(teacher) 
        ? prev.filter(t => t !== teacher) 
        : [...prev, teacher]
    );
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    // In a real app, this would apply filters and return to the list view
    // with filtered results
    const filters = {
      subjects: selectedSubjects,
      classes: selectedClasses,
      teachers: selectedTeachers,
      dateRange
    };
    
    console.log('Applying filters:', filters);
    
    toast({
      title: 'Filters Applied',
      description: 'The lesson plans list has been filtered according to your criteria.',
    });
    
    // Navigate back to the lesson plans list (with filter state)
    navigate('/lesson-plans');
  };
  
  const handleClearFilters = () => {
    setSelectedSubjects([]);
    setSelectedClasses([]);
    setSelectedTeachers([]);
    setDateRange('all');
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="icon" onClick={() => navigate('/lesson-plans')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">Filter Lesson Plans</h2>
          </div>
          
          <div className="max-w-3xl space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Subject</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allSubjects.map(subject => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`subject-${subject}`} 
                      checked={selectedSubjects.includes(subject)}
                      onCheckedChange={() => toggleSubject(subject)}
                    />
                    <label htmlFor={`subject-${subject}`} className="text-sm">
                      {subject}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Class</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {classes.map(cls => (
                  <div key={cls} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`class-${cls}`} 
                      checked={selectedClasses.includes(cls)}
                      onCheckedChange={() => toggleClass(cls)}
                    />
                    <label htmlFor={`class-${cls}`} className="text-sm">
                      {cls}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Teacher</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {teachers.map(teacher => (
                  <div key={teacher} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`teacher-${teacher}`} 
                      checked={selectedTeachers.includes(teacher)}
                      onCheckedChange={() => toggleTeacher(teacher)}
                    />
                    <label htmlFor={`teacher-${teacher}`} className="text-sm">
                      {teacher}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Date Range</h3>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
              <Button type="button" onClick={handleApplyFilters} className="gap-2">
                <Filter className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FilterLessonPlans;
