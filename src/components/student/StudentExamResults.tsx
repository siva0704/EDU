
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, Download, Search, BarChart3, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useDownloadUtils } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

interface ExamResult {
  id: string;
  studentId: string;
  subject: string;
  examName: string;
  date: string;
  score: number;
  totalMarks: number;
  grade: string;
  semester: string;
  feedback?: string;
}

// Sample data for the logged-in student
const sampleExamResults: ExamResult[] = [
  {
    id: '1',
    studentId: 'student-1',
    subject: 'Mathematics 101',
    examName: 'Mid-term Exam',
    date: 'Mar 15, 2023',
    score: 85,
    totalMarks: 100,
    grade: 'A',
    semester: 'Spring 2023',
    feedback: 'Excellent work on calculus problems.'
  },
  {
    id: '2',
    studentId: 'student-1',
    subject: 'Physics 201',
    examName: 'Quiz 1',
    date: 'Feb 20, 2023',
    score: 42,
    totalMarks: 50,
    grade: 'B+',
    semester: 'Spring 2023',
    feedback: 'Good understanding of mechanics concepts.'
  },
  {
    id: '3',
    studentId: 'student-1',
    subject: 'Chemistry 101',
    examName: 'Final Exam',
    date: 'May 10, 2023',
    score: 72,
    totalMarks: 100,
    grade: 'B',
    semester: 'Spring 2023',
    feedback: 'Need improvement in organic chemistry.'
  },
  {
    id: '4',
    studentId: 'student-1',
    subject: 'Computer Science 202',
    examName: 'Project Presentation',
    date: 'Apr 28, 2023',
    score: 95,
    totalMarks: 100,
    grade: 'A+',
    semester: 'Spring 2023',
    feedback: 'Outstanding project implementation and presentation.'
  },
  {
    id: '5',
    studentId: 'student-1',
    subject: 'Literature 101',
    examName: 'Essay Submission',
    date: 'Apr 05, 2023',
    score: 78,
    totalMarks: 100,
    grade: 'B+',
    semester: 'Spring 2023',
    feedback: 'Well-structured essay with good analysis.'
  },
  {
    id: '6',
    studentId: 'student-1',
    subject: 'Mathematics 101',
    examName: 'Final Exam',
    date: 'May 20, 2023',
    score: 90,
    totalMarks: 100,
    grade: 'A',
    semester: 'Spring 2023',
    feedback: 'Excellent performance overall.'
  },
  {
    id: '7',
    studentId: 'student-2', // This shouldn't show for student-1
    subject: 'Physics 201',
    examName: 'Mid-term Exam',
    date: 'Mar 15, 2023',
    score: 75,
    totalMarks: 100,
    grade: 'B',
    semester: 'Spring 2023'
  },
];

const gradeColors: Record<string, string> = {
  'A+': 'text-green-600 dark:text-green-400',
  'A': 'text-green-600 dark:text-green-400',
  'A-': 'text-green-500 dark:text-green-400',
  'B+': 'text-blue-600 dark:text-blue-400',
  'B': 'text-blue-600 dark:text-blue-400',
  'B-': 'text-blue-500 dark:text-blue-400',
  'C+': 'text-yellow-600 dark:text-yellow-400',
  'C': 'text-yellow-600 dark:text-yellow-400',
  'C-': 'text-yellow-500 dark:text-yellow-400',
  'D': 'text-orange-600 dark:text-orange-400',
  'F': 'text-red-600 dark:text-red-400',
};

const StudentExamResults: React.FC = () => {
  const { user } = useAuth();
  const { downloadSingleResource } = useDownloadUtils();
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter results to show only the current student's data
  const studentResults = sampleExamResults.filter(result => 
    result.studentId === user?.id
  );
  
  // Apply additional filters
  const filteredResults = studentResults.filter(result => {
    const matchesSemester = selectedSemester === '' || result.semester === selectedSemester;
    const matchesSubject = selectedSubject === '' || result.subject === selectedSubject;
    const matchesSearch = searchTerm === '' || 
      result.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSemester && matchesSubject && matchesSearch;
  });
  
  // Calculate statistics
  const totalExams = studentResults.length;
  const averageScore = totalExams > 0 
    ? Math.round(studentResults.reduce((sum, result) => sum + (result.score / result.totalMarks * 100), 0) / totalExams) 
    : 0;
  
  // Get unique values for filters
  const uniqueSemesters = Array.from(new Set(studentResults.map(result => result.semester)));
  const uniqueSubjects = Array.from(new Set(studentResults.map(result => result.subject)));
  
  const handleExport = () => {
    downloadSingleResource({
      id: 'exam-results-export',
      title: 'My Exam Results',
      type: 'results',
      url: '/results/export'
    });
    
    toast({
      title: "Export Started",
      description: "Your exam results are being downloaded.",
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Overall performance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={averageScore} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>{averageScore}%</span>
                <span className="text-muted-foreground">{totalExams} exams</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Best Subject</CardTitle>
          </CardHeader>
          <CardContent>
            {studentResults.length > 0 ? (
              <>
                <div className="text-lg font-medium">
                  {studentResults.reduce((prev, current) => 
                    (current.score / current.totalMarks) > (prev.score / prev.totalMarks) ? current : prev
                  ).subject}
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  Highest performance
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Grade</CardTitle>
          </CardHeader>
          <CardContent>
            {studentResults.length > 0 ? (
              <>
                <div className={cn("text-2xl font-bold", 
                  gradeColors[studentResults.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime())[0].grade]
                )}>
                  {studentResults.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime())[0].grade}
                </div>
                <div className="text-sm text-muted-foreground">
                  {studentResults.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime())[0].examName}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Filters and tabs */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-40">
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Semesters</SelectItem>
                {uniqueSemesters.map(semester => (
                  <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-48">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {uniqueSubjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search exams..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-1"></div>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Exams</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="best">Best Grades</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Results table */}
      <div className="bg-white dark:bg-black/40 rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-left">
                <th className="p-3 font-medium">Subject</th>
                <th className="p-3 font-medium">Exam</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Score</th>
                <th className="p-3 font-medium">Grade</th>
                <th className="p-3 font-medium">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length > 0 ? (
                filteredResults
                  .sort((a, b) => {
                    if (activeTab === 'recent') {
                      return new Date(b.date).getTime() - new Date(a.date).getTime();
                    } else if (activeTab === 'best') {
                      return (b.score / b.totalMarks) - (a.score / a.totalMarks);
                    }
                    // Default sorting by date (newest first)
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                  })
                  .map((result) => (
                    <tr key={result.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3">{result.subject}</td>
                      <td className="p-3">{result.examName}</td>
                      <td className="p-3">{result.date}</td>
                      <td className="p-3">
                        {result.score} / {result.totalMarks}
                        <div className="w-16 mt-1">
                          <Progress 
                            value={(result.score / result.totalMarks) * 100} 
                            className="h-1" 
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={cn("font-medium", gradeColors[result.grade])}>
                          {result.grade}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs truncate">{result.feedback || '-'}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    No exam results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentExamResults;
