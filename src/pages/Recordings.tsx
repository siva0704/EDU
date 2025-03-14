
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import VideoCard, { VideoProps } from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Download, Filter, Plus, Search } from 'lucide-react';
import { useDownloadUtils } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';

// Sample data
const sampleVideos: VideoProps[] = [
  {
    id: '1',
    title: 'Introduction to Algebra',
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    duration: '8:15',
    date: 'Apr 15, 2023',
    teacher: 'John Smith',
    subject: 'Mathematics',
    url: '/videos/algebra.mp4'
  },
  {
    id: '2',
    title: 'Chemistry Lab: Reactions',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
    duration: '10:30',
    date: 'Apr 12, 2023',
    teacher: 'Emily Johnson',
    subject: 'Chemistry',
    url: '/videos/chemistry.mp4'
  },
  {
    id: '3',
    title: 'American Literature Overview',
    thumbnail: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493',
    duration: '7:45',
    date: 'Apr 10, 2023',
    teacher: 'Robert Williams',
    subject: 'Literature',
    url: '/videos/literature.mp4'
  },
  {
    id: '4',
    title: 'Cell Biology Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1592434134753-a70baf7979d5',
    duration: '9:20',
    date: 'Apr 8, 2023',
    teacher: 'Sarah Davis',
    subject: 'Biology',
    url: '/videos/biology.mp4'
  },
  {
    id: '5',
    title: 'Introduction to Python',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    duration: '6:50',
    date: 'Apr 5, 2023',
    teacher: 'Michael Brown',
    subject: 'Computer Science',
    url: '/videos/python.mp4'
  },
  {
    id: '6',
    title: 'World War II: Key Events',
    thumbnail: 'https://images.unsplash.com/photo-1581079288675-14e11f4474bf',
    duration: '9:15',
    date: 'Apr 3, 2023',
    teacher: 'Amanda Miller',
    subject: 'History',
    url: '/videos/history.mp4'
  },
];

const Recordings = () => {
  const { role } = useAuth();
  const { downloadAllResources } = useDownloadUtils();
  const [searchTerm, setSearchTerm] = useState('');
  
  const canAdd = role === 'admin' || role === 'teacher';
  
  const handleDownloadAll = () => {
    const resources = sampleVideos.map(video => ({
      id: video.id,
      title: video.title,
      type: 'video',
      url: video.url
    }));
    
    downloadAllResources(resources, 'All Class Recordings');
  };
  
  const handleAddNew = () => {
    toast({
      title: "Add New Recording",
      description: "Opening form to add a new class recording.",
    });
    // In a real app, this would open a form to add a new recording
    console.log("Opening add new recording form");
  };
  
  const handleFilter = () => {
    toast({
      title: "Filter Options",
      description: "Opening filter options for recordings.",
    });
    // In a real app, this would open filter options
    console.log("Opening filter options");
  };
  
  const filteredVideos = sampleVideos.filter(
    video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Class Recordings</h2>
              <p className="text-muted-foreground">Browse and view class recordings</p>
            </div>
            
            <div className="flex items-center gap-2">
              {canAdd && (
                <Button className="h-10" onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
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
                placeholder="Search by title, subject, or teacher..."
                className="w-full h-10 pl-9 pr-3 rounded-lg border bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button variant="outline" className="h-10 sm:w-auto w-full" onClick={handleFilter}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          
          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recordings found. Try a different search term.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Recordings;
