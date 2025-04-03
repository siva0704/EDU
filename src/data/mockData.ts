
import { ExamResult, Student, calculateGrade } from "@/types/results";

// Mock student data
export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    registrationNumber: 'STU2023001',
    department: 'Class 5',
    enrollmentDate: '2023-04-01',
    semester: '2023-2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1',
    status: 'active',
    yearOfStudy: 'A'
  },
  {
    id: 'student-2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    registrationNumber: 'STU2023002',
    department: 'Class 3',
    enrollmentDate: '2023-04-01',
    semester: '2023-2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2',
    status: 'active',
    yearOfStudy: 'B'
  },
  {
    id: 'student-3',
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    registrationNumber: 'STU2023003',
    department: 'Class 7',
    enrollmentDate: '2022-04-01',
    semester: '2023-2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student3',
    status: 'active',
    yearOfStudy: 'A'
  },
  {
    id: 'student-4',
    name: 'Ananya Gupta',
    email: 'ananya.gupta@example.com',
    registrationNumber: 'STU2023004',
    department: 'Class 9',
    enrollmentDate: '2023-04-01',
    semester: '2023-2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student4',
    status: 'active',
    yearOfStudy: 'C'
  },
  {
    id: 'student-5',
    name: 'Vikram Iyer',
    email: 'vikram.iyer@example.com',
    registrationNumber: 'STU2022001',
    department: 'Class 10',
    enrollmentDate: '2022-04-01',
    semester: '2023-2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student5',
    status: 'active',
    yearOfStudy: 'B'
  }
];

// Create results based on students
export const generateMockResults = (): ExamResult[] => {
  const primarySubjects = [
    'Hindi', 
    'English', 
    'Mathematics', 
    'Environmental Studies',
    'General Knowledge'
  ];
  
  const middleSubjects = [
    'Hindi',
    'English',
    'Mathematics',
    'Science',
    'Social Studies',
    'Sanskrit'
  ];
  
  const highSubjects = [
    'Hindi',
    'English',
    'Mathematics',
    'Science',
    'Social Science',
    'Sanskrit/Computer'
  ];
  
  const examNames = [
    'Unit Test 1',
    'Mid-Term Exam',
    'Unit Test 2',
    'Final Exam',
    'Quarterly Assessment',
    'Half-Yearly Assessment',
    'Annual Assessment'
  ];
  
  const academicYears = ['2023-2024', '2022-2023', '2021-2022'];
  
  const results: ExamResult[] = [];
  let resultId = 1;
  
  mockStudents.forEach(student => {
    // Assign 3-5 random exam results to each student
    const numResults = Math.floor(Math.random() * 3) + 3;
    
    // Select appropriate subjects based on class
    let subjectsForClass: string[] = [];
    const classNumber = parseInt(student.department.split(' ')[1]);
    
    if (classNumber <= 5) {
      subjectsForClass = primarySubjects;
    } else if (classNumber <= 8) {
      subjectsForClass = middleSubjects;
    } else {
      subjectsForClass = highSubjects;
    }
    
    for (let i = 0; i < numResults; i++) {
      const subject = subjectsForClass[Math.floor(Math.random() * subjectsForClass.length)];
      const examName = examNames[Math.floor(Math.random() * examNames.length)];
      const semester = academicYears[Math.floor(Math.random() * academicYears.length)];
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
