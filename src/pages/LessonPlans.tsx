
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LessonPlanCard, { LessonPlanProps } from '../components/LessonPlanCard';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Download, Filter, Plus, Search } from 'lucide-react';
import { useDownloadUtils } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';

// Sample data
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

const LessonPlans = () => {
  const { role } = useAuth();
  const { downloadAllResources } = useDownloadUtils();
  const [searchTerm, setSearchTerm] = useState('');
  
  const canAdd = role === 'admin' || role === 'teacher';
  
  const handleDownloadAll = () => {
    const resources = sampleLessonPlans.map(plan => ({
      id: plan.id,
      title: plan.title,
      type: 'lesson',
      url: `/lessons/${plan.id}`
    }));
    
    downloadAllResources(resources, 'All Lesson Plans');
  };
  
  const handleCreateNew = () => {
    toast({
      title: "Create New Lesson Plan",
      description: "Opening form to create a new lesson plan.",
    });
    // In a real app, this would open a form to create a new lesson plan
    console.log("Opening create new lesson plan form");
  };
  
  const handleFilter = () => {
    toast({
      title: "Filter Options",
      description: "Opening filter options for lesson plans.",
    });
    // In a real app, this would open filter options
    console.log("Opening filter options");
  };
  
  const filteredPlans = sampleLessonPlans.filter(
    plan => 
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Lesson Plans</h2>
              <p className="text-muted-foreground">Browse structured lesson plans with details and resources</p>
            </div>
            
            <div className="flex items-center gap-2">
              {canAdd && (
                <Button className="h-10" onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              )}
              
              <Button variant="outline" className="h-10" onClick={handleDownloadAll}>
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search by title, subject, or teacher..."
                className="w-full h-10 pl-9 pr-3 rounded-lg border bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button variant="outline" className="h-10 sm:w-auto w-full" onClick={handleFilter}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <LessonPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
          
          {filteredPlans.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No lesson plans found. Try a different search term.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LessonPlans;
