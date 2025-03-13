
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import EventCard from '../components/EventCard';

const Events = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-6">Educational Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* These would typically come from an API */}
            <EventCard 
              title="End of Year Exam Preparation" 
              date="2023-06-15"
              time="14:00 - 16:00"
              location="Main Auditorium"
              description="Preparation session for final exams covering key topics and exam techniques."
            />
            <EventCard 
              title="Science Fair" 
              date="2023-05-20"
              time="09:00 - 17:00"
              location="Science Building"
              description="Annual science fair showcasing student projects from all departments."
            />
            <EventCard 
              title="Parent-Teacher Conference" 
              date="2023-05-25"
              time="16:30 - 19:30"
              location="Multiple Classrooms"
              description="Scheduled meetings between parents and teachers to discuss student progress."
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;
