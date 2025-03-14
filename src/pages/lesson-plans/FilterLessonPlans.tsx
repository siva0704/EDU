
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

// Medical subjects
const MEDICAL_SUBJECTS = [
  'Anatomy',
  'Physiology',
  'Pathology',
  'Microbiology',
  'Pharmacology'
];

// Sample data (updated with medical subjects)
const sampleLessonPlans: LessonPlanProps[] = [
  {
    id: '1',
    title: 'Musculoskeletal System Overview',
    subject: 'Anatomy',
    grade: '9',
    date: 'Apr 15, 2023',
    duration: '60 mins',
    objectives: [
      'Identify major bones and muscles',
      'Understand joint structure and function',
      'Explain the relationship between bones and muscles'
    ],
    resources: [
      'Textbook: Human Anatomy, pp. 45-52',
      'Skeleton Model',
      'Digital Anatomy Software'
    ],
    teacher: 'Dr. John Smith'
  },
  {
    id: '2',
    title: 'Cardiovascular Physiology',
    subject: 'Physiology',
    grade: '10',
    date: 'Apr 16, 2023',
    duration: '45 mins',
    objectives: [
      'Describe cardiac cycle phases',
      'Explain blood pressure regulation',
      'Analyze factors affecting cardiac output'
    ],
    resources: [
      'Textbook: Human Physiology, Chapter 3',
      'Heart Model',
      'Blood Pressure Monitoring Equipment'
    ],
    teacher: 'Dr. Sarah Davis'
  },
  {
    id: '3',
    title: 'Cellular Mechanisms of Disease',
    subject: 'Pathology',
    grade: '11',
    date: 'Apr 17, 2023',
    duration: '90 mins',
    objectives: [
      'Understand cell injury mechanisms',
      'Identify patterns of inflammation',
      'Analyze tissue repair processes'
    ],
    resources: [
      'Pathology Atlas',
      'Microscope Slides Collection',
      'Online Pathology Database'
    ],
    teacher: 'Dr. Michael Brown'
  },
  {
    id: '4',
    title: 'Bacteriology Fundamentals',
    subject: 'Microbiology',
    grade: '10',
    date: 'Apr 18, 2023',
    duration: '55 mins',
    objectives: [
      'Classify bacteria by morphology',
      'Perform and interpret Gram staining',
      'Identify common pathogenic bacteria'
    ],
    resources: [
      'Microbiology Manual',
      'Microscope Equipment',
      'Bacterial Culture Samples'
    ],
    teacher: 'Dr. Amanda Miller'
  },
  {
    id: '5',
    title: 'Principles of Drug Action',
    subject: 'Pharmacology',
    grade: '12',
    date: 'Apr 19, 2023',
    duration: '75 mins',
    objectives: [
      'Explain drug absorption and distribution',
      'Analyze receptor-mediated drug effects',
      'Calculate dosage and pharmacokinetics'
    ],
    resources: [
      'Pharmacology Textbook',
      'Drug Interaction Charts',
      'Simulation Software'
    ],
    teacher: 'Dr. Robert Williams'
  },
  {
    id: '6',
    title: 'Nervous System Anatomy',
    subject: 'Anatomy',
    grade: '11',
    date: 'Apr 20, 2023',
    duration: '60 mins',
    objectives: [
      'Identify major structures of the brain',
      'Describe spinal cord organization',
      'Trace major neural pathways'
    ],
    resources: [
      'Brain Models',
      'Neuroanatomy Atlas',
      'Cross-section Diagrams'
    ],
    teacher: 'Dr. Emily Johnson'
  }
];

const FilterLessonPlans = () => {
  const navigate = useNavigate();
  
  // Extract unique grades and teachers from data
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
                {MEDICAL_SUBJECTS.map(subject => (
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
