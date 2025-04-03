
import { ExamResult, Student, calculateGrade, getSubjectsByClass, getExamTypesByClass } from "@/types/results";

// Mock student data with Indian education system classes
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
  },
  {
    id: 'student-6',
    name: 'Neha Kapoor',
    email: 'neha.kapoor@example.com',
    registrationNumber: 'STU2023005',
    department: 'Class 2',
    enrollmentDate: '2023-04-01',
    semester: '2023-2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student6',
    status: 'active',
    yearOfStudy: 'A'
  },
  {
    id: 'student-7',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    registrationNumber: 'STU2023006',
    department: 'Class 8',
    enrollmentDate: '2023-04-01',
    semester: '2023-2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student7',
    status: 'active',
    yearOfStudy: 'B'
  },
  {
    id: 'student-8',
    name: 'Riya Malhotra',
    email: 'riya.malhotra@example.com',
    registrationNumber: 'STU2023007',
    department: 'Class 1',
    enrollmentDate: '2023-04-01',
    semester: '2023-2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student8',
    status: 'active',
    yearOfStudy: 'C'
  },
  {
    id: 'student-9',
    name: 'Karan Mehra',
    email: 'karan.mehra@example.com',
    registrationNumber: 'STU2023008',
    department: 'Class 6',
    enrollmentDate: '2023-04-01',
    semester: '2023-2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student9',
    status: 'active',
    yearOfStudy: 'A'
  },
  {
    id: 'student-10',
    name: 'Divya Reddy',
    email: 'divya.reddy@example.com',
    registrationNumber: 'STU2023009',
    department: 'Class 4',
    enrollmentDate: '2023-04-01',
    semester: '2023-2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student10',
    status: 'active',
    yearOfStudy: 'B'
  }
];

// Create results based on students
export const generateMockResults = (): ExamResult[] => {
  const academicYears = ['2023-2024', '2022-2023', '2021-2022'];
  
  const results: ExamResult[] = [];
  let resultId = 1;
  
  mockStudents.forEach(student => {
    // Extract class number from department
    const classNumber = parseInt(student.department.split(' ')[1]);
    
    // Get appropriate subjects based on class
    const subjectsForClass = getSubjectsByClass(classNumber);
    
    // Get appropriate exam types based on class
    const examNames = getExamTypesByClass(classNumber);
    
    // Assign 3-5 random exam results to each student
    const numResults = Math.floor(Math.random() * 3) + 3;
    
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
