
import React from 'react';
import { Calendar, Clock, BookOpen, Download, FileText, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useDownloadUtils } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';

export interface LessonPlanProps {
  id: string;
  title: string;
  subject: string;
  grade: string;
  date: string;
  duration: string;
  objectives: string[];
  resources: string[];
  teacher: string;
}

const LessonPlanCard: React.FC<{ plan: LessonPlanProps }> = ({ plan }) => {
  const { role } = useAuth();
  const { downloadSingleResource } = useDownloadUtils();
  const canEdit = role === 'admin' || role === 'teacher';
  
  const handleDownload = () => {
    downloadSingleResource({
      id: plan.id,
      title: plan.title,
      type: 'lesson',
      url: `/lessons/${plan.id}`
    });
  };
  
  const handleEdit = () => {
    toast({
      title: "Edit Lesson Plan",
      description: `Editing: ${plan.title}`,
    });
    // In a real app, this would open an edit form
    console.log("Editing lesson plan:", plan.id);
  };
  
  return (
    <div className="card-hover rounded-xl overflow-hidden bg-white dark:bg-black/40 border shadow-sm">
      <div className="border-b">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              {plan.subject}
            </span>
            <span className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded-full">
              Grade {plan.grade}
            </span>
          </div>
          
          <h3 className="font-medium text-lg">{plan.title}</h3>
          
          <div className="mt-3 text-sm text-muted-foreground flex flex-wrap gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{plan.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{plan.duration}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
          <BookOpen className="h-4 w-4" /> Learning Objectives
        </h4>
        <ul className="text-sm space-y-1 ml-5 list-disc">
          {plan.objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
        
        <h4 className="text-sm font-medium mb-2 mt-4 flex items-center gap-1">
          <FileText className="h-4 w-4" /> Resources
        </h4>
        <ul className="text-sm space-y-1 ml-5 list-disc">
          {plan.resources.map((resource, index) => (
            <li key={index}>{resource}</li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          By: {plan.teacher}
        </span>
        
        {canEdit ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-1" />
              <span>Edit</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              <span>Download</span>
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="h-8" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            <span>Download</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default LessonPlanCard;
