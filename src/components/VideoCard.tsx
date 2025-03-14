
import React from 'react';
import { Play, Download, Clock, Calendar, User, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useDownloadUtils } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';

export interface VideoProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
  teacher: string;
  subject: string;
  url: string;
}

const VideoCard: React.FC<{ video: VideoProps }> = ({ video }) => {
  const { role } = useAuth();
  const { downloadSingleResource } = useDownloadUtils();
  const canEdit = role === 'admin' || role === 'teacher';
  
  const handlePlay = () => {
    toast({
      title: "Playing Video",
      description: `Now playing: ${video.title}`,
    });
    // In a real app, this would open a video player or modal
    console.log("Playing video:", video.url);
  };
  
  const handleDownload = () => {
    downloadSingleResource({
      id: video.id,
      title: video.title,
      type: 'video',
      url: video.url
    });
  };
  
  const handleEdit = () => {
    toast({
      title: "Edit Video",
      description: `Editing: ${video.title}`,
    });
    // In a real app, this would open an edit form
    console.log("Editing video:", video.id);
  };
  
  return (
    <div className="card-hover rounded-xl overflow-hidden bg-white dark:bg-black/40 border shadow-sm">
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <Button 
            className="h-12 w-12 rounded-full bg-primary/90 hover:bg-primary text-white border-4 border-white/20"
            size="icon"
            aria-label="Play video"
            onClick={handlePlay}
          >
            <Play className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded-md flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{video.duration}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-lg truncate">{video.title}</h3>
        <div className="mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1 mb-1">
            <User className="h-3.5 w-3.5" />
            <span>{video.teacher}</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{video.date}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {video.subject}
          </span>
          {canEdit ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-1" />
                <span>Edit</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only">Download</span>
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="h-8" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only">Download</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
