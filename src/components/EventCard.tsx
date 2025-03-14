
import React from 'react';
import { Calendar, Clock, MapPin, User, Download, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useDownloadUtils } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';

export interface EventProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  image?: string;
  registrationRequired: boolean;
}

const EventCard: React.FC<{ event: EventProps }> = ({ event }) => {
  const { role } = useAuth();
  const { downloadSingleResource } = useDownloadUtils();
  const canEdit = role === 'admin' || role === 'teacher';
  
  const handleDownload = () => {
    downloadSingleResource({
      id: event.id,
      title: event.title,
      type: 'event',
      url: `/events/${event.id}`
    });
  };
  
  const handleEdit = () => {
    toast({
      title: "Edit Event",
      description: `Editing: ${event.title}`,
    });
    // In a real app, this would open an edit form
    console.log("Editing event:", event.id);
  };
  
  const handleRegister = () => {
    toast({
      title: event.registrationRequired ? "Registration" : "RSVP",
      description: `You've ${event.registrationRequired ? 'registered' : 'RSVP\'d'} for ${event.title}`,
    });
    // In a real app, this would submit a registration
    console.log(`${event.registrationRequired ? 'Registering' : 'RSVP'} for event:`, event.id);
  };
  
  return (
    <div className="card-hover rounded-xl overflow-hidden bg-white dark:bg-black/40 border shadow-sm">
      {event.image && (
        <div className="aspect-[16/9] w-full">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {event.category}
          </span>
          
          {event.registrationRequired && (
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              Registration Required
            </span>
          )}
        </div>
        
        <h3 className="font-medium text-lg">{event.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Organized by: {event.organizer}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t flex items-center justify-between">
        {canEdit ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-1" />
              <span>Edit</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              <span>Download</span>
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="h-8" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            <span>Download</span>
          </Button>
        )}
        
        <Button variant="default" size="sm" className="h-8" onClick={handleRegister}>
          {event.registrationRequired ? "Register" : "RSVP"}
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
