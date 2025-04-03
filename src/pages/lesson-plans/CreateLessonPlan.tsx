
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

const CreateLessonPlan = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [duration, setDuration] = useState('');
  const [objectives, setObjectives] = useState('');
  const [resources, setResources] = useState('');

  // Subject options based on grade level
  const getSubjects = (selectedGrade: string) => {
    const classNumber = parseInt(selectedGrade?.replace('Class ', '') || '0');
    
    if (classNumber >= 1 && classNumber <= 5) {
      return [
        'Hindi',
        'English',
        'Mathematics',
        'Environmental Studies',
        'General Knowledge',
        'Art & Craft',
        'Physical Education'
      ];
    } else if (classNumber >= 6 && classNumber <= 8) {
      return [
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
    } else if (classNumber >= 9 && classNumber <= 10) {
      return [
        'Hindi',
        'English',
        'Mathematics',
        'Science',
        'Social Science',
        'Sanskrit/Computer',
        'Physical Education',
        'Art Education'
      ];
    }
    return [];
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send data to an API
    console.log('Submitting lesson plan:', { title, subject, grade, duration, objectives, resources });
    
    toast({
      title: 'Lesson Plan Created',
      description: `"${title}" has been successfully created.`,
    });
    
    // Navigate back to the lesson plans list
    navigate('/lesson-plans');
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
            <h2 className="text-2xl font-bold">Create New Lesson Plan</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Title
                  <Input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter lesson title"
                    required
                    className="mt-1"
                  />
                </label>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Class
                  <Select value={grade} onValueChange={setGrade} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Class 1">Class 1</SelectItem>
                      <SelectItem value="Class 2">Class 2</SelectItem>
                      <SelectItem value="Class 3">Class 3</SelectItem>
                      <SelectItem value="Class 4">Class 4</SelectItem>
                      <SelectItem value="Class 5">Class 5</SelectItem>
                      <SelectItem value="Class 6">Class 6</SelectItem>
                      <SelectItem value="Class 7">Class 7</SelectItem>
                      <SelectItem value="Class 8">Class 8</SelectItem>
                      <SelectItem value="Class 9">Class 9</SelectItem>
                      <SelectItem value="Class 10">Class 10</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Subject
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubjects(grade).map((subj) => (
                        <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Duration
                  <Input 
                    type="text" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)} 
                    placeholder="e.g., 45 mins"
                    required
                    className="mt-1"
                  />
                </label>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Learning Objectives (one per line)
                <Textarea 
                  value={objectives} 
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="List the learning objectives..."
                  rows={5}
                  required
                  className="mt-1"
                />
              </label>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Resources (one per line)
                <Textarea 
                  value={resources} 
                  onChange={(e) => setResources(e.target.value)}
                  placeholder="List the resources needed..."
                  rows={5}
                  required
                  className="mt-1"
                />
              </label>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/lesson-plans')}>
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Save Lesson Plan
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateLessonPlan;
