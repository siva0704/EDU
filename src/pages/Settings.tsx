
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const Settings = () => {
  const { role } = useAuth();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-6">Settings</h2>
          
          {role !== 'admin' ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Access Restricted</AlertTitle>
              <AlertDescription>
                Only administrators can access settings. Please contact your administrator for assistance.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white dark:bg-black/40 rounded-xl border p-6">
                <h3 className="text-lg font-medium mb-4">System Settings</h3>
                <p className="text-muted-foreground">
                  Administrative settings for the EDU Hub Connector platform. Settings panel is currently under development.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
