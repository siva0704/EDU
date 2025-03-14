import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LessonPlanCard, { LessonPlanProps } from '../components/LessonPlanCard';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Download, Filter, Plus, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Sample data with medical subjects
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

const LessonPlans = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const canAdd = role === 'admin' || role === 'teacher';
  
  const handleDownloadAll = () => {
    navigate('/lesson-plans/download');
  };
  
  const handleCreateNew = () => {
    navigate('/lesson-plans/create');
  };
  
  const handleFilter = () => {
    navigate('/lesson-plans/filter');
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
