import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import VideoCard, { VideoProps } from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Download, Filter, Plus, Search } from 'lucide-react';
import { useDownloadUtils } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';
import AddRecordingModal from '../components/recordings/AddRecordingModal';
import RecordingsFilter from '../components/recordings/RecordingsFilter';

// Sample data
export const sampleVideos: VideoProps[] = [
  {
    id: '1',
    title: 'Introduction to the Human Musculoskeletal System',
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    duration: '8:15',
    date: 'Apr 15, 2023',
    teacher: 'Dr. John Smith',
    subject: 'Anatomy',
    url: '/videos/anatomy-musculoskeletal.mp4'
  },
  {
    id: '2',
    title: 'Cardiovascular System Function & Regulation',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
    duration: '10:30',
    date: 'Apr 12, 2023',
    teacher: 'Dr. Emily Johnson',
    subject: 'Physiology',
    url: '/videos/physiology-cardiovascular.mp4'
  },
  {
    id: '3',
    title: 'Pathogenesis of Cancer & Tumor Development',
    thumbnail: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493',
    duration: '7:45',
    date: 'Apr 10, 2023',
    teacher: 'Dr. Robert Williams',
    subject: 'Pathology',
    url: '/videos/pathology-cancer.mp4'
  },
  {
    id: '4',
    title: 'Bacterial Classification & Gram Staining',
    thumbnail: 'https://images.unsplash.com/photo-1592434134753-a70baf7979d5',
    duration: '9:20',
    date: 'Apr 8, 2023',
    teacher: 'Dr. Sarah Davis',
    subject: 'Microbiology',
    url: '/videos/microbiology-bacteria.mp4'
  },
  {
    id: '5',
    title: 'Principles of Drug Metabolism & Pharmacokinetics',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    duration: '6:50',
    date: 'Apr 5, 2023',
    teacher: 'Dr. Michael Brown',
    subject: 'Pharmacology',
    url: '/videos/pharmacology-metabolism.mp4'
  },
  {
    id: '6',
    title: 'Neuroanatomy: Brain Structures & Functions',
    thumbnail: 'https://images.unsplash.com/photo-1581079288675-14e11f4474bf',
    duration: '9:15',
    date: 'Apr 3, 2023',
    teacher: 'Dr. Amanda Miller',
    subject: 'Anatomy',
    url: '/videos/anatomy-brain.mp4'
  },
];

const Recordings = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { downloadAllResources } = useDownloadUtils();
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState<VideoProps[]>(sampleVideos);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    subjects: [] as string[],
    teachers: [] as string[],
    dateRange: 'all' as 'all' | 'today' | 'week' | 'month'
  });
  
  const canAdd = role === 'admin' || role === 'teacher';
  
  const handleDownloadAll = () => {
    const resources = videos.map(video => ({
      id: video.id,
      title: video.title,
      type: 'video',
      url: video.url
    }));
    
    downloadAllResources(resources, 'All Class Recordings');
  };
  
  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };
  
  const handleFilter = () => {
    setIsFilterOpen(true);
  };
  
  const handleSaveRecording = (recording: Omit<VideoProps, 'id'>) => {
    // Generate a new ID (in a real app, this would be handled by the backend)
    const newId = (videos.length + 1).toString();
    const newRecording = { ...recording, id: newId };
    
    // Add the new recording to the list
    setVideos(prev => [newRecording, ...prev]);
    
    toast({
      title: "Recording Added",
      description: `Successfully added "${recording.title}"`,
    });
  };
  
  const handleApplyFilter = (filterOptions: {
    subjects: string[];
    teachers: string[];
    dateRange: 'all' | 'today' | 'week' | 'month';
  }) => {
    setActiveFilters(filterOptions);
    
    toast({
      title: "Filters Applied",
      description: "The recordings list has been filtered according to your criteria.",
    });
  };
  
  // Apply filters and search
  const filteredVideos = videos.filter(video => {
    // Search term filter
    const matchesSearch = 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.teacher.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Subject filter
    const matchesSubject = 
      activeFilters.subjects.length === 0 || 
      activeFilters.subjects.includes(video.subject);
      
    // Teacher filter
    const matchesTeacher = 
      activeFilters.teachers.length === 0 || 
      activeFilters.teachers.includes(video.teacher);
      
    // Date filter (simplified for demo)
    const matchesDate = activeFilters.dateRange === 'all' || true;
    
    return matchesSearch && matchesSubject && matchesTeacher && matchesDate;
  });
  
  const handlePlayVideo = (videoId: string) => {
    navigate(`/recordings/${videoId}`);
  };
  
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
            
            <Button 
              variant="outline" 
              className={`h-10 sm:w-auto w-full ${activeFilters.subjects.length > 0 || activeFilters.teachers.length > 0 ? 'bg-primary/10' : ''}`} 
              onClick={handleFilter}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter{activeFilters.subjects.length > 0 || activeFilters.teachers.length > 0 ? ' (Active)' : ''}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onPlay={() => handlePlayVideo(video.id)}
              />
            ))}
          </div>
          
          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recordings found. Try a different search term or adjust your filters.</p>
            </div>
          )}
        </main>
      </div>
      
      {/* Modals */}
      <AddRecordingModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveRecording}
      />
      
      <RecordingsFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        videos={videos}
        onApplyFilter={handleApplyFilter}
      />
    </div>
  );
};

export default Recordings;
