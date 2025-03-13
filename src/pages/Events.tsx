
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import EventCard, { EventProps } from '../components/EventCard';

const Events = () => {
  // Mock event data that would typically come from an API
  const events: EventProps[] = [
    {
      id: '1',
      title: "End of Year Exam Preparation",
      date: "2023-06-15",
      time: "14:00 - 16:00",
      location: "Main Auditorium",
      description: "Preparation session for final exams covering key topics and exam techniques.",
      organizer: "Academic Department",
      category: "Academic",
      registrationRequired: true
    },
    {
      id: '2',
      title: "Science Fair",
      date: "2023-05-20",
      time: "09:00 - 17:00",
      location: "Science Building",
      description: "Annual science fair showcasing student projects from all departments.",
      organizer: "Science Department",
      category: "Exhibition",
      registrationRequired: false
    },
    {
      id: '3',
      title: "Parent-Teacher Conference",
      date: "2023-05-25",
      time: "16:30 - 19:30",
      location: "Multiple Classrooms",
      description: "Scheduled meetings between parents and teachers to discuss student progress.",
      organizer: "School Administration",
      category: "Meeting",
      registrationRequired: true
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-6">Educational Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;
