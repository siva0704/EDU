
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Play } from 'lucide-react';
import { useDownloadUtils } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';

// Sample data (in a real app, this would come from an API)
import { sampleVideos } from './Recordings';

const RecordingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { downloadSingleResource } = useDownloadUtils();
  
  // Find the video by ID
  const video = sampleVideos.find(video => video.id === id);
  
  if (!video) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="flex items-center mb-6">
              <Button variant="outline" onClick={() => navigate('/recordings')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Recordings
              </Button>
            </div>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Recording Not Found</h2>
              <p className="text-muted-foreground">The recording you're looking for doesn't exist.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  const handleDownload = () => {
    downloadSingleResource({
      id: video.id,
      title: video.title,
      type: 'video',
      url: video.url
    });
  };
  
  const handlePlay = () => {
    toast({
      title: "Playing Video",
      description: `Now playing: ${video.title}`,
    });
    // In a real app, this would trigger video playback
    console.log(`Playing video: ${video.title}`);
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="flex items-center mb-6">
            <Button variant="outline" onClick={() => navigate('/recordings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recordings
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative aspect-video bg-black/10 rounded-xl overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    size="lg"
                    className="rounded-full h-16 w-16 flex items-center justify-center bg-primary/90 hover:bg-primary"
                    onClick={handlePlay}
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                <p className="text-muted-foreground">{video.subject}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-muted-foreground">Teacher</h3>
                  <p>{video.teacher}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">Duration</h3>
                  <p>{video.duration}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">Date</h3>
                  <p>{video.date}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Description</h3>
                <p className="text-sm">
                  This recording covers the key topics in {video.subject} taught by {video.teacher}. 
                  The session includes detailed explanations and examples to help students understand the material.
                </p>
              </div>
              
              <Button className="w-full" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Recording
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecordingDetail;
