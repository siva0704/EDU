
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ContactCard, { ContactProps } from '../components/ContactCard';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Download, Filter, Plus, Search } from 'lucide-react';
import { useDownloadUtils } from '@/utils/downloadUtils';

// Sample data
const sampleContacts: ContactProps[] = [
  {
    id: '1',
    name: 'Dr. John Smith',
    title: 'Mathematics Department Chair',
    department: 'Mathematics',
    email: 'john.smith@example.edu',
    phone: '(555) 123-4567',
    office: 'Building A, Room 101',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    name: 'Prof. Emily Johnson',
    title: 'Senior Chemistry Instructor',
    department: 'Chemistry',
    email: 'emily.johnson@example.edu',
    phone: '(555) 234-5678',
    office: 'Science Hall, Room 305',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    name: 'Dr. Robert Williams',
    title: 'Literature Professor',
    department: 'English',
    email: 'robert.williams@example.edu',
    phone: '(555) 345-6789',
    office: 'Liberal Arts, Room 210',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '4',
    name: 'Dr. Sarah Davis',
    title: 'Biology Instructor',
    department: 'Biology',
    email: 'sarah.davis@example.edu',
    phone: '(555) 456-7890',
    office: 'Science Hall, Room 210',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: '5',
    name: 'Michael Brown',
    title: 'Computer Science Teacher',
    department: 'Computer Science',
    email: 'michael.brown@example.edu',
    phone: '(555) 567-8901',
    office: 'Tech Building, Room 402',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    id: '6',
    name: 'Amanda Miller',
    title: 'History Teacher',
    department: 'History',
    email: 'amanda.miller@example.edu',
    phone: '(555) 678-9012',
    office: 'Liberal Arts, Room 115',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  {
    id: '7',
    name: 'Dr. James Wilson',
    title: 'Physics Department Chair',
    department: 'Physics',
    email: 'james.wilson@example.edu',
    phone: '(555) 789-0123',
    office: 'Science Hall, Room 401',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
  },
  {
    id: '8',
    name: 'Jennifer Moore',
    title: 'Art Teacher',
    department: 'Fine Arts',
    email: 'jennifer.moore@example.edu',
    phone: '(555) 890-1234',
    office: 'Arts Building, Room 203',
    avatar: 'https://randomuser.me/api/portraits/women/8.jpg'
  },
  {
    id: '9',
    name: 'Thomas Clark',
    title: 'Physical Education Teacher',
    department: 'Physical Education',
    email: 'thomas.clark@example.edu',
    phone: '(555) 901-2345',
    office: 'Gymnasium, Office 3',
    avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
  }
];

const Contacts = () => {
  const { role } = useAuth();
  const { downloadAllResources } = useDownloadUtils();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  
  const canAdd = role === 'admin';
  
  const handleDownloadAll = () => {
    const resources = [{
      id: 'contacts-directory',
      title: 'Department Contacts Directory',
      type: 'document',
      url: '/contacts/export'
    }];
    
    downloadAllResources(resources, 'Department Contacts Directory');
  };
  
  // Get unique departments
  const departments = ['All', ...Array.from(new Set(sampleContacts.map(contact => contact.department)))];
  
  // Filter contacts
  const filteredContacts = sampleContacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contact.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.title.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = selectedDepartment === 'All' || contact.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Department Contacts</h2>
              <p className="text-muted-foreground">Browse and search the faculty and staff directory</p>
            </div>
            
            <div className="flex items-center gap-2">
              {canAdd && (
                <Button className="h-10">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              )}
              
              <Button variant="outline" className="h-10" onClick={handleDownloadAll}>
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search by name, title, or department..."
                className="w-full h-10 pl-9 pr-3 rounded-lg border bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="h-10 px-3 rounded-lg border bg-transparent focus:outline-none focus:ring-1 focus:ring-primary sm:w-auto w-full"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
          
          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No contacts found. Try a different search term or department.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Contacts;
