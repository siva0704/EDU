
export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  examName: string;
  date: string;
  score: number;
  totalMarks: number;
  grade: string;
  semester: string;
  department: string;
  feedback?: string;
  announcedBy?: string;
  announcedDate?: string;
  status: 'draft' | 'published';
}

export interface Student {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  department: string; // This will represent class (e.g., "Class 5")
  enrollmentDate: string;
  semester: string;
  avatar?: string;
  status: 'active' | 'inactive';
  yearOfStudy: string; // Section like 'A', 'B', 'C', etc.
}

export type GradeType = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';

export const gradeColors: Record<GradeType, string> = {
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

export const calculateGrade = (score: number, totalMarks: number): GradeType => {
  const percentage = (score / totalMarks) * 100;
  
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 60) return 'D';
  return 'F';
};

// Helper function to get subjects by class
export const getSubjectsByClass = (classNumber: number): string[] => {
  // Primary classes (1-5)
  if (classNumber >= 1 && classNumber <= 5) {
    return [
      'Hindi',
      'English',
      'Mathematics',
      'Environmental Science',
      'General Knowledge',
      'Art & Craft',
      'Physical Education'
    ];
  }
  // Middle classes (6-8)
  else if (classNumber >= 6 && classNumber <= 8) {
    return [
      'Hindi',
      'English',
      'Mathematics',
      'Science',
      'Social Science',
      'Sanskrit',
      'Computer Science',
      'Art Education',
      'Physical Education'
    ];
  }
  // Secondary classes (9-10)
  else if (classNumber >= 9 && classNumber <= 10) {
    return [
      'Hindi',
      'English',
      'Mathematics',
      'Science',
      'Social Science',
      'Information Technology',
      'Physical Education',
      'Optional Subject' // Could be Sanskrit, Agriculture, Home Science, etc.
    ];
  }
  return ['Unknown Subject'];
};

// Helper function to get exam types by class level
export const getExamTypesByClass = (classNumber: number): string[] => {
  // Primary classes (1-5) have simpler assessment structure
  if (classNumber >= 1 && classNumber <= 5) {
    return [
      'Periodic Test 1',
      'Periodic Test 2',
      'Half Yearly Exam',
      'Annual Exam',
      'Class Activities'
    ];
  } 
  // Higher classes have more formal examination structure
  else {
    return [
      'Periodic Assessment 1',
      'Periodic Assessment 2',
      'Half Yearly Exam',
      'Annual Exam', 
      'Practical Exam',
      'Project Work'
    ];
  }
};
