
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ExamResult, Student } from '@/types/results';
import { mockResults, mockStudents } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface ResultsContextType {
  results: ExamResult[];
  students: Student[];
  addResult: (result: Omit<ExamResult, 'id' | 'announcedDate'>) => void;
  updateResult: (id: string, result: Partial<ExamResult>) => void;
  deleteResult: (id: string) => void;
  publishResult: (id: string) => void;
  getStudentResults: (studentId: string) => ExamResult[];
  getResultById: (id: string) => ExamResult | undefined;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
  isLoading: boolean;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export const ResultsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load data
  useEffect(() => {
    setResults(mockResults);
    setStudents(mockStudents);
    setIsLoading(false);
  }, []);

  const addResult = (result: Omit<ExamResult, 'id' | 'announcedDate'>) => {
    const newResult: ExamResult = {
      ...result,
      id: `result-${Date.now()}`,
      announcedDate: new Date().toISOString(),
    };
    
    setResults(prev => [...prev, newResult]);
    toast({
      title: "Result Added",
      description: "The exam result has been added successfully.",
    });
  };

  const updateResult = (id: string, result: Partial<ExamResult>) => {
    setResults(prev => 
      prev.map(item => (item.id === id ? { ...item, ...result } : item))
    );
    toast({
      title: "Result Updated",
      description: "The exam result has been updated successfully.",
    });
  };

  const deleteResult = (id: string) => {
    setResults(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Result Deleted",
      description: "The exam result has been deleted.",
    });
  };

  const publishResult = (id: string) => {
    setResults(prev => 
      prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              status: 'published', 
              announcedBy: user?.name || 'Unknown', 
              announcedDate: new Date().toISOString() 
            } 
          : item
      )
    );
    toast({
      title: "Result Published",
      description: "The exam result is now visible to students.",
    });
  };

  const getStudentResults = (studentId: string) => {
    return results.filter(result => 
      result.studentId === studentId && result.status === 'published'
    );
  };

  const getResultById = (id: string) => {
    return results.find(result => result.id === id);
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: `student-${Date.now()}`,
    };
    
    setStudents(prev => [...prev, newStudent]);
    toast({
      title: "Student Added",
      description: "The student has been added successfully.",
    });
  };

  const updateStudent = (id: string, student: Partial<Student>) => {
    setStudents(prev => 
      prev.map(item => (item.id === id ? { ...item, ...student } : item))
    );
    toast({
      title: "Student Updated",
      description: "The student information has been updated.",
    });
  };

  const deleteStudent = (id: string) => {
    // Delete student and all associated results
    setStudents(prev => prev.filter(item => item.id !== id));
    setResults(prev => prev.filter(item => item.studentId !== id));
    toast({
      title: "Student Deleted",
      description: "The student and all associated results have been deleted.",
    });
  };

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  const value = {
    results,
    students,
    addResult,
    updateResult,
    deleteResult,
    publishResult,
    getStudentResults,
    getResultById,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    isLoading,
  };

  return <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>;
};

export const useResults = (): ResultsContextType => {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};
