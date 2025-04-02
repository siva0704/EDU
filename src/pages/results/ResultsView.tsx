
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useResults } from '@/context/ResultsContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast'; // Add this import
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Search, Download, BarChart3, TrendingUp, FileText, ArrowLeft } from 'lucide-react';
import { ExamResult, gradeColors } from '@/types/results';

const ResultDetailDialog: React.FC<{
  result: ExamResult | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}> = ({ result, isOpen, setIsOpen }) => {
  if (!result) return null;
  
  const percentage = Math.round((result.score / result.totalMarks) * 100);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{result.examName}</DialogTitle>
          <DialogDescription>{result.subject}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex justify-between">
            <span className="font-medium">Student:</span>
            <span>{result.studentName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Department:</span>
            <span>{result.department}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Semester:</span>
            <span>{result.semester}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{result.date}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Score:</span>
            <span>{result.score} / {result.totalMarks}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Grade:</span>
              <span className={cn("font-bold", gradeColors[result.grade as keyof typeof gradeColors])}>
                {result.grade}
              </span>
            </div>
            
            <Progress value={percentage} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">{percentage}%</div>
          </div>
          
          {result.feedback && (
            <div>
              <div className="font-medium mb-1">Feedback:</div>
              <div className="bg-muted p-3 rounded-md text-sm">{result.feedback}</div>
            </div>
          )}
          
          <div className="flex justify-between text-xs text-muted-foreground pt-2">
            <span>Published by: {result.announcedBy}</span>
            <span>
              {new Date(result.announcedDate || '').toLocaleDateString()}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ResultsView: React.FC = () => {
  const navigate = useNavigate();
  const { results, students } = useResults();
  const { user, role } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // For student role, filter only their results
  let userResults = role === 'student' 
    ? results.filter(r => r.studentId === user?.id && r.status === 'published')
    : results.filter(r => r.status === 'published');
    
  // Apply filters
  const filteredResults = userResults.filter(result => {
    const matchesSemester = selectedSemester === '' || result.semester === selectedSemester;
    const matchesSubject = selectedSubject === '' || result.subject === selectedSubject;
    const matchesSearch = searchTerm === '' || 
      result.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role !== 'student' && result.studentName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSemester && matchesSubject && matchesSearch;
  });
  
  // Sort results based on tab selection
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (activeTab === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (activeTab === 'best') {
      return (b.score / b.totalMarks) - (a.score / a.totalMarks);
    }
    // Default sorting by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Calculate statistics
  const totalExams = userResults.length;
  const averageScore = totalExams > 0 
    ? Math.round(userResults.reduce((sum, result) => sum + (result.score / result.totalMarks * 100), 0) / totalExams) 
    : 0;
  
  // Prepare chart data
  const subjectPerformance = role === 'student'
    ? [...new Set(userResults.map(r => r.subject))].map(subject => {
        const subjectResults = userResults.filter(r => r.subject === subject);
        const avgScore = Math.round(
          subjectResults.reduce((sum, r) => sum + (r.score / r.totalMarks * 100), 0) / subjectResults.length
        );
        return {
          name: subject,
          score: avgScore
        };
      })
    : [];
    
  // Get unique values for filters
  const uniqueSemesters = Array.from(new Set(userResults.map(result => result.semester)));
  const uniqueSubjects = Array.from(new Set(userResults.map(result => result.subject)));
  
  // Grade distribution for pie chart
  const gradeDistribution = role === 'student'
    ? [
        { name: 'A+/A/A-', count: userResults.filter(r => ['A+', 'A', 'A-'].includes(r.grade)).length },
        { name: 'B+/B/B-', count: userResults.filter(r => ['B+', 'B', 'B-'].includes(r.grade)).length },
        { name: 'C+/C/C-', count: userResults.filter(r => ['C+', 'C', 'C-'].includes(r.grade)).length },
        { name: 'D', count: userResults.filter(r => r.grade === 'D').length },
        { name: 'F', count: userResults.filter(r => r.grade === 'F').length },
      ].filter(item => item.count > 0)
    : [];
    
  const GRADE_COLORS = ['#4ade80', '#60a5fa', '#facc15', '#f97316', '#ef4444'];
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your exam results are being downloaded.",
    });
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" className="mr-2" onClick={() => navigate('/results')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              {role === 'student' ? 'My Exam Results' : 'View Exam Results'}
            </h1>
          </div>
          
          {role === 'student' && (
            <div className="mb-6">
              {/* Overall performance cards for student */}
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
                    {userResults.length > 0 ? (
                      <>
                        <div className="text-lg font-medium">
                          {subjectPerformance.sort((a, b) => b.score - a.score)[0]?.name || "N/A"}
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
                    {userResults.length > 0 ? (
                      <>
                        <div className={cn("text-2xl font-bold", 
                          gradeColors[userResults.sort((a, b) => 
                            new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.grade as keyof typeof gradeColors]
                        )}>
                          {userResults.sort((a, b) => 
                            new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.grade}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {userResults.sort((a, b) => 
                            new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.examName}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">No data available</div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts for student */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Subject Performance Chart */}
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                      Subject Performance
                    </CardTitle>
                    <CardDescription>
                      Your performance across different subjects
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    {subjectPerformance.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={subjectPerformance}
                            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 12 }}
                              tickLine={false}
                              axisLine={false}
                              angle={-45}
                              textAnchor="end"
                              height={50}
                            />
                            <YAxis 
                              tickLine={false}
                              axisLine={false}
                              domain={[0, 100]}
                              tick={{ fontSize: 12 }}
                              label={{ 
                                value: 'Score %', 
                                angle: -90, 
                                position: 'insideLeft',
                                style: { fontSize: 12, fill: '#6b7280' }
                              }}
                            />
                            <Tooltip />
                            <Bar dataKey="score" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                        No data available to display chart
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Grade Distribution Chart */}
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                      Grade Distribution
                    </CardTitle>
                    <CardDescription>
                      Distribution of grades across all your exams
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    {gradeDistribution.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={gradeDistribution}
                              dataKey="count"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label
                            >
                              {gradeDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={GRADE_COLORS[index % GRADE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                        No data available to display chart
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {/* Filters and tabs */}
          <div className="flex flex-col gap-4 my-6">
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
                  placeholder={role === 'student' ? "Search exams..." : "Search students, exams..."}
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
                    {role !== 'student' && <th className="p-3 font-medium">Student</th>}
                    <th className="p-3 font-medium">Subject</th>
                    <th className="p-3 font-medium">Exam</th>
                    <th className="p-3 font-medium">Date</th>
                    <th className="p-3 font-medium">Score</th>
                    <th className="p-3 font-medium">Grade</th>
                    <th className="p-3 font-medium">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.length > 0 ? (
                    sortedResults.map((result) => (
                      <tr key={result.id} 
                          onClick={() => {
                            setSelectedResult(result);
                            setIsDetailDialogOpen(true);
                          }} 
                          className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                        {role !== 'student' && (
                          <td className="p-3">
                            <div>{result.studentName}</div>
                            <div className="text-xs text-muted-foreground">{result.department}</div>
                          </td>
                        )}
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
                          <span className={cn("font-medium", gradeColors[result.grade as keyof typeof gradeColors])}>
                            {result.grade}
                          </span>
                        </td>
                        <td className="p-3 max-w-xs truncate">{result.feedback || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={role !== 'student' ? 7 : 6} className="p-4 text-center text-muted-foreground">
                        No exam results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Result Detail Dialog */}
          <ResultDetailDialog 
            result={selectedResult} 
            isOpen={isDetailDialogOpen} 
            setIsOpen={setIsDetailDialogOpen} 
          />
        </main>
      </div>
    </div>
  );
};

export default ResultsView;
