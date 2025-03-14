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

// Sample data (same as in the LessonPlans.tsx)
const sampleLessonPlans: LessonPlanProps[] = [
  {
    id: '1',
    title: 'Linear Equations',
    subject: 'Mathematics',
    grade: '9',
    date: 'Apr 15, 2023',
    duration: '60 mins',
    objectives: [
      'Define and identify linear equations',
      'Solve linear equations using algebraic methods',
      'Apply linear equations to real-world problems'
    ],
    resources: [
      'Textbook: Algebra Basics, pp. 45-52',
      'Worksheet: Linear Equation Practice',
      'Online Calculator Tool'
    ],
    teacher: 'John Smith'
  },
  {
    id: '2',
    title: 'Cell Structure and Function',
    subject: 'Biology',
    grade: '10',
    date: 'Apr 16, 2023',
    duration: '45 mins',
    objectives: [
      'Identify the main components of a cell',
      'Explain the function of each cell component',
      'Compare plant and animal cells'
    ],
    resources: [
      'Textbook: Biology Today, Chapter 3',
      'Cell Diagram Handout',
      'Microscope Lab Equipment'
    ],
    teacher: 'Sarah Davis'
  },
  {
    id: '3',
    title: 'Introduction to Python Programming',
    subject: 'Computer Science',
    grade: '11',
    date: 'Apr 17, 2023',
    duration: '90 mins',
    objectives: [
      'Understand basic Python syntax',
      'Write simple programs using variables and operators',
      'Debug common programming errors'
    ],
    resources: [
      'Python IDE Installation Guide',
      'Coding Exercise Handout',
      'Online Python Documentation'
    ],
    teacher: 'Michael Brown'
  },
  {
    id: '4',
    title: 'World War II: Causes and Impact',
    subject: 'History',
    grade: '10',
    date: 'Apr 18, 2023',
    duration: '55 mins',
    objectives: [
      'Analyze the major causes of World War II',
      'Evaluate the global impact of the conflict',
      'Identify key historical figures and their roles'
    ],
    resources: [
      'Textbook: Modern History, Chapter 7',
      'Historical Maps Collection',
      'Documentary Clip: "The Road to War"'
    ],
    teacher: 'Amanda Miller'
  },
  {
    id: '5',
    title: 'Shakespeare\'s Macbeth: Themes and Analysis',
    subject: 'Literature',
    grade: '12',
    date: 'Apr 19, 2023',
    duration: '75 mins',
    objectives: [
      'Identify major themes in Macbeth',
      'Analyze character development and motivations',
      'Interpret key passages and their significance'
    ],
    resources: [
      'Copy of Macbeth (Oxford Edition)',
      'Character Relationship Diagram',
      'Audio Recording of Key Scenes'
    ],
    teacher: 'Robert Williams'
  },
  {
    id: '6',
    title: 'Chemical Reactions and Equations',
    subject: 'Chemistry',
    grade: '11',
    date: 'Apr 20, 2023',
    duration: '60 mins',
    objectives: [
      'Balance chemical equations',
      'Identify types of chemical reactions',
      'Predict products of common reactions'
    ],
    resources: [
      'Textbook: Chemistry in Context, pp. 78-92',
      'Periodic Table Handout',
      'Lab Safety Guidelines'
    ],
    teacher: 'Emily Johnson'
  }
];

const FilterLessonPlans = () => {
  const navigate = useNavigate();
  
  // Extract unique subjects, grades, and teachers from data
  const subjects = Array.from(new Set(sampleLessonPlans.map(plan => plan.subject)));
  const grades = Array.from(new Set(sampleLessonPlans.map(plan => plan.grade)));
  const teachers = Array.from(new Set(sampleLessonPlans.map(plan => plan.teacher)));
  
  // Filter state
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
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
  
  const toggleGrade = (grade: string) => {
    setSelectedGrades(prev => 
      prev.includes(grade) 
        ? prev.filter(g => g !== grade) 
        : [...prev, grade]
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
      grades: selectedGrades,
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
    setSelectedGrades([]);
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
                {subjects.map(subject => (
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
              <h3 className="text-lg font-medium mb-3">Grade Level</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {grades.map(grade => (
                  <div key={grade} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`grade-${grade}`} 
                      checked={selectedGrades.includes(grade)}
                      onCheckedChange={() => toggleGrade(grade)}
                    />
                    <label htmlFor={`grade-${grade}`} className="text-sm">
                      Grade {grade}
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
