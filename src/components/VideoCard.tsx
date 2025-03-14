
import React from 'react';
import { Play, Calendar, Clock, Download, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useDownloadUtils } from '@/utils/downloadUtils';

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

interface VideoCardProps {
  video: VideoProps;
  onPlay?: (videoId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  const { role } = useAuth();
  const { downloadSingleResource } = useDownloadUtils();
  
  const handleDownload = () => {
    downloadSingleResource({
      id: video.id,
      title: video.title,
      type: 'video',
      url: video.url
    });
  };
  
  const handlePlay = () => {
    if (onPlay) {
      onPlay(video.id);
    }
  };
  
  return (
    <div className="card-hover rounded-xl overflow-hidden bg-white dark:bg-black/40 border shadow-sm">
      <div className="relative aspect-video">
        <img 
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="icon"
            className="rounded-full h-12 w-12 bg-primary/90 hover:bg-primary"
            onClick={handlePlay}
          >
            <Play className="h-5 w-5 ml-0.5" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-medium text-lg line-clamp-1">{video.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{video.subject}</p>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{video.teacher}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{video.date}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{video.duration}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t flex justify-end">
        <Button size="sm" variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default VideoCard;
