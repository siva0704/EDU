
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Save, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const settingsFormSchema = z.object({
  siteName: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  siteDescription: z.string().optional(),
  supportEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  maxFileSize: z.coerce.number().positive({
    message: "File size must be a positive number.",
  }),
  allowRegistration: z.boolean().default(true),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

const Settings = () => {
  const { role } = useAuth();
  
  const defaultValues: Partial<SettingsFormValues> = {
    siteName: "EDU Hub Connector",
    siteDescription: "A platform connecting educational resources for administrators, teachers, and students.",
    supportEmail: "support@eduhub.example.com",
    maxFileSize: 50,
    allowRegistration: true,
  }

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  })

  function onSubmit(data: SettingsFormValues) {
    toast({
      title: "Settings updated",
      description: "Your settings have been saved successfully.",
    })
    console.log(data)
  }
  
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
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="siteName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site Name</FormLabel>
                            <FormControl>
                              <Input placeholder="EDU Hub Connector" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your platform's name visible to all users.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="supportEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Support Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="support@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              All support requests will be sent to this email.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="siteDescription"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Site Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Description of your educational platform." 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              This appears on the landing page and in search results.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="maxFileSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Upload Size (MB)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Maximum file size for uploads in megabytes.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
              
              <div className="bg-white dark:bg-black/40 rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="allowRegistration">User Registration</Label>
                    <div className="flex items-center justify-between mt-2">
                      <FormDescription>
                        Allow new user registrations
                      </FormDescription>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Registration disabled",
                              description: "New user registrations are now disabled."
                            })
                          }}
                        >
                          Disable
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-primary/10 text-primary"
                          onClick={() => {
                            toast({
                              title: "Registration enabled",
                              description: "New user registrations are now enabled."
                            })
                          }}
                        >
                          Enable
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <div className="flex items-center justify-between mt-2">
                      <FormDescription>
                        Inactive session timeout duration
                      </FormDescription>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Setting updated",
                              description: "Session timeout set to 30 minutes."
                            })
                          }}
                        >
                          30 min
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-primary/10 text-primary"
                          onClick={() => {
                            toast({
                              title: "Setting updated",
                              description: "Session timeout set to 60 minutes."
                            })
                          }}
                        >
                          60 min
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
