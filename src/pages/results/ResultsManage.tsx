
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useResults } from '@/context/ResultsContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Filter
} from 'lucide-react';
import { ExamResult, Student, calculateGrade, gradeColors } from '@/types/results';
import { toast } from '@/components/ui/use-toast';
import ResultForm from '@/components/results/ResultForm';
import { cn } from '@/lib/utils';

const ResultsManage: React.FC = () => {
  const { results, students, deleteResult, publishResult } = useResults();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [tabValue, setTabValue] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  
  // Get unique values for filters
  const departments = [...new Set(students.map(s => s.department))];
  const subjects = [...new Set(results.map(r => r.subject))];
  const semesters = [...new Set(results.map(r => r.semester))];
  
  // Filter results
  const filteredResults = results.filter(result => {
    const matchesSearch = 
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      result.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.examName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = selectedDepartment === 'all' ? true : result.department === selectedDepartment;
    const matchesSubject = selectedSubject === 'all' ? true : result.subject === selectedSubject;
    const matchesSemester = selectedSemester === 'all' ? true : result.semester === selectedSemester;
    const matchesTab = 
      tabValue === 'all' ? true : 
      tabValue === 'published' ? result.status === 'published' : 
      result.status === 'draft';
    
    return matchesSearch && matchesDepartment && matchesSubject && matchesSemester && matchesTab;
  });

  const handlePublish = (id: string) => {
    publishResult(id);
  };

  const handleEdit = (result: ExamResult) => {
    setSelectedResult(result);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this result? This action cannot be undone.')) {
      deleteResult(id);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold">Manage Results</h1>
            
            <div className="flex gap-2">
              <Button onClick={() => navigate('/results')} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Results Dashboard
              </Button>
              
              <Button onClick={() => {
                setSelectedResult(null);
                setIsAddDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Result
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student, subject or exam..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Tabs value={tabValue} onValueChange={setTabValue}>
              <TabsList>
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Results Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Exam Name</TableHead>
                  <TableHead className="hidden md:table-cell">Semester</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div className="font-medium">{result.studentName}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{result.department}</div>
                      </TableCell>
                      <TableCell>{result.subject}</TableCell>
                      <TableCell>
                        <div>{result.examName}</div>
                        <div className="text-xs text-muted-foreground">{result.date}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{result.semester}</TableCell>
                      <TableCell className="text-center">{result.score}/{result.totalMarks}</TableCell>
                      <TableCell className="text-center">
                        <span className={cn("font-medium", gradeColors[result.grade as keyof typeof gradeColors])}>
                          {result.grade}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {result.status === 'published' ? (
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30">
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(result)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {result.status === 'draft' && (
                              <DropdownMenuItem onClick={() => handlePublish(result.id)}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Publish
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDelete(result.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-10 w-10 mb-3 text-muted-foreground/40" />
                        <div className="font-medium mb-1">No results found</div>
                        <div className="text-sm">Try adjusting your search or filters.</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Add/Edit Result Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedResult ? 'Edit Result' : 'Add New Result'}</DialogTitle>
                <DialogDescription>
                  {selectedResult 
                    ? 'Make changes to the selected exam result.' 
                    : 'Enter the details to create a new exam result.'}
                </DialogDescription>
              </DialogHeader>
              
              <ResultForm 
                initialData={selectedResult}
                onClose={() => setIsAddDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default ResultsManage;
