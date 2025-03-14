import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Download, FileText } from 'lucide-react';
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

const DownloadLessonPlans = () => {
  const navigate = useNavigate();
  const [selectedPlans, setSelectedPlans] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  
  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    
    const newSelectedPlans: Record<string, boolean> = {};
    sampleLessonPlans.forEach(plan => {
      newSelectedPlans[plan.id] = newState;
    });
    
    setSelectedPlans(newSelectedPlans);
  };
  
  const handleSelectPlan = (id: string) => {
    setSelectedPlans(prev => {
      const newState = { ...prev, [id]: !prev[id] };
      
      // Check if all are selected
      const allSelected = sampleLessonPlans.every(plan => newState[plan.id]);
      setSelectAll(allSelected);
      
      return newState;
    });
  };
  
  const handleDownload = () => {
    const selectedCount = Object.values(selectedPlans).filter(Boolean).length;
    
    if (selectedCount === 0) {
      toast({
        title: 'No Plans Selected',
        description: 'Please select at least one lesson plan to download.',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Download Started',
      description: `${selectedCount} lesson plan(s) are being downloaded.`,
    });
    
    // In a real app, this would initiate file downloads
    console.log('Downloading lesson plans:', 
      sampleLessonPlans.filter(plan => selectedPlans[plan.id]));
    
    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/lesson-plans');
    }, 2000);
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
            <h2 className="text-2xl font-bold">Download Lesson Plans</h2>
          </div>
          
          <div className="mb-6">
            <p className="text-muted-foreground mb-4">
              Select the lesson plans you want to download. You can download them in PDF format.
            </p>
            
            <div className="flex items-center mb-4">
              <Checkbox 
                id="select-all" 
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="ml-2 text-sm font-medium">
                Select All
              </label>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="w-12 px-4 py-3"></th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Subject</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Grade</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Teacher</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sampleLessonPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-center">
                      <Checkbox 
                        id={`plan-${plan.id}`} 
                        checked={selectedPlans[plan.id] || false}
                        onCheckedChange={() => handleSelectPlan(plan.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{plan.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{plan.subject}</td>
                    <td className="px-4 py-3">{plan.grade}</td>
                    <td className="px-4 py-3">{plan.teacher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate('/lesson-plans')}>
              Cancel
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download Selected
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DownloadLessonPlans;
