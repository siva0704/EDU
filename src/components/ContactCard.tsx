
import React from 'react';
import { Phone, Mail, Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export interface ContactProps {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  office: string;
  avatar: string;
}

const ContactCard: React.FC<{ contact: ContactProps }> = ({ contact }) => {
  const { role } = useAuth();
  const canEdit = role === 'admin';
  
  return (
    <div className="card-hover rounded-xl overflow-hidden bg-white dark:bg-black/40 border shadow-sm">
      <div className="p-4 flex items-center space-x-4">
        <div className="relative h-16 w-16 flex-shrink-0">
          <img
            src={contact.avatar || 'https://via.placeholder.com/150'}
            alt={contact.name}
            className="rounded-full object-cover h-full w-full"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-lg truncate">{contact.name}</h3>
          <p className="text-sm text-muted-foreground">{contact.title}</p>
          <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {contact.department}
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-0 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
            {contact.email}
          </a>
        </div>
        
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">
            {contact.phone}
          </a>
        </div>
        
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span>{contact.office}</span>
        </div>
      </div>
      
      {canEdit && (
        <div className="p-4 border-t flex justify-end">
          <Button variant="outline" size="sm" className="h-8">Edit</Button>
        </div>
      )}
    </div>
  );
};

export default ContactCard;
