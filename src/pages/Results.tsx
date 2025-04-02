
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Edit, Eye, Award, BookOpen, ChevronRight, Medal } from 'lucide-react';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  
  const isAdminOrTeacher = role === 'admin' || role === 'teacher';
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Exam Results</h1>
            {isAdminOrTeacher && (
              <Button onClick={() => navigate('/results/manage')}>
                <Edit className="mr-2 h-4 w-4" />
                Manage Results
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isAdminOrTeacher && (
              <Card className="hover:bg-accent/5 transition-colors cursor-pointer" onClick={() => navigate('/results/manage')}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Edit className="h-5 w-5 mr-2 text-primary" />
                    Manage Results
                  </CardTitle>
                  <CardDescription>Create, edit and publish student exam results</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Add new exam results, update existing ones or publish results to make them visible to students.
                  </p>
                </CardContent>
                <CardFooter className="justify-end text-sm text-muted-foreground">
                  <div className="flex items-center">
                    Access now 
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardFooter>
              </Card>
            )}
            
            <Card className="hover:bg-accent/5 transition-colors cursor-pointer" onClick={() => navigate('/results/view')}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-primary" />
                  View Results
                </CardTitle>
                <CardDescription>Access published exam results</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {role === 'student' 
                    ? "View your personal exam results across all subjects and semesters" 
                    : "Browse through all published student exam results and performance data"}
                </p>
              </CardContent>
              <CardFooter className="justify-end text-sm text-muted-foreground">
                <div className="flex items-center">
                  Access now 
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardFooter>
            </Card>
            
            <Card className="hover:bg-accent/5 transition-colors cursor-pointer" onClick={() => navigate('/results/view')}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>See performance trends and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {role === 'student' 
                    ? "Track your academic progress and identify areas for improvement" 
                    : "Analyze student performance data across departments and courses"}
                </p>
              </CardContent>
              <CardFooter className="justify-end text-sm text-muted-foreground">
                <div className="flex items-center">
                  Access now 
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Results;
