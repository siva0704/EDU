
import { ExamResult, Student, calculateGrade } from "@/types/results";

// Mock student data
export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    registrationNumber: 'STU2023001',
    department: 'Computer Science',
    enrollmentDate: '2023-09-01',
    semester: 'Fall 2023',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1',
    status: 'active',
    yearOfStudy: 2
  },
  {
    id: 'student-2',
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    registrationNumber: 'STU2023002',
    department: 'Mathematics',
    enrollmentDate: '2023-09-01',
    semester: 'Fall 2023',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2',
    status: 'active',
    yearOfStudy: 1
  },
  {
    id: 'student-3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    registrationNumber: 'STU2023003',
    department: 'Physics',
    enrollmentDate: '2022-09-01',
    semester: 'Fall 2023',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student3',
    status: 'active',
    yearOfStudy: 2
  },
  {
    id: 'student-4',
    name: 'Sophia Williams',
    email: 'sophia.williams@example.com',
    registrationNumber: 'STU2023004',
    department: 'Biology',
    enrollmentDate: '2023-09-01',
    semester: 'Fall 2023',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student4',
    status: 'active',
    yearOfStudy: 1
  },
  {
    id: 'student-5',
    name: 'Daniel Jones',
    email: 'daniel.jones@example.com',
    registrationNumber: 'STU2022001',
    department: 'Chemistry',
    enrollmentDate: '2022-09-01',
    semester: 'Fall 2023',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student5',
    status: 'active',
    yearOfStudy: 2
  }
];

// Create results based on students
export const generateMockResults = (): ExamResult[] => {
  const subjects = [
    'Mathematics 101', 
    'Physics 201', 
    'Computer Science 102', 
    'Biology 101',
    'Chemistry 201',
    'Literature 101',
    'Programming 202'
  ];
  
  const examNames = [
    'Mid-term Exam',
    'Final Exam',
    'Quiz 1',
    'Quiz 2',
    'Project Presentation',
    'Lab Assessment',
    'Essay Submission'
  ];
  
  const semesters = ['Fall 2023', 'Spring 2023', 'Summer 2023'];
  
  const results: ExamResult[] = [];
  let resultId = 1;
  
  mockStudents.forEach(student => {
    // Assign 3-5 random exam results to each student
    const numResults = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < numResults; i++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const examName = examNames[Math.floor(Math.random() * examNames.length)];
      const semester = semesters[Math.floor(Math.random() * semesters.length)];
      const score = Math.floor(Math.random() * 40) + 60; // Scores between 60-100
      const totalMarks = 100;
      
      const result: ExamResult = {
        id: `result-${resultId++}`,
        studentId: student.id,
        studentName: student.name,
        subject,
        examName,
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
        score,
        totalMarks,
        grade: calculateGrade(score, totalMarks),
        semester,
        department: student.department,
        feedback: Math.random() > 0.3 ? `Performance in ${subject} is ${score >= 80 ? 'excellent' : score >= 70 ? 'good' : 'needs improvement'}.` : undefined,
        announcedBy: Math.random() > 0.2 ? 'Teacher User' : 'Admin User',
        announcedDate: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
        status: Math.random() > 0.2 ? 'published' : 'draft'
      };
      
      results.push(result);
    }
  });
  
  return results;
};

export const mockResults = generateMockResults();
