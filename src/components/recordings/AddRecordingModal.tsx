
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { VideoProps } from '../VideoCard';

interface AddRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recording: Omit<VideoProps, 'id'>) => void;
}

const AddRecordingModal: React.FC<AddRecordingModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [duration, setDuration] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !subject || !teacher) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
    
    const newRecording: Omit<VideoProps, 'id'> = {
      title,
      subject,
      teacher,
      duration: duration || '0:00',
      date: currentDate,
      thumbnail: thumbnailUrl || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      url: videoUrl || '/videos/default.mp4'
    };
    
    onSave(newRecording);
    resetForm();
  };
  
  const resetForm = () => {
    setTitle('');
    setSubject('');
    setTeacher('');
    setDuration('');
    setThumbnailUrl('');
    setVideoUrl('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Recording</DialogTitle>
          <DialogDescription>
            Create a new class recording. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Introduction to Topic"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Mathematics"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher <span className="text-red-500">*</span></Label>
                <Input
                  id="teacher"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  placeholder="John Smith"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="8:15"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="/videos/recording.mp4"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">Save Recording</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecordingModal;
