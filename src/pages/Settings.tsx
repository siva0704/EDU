
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, Save, Lock, User, Bell, Shield, 
  Globe, Smartphone, Moon, Sun, PanelLeft, Upload, 
  Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const systemSettingsFormSchema = z.object({
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
});

const userSettingsFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160).optional(),
  notifications: z.boolean().default(true),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  twoFactorAuth: z.boolean().default(false),
});

type SystemSettingsFormValues = z.infer<typeof systemSettingsFormSchema>;
type UserSettingsFormValues = z.infer<typeof userSettingsFormSchema>;

const Settings = () => {
  const { user, role } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const systemForm = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(systemSettingsFormSchema),
    defaultValues: {
      siteName: "EDU Hub Connector",
      siteDescription: "A platform connecting educational resources for administrators, teachers, and students.",
      supportEmail: "support@eduhub.example.com",
      maxFileSize: 50,
      allowRegistration: true,
    }
  });

  const userForm = useForm<UserSettingsFormValues>({
    resolver: zodResolver(userSettingsFormSchema),
    defaultValues: {
      displayName: user?.name || "",
      email: user?.email || "",
      bio: "",
      notifications: true,
      theme: "system",
      twoFactorAuth: false,
    }
  });

  function onSystemSubmit(data: SystemSettingsFormValues) {
    toast({
      title: "System settings updated",
      description: "Your system settings have been saved successfully.",
    });
    console.log(data);
  }

  function onUserSubmit(data: UserSettingsFormValues) {
    toast({
      title: "Profile settings updated",
      description: "Your profile settings have been saved successfully.",
    });
    console.log(data);
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            {role === 'admin' && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                Admin Mode
              </div>
            )}
          </div>
          
          {role !== 'admin' ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Access Restricted</AlertTitle>
              <AlertDescription>
                Only administrators can access system settings. You can view and edit your profile settings below.
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs defaultValue="system" className="space-y-4">
              <TabsList>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="system" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>
                      Configure system-wide settings for the EDU Hub platform.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Form {...systemForm}>
                      <form onSubmit={systemForm.handleSubmit(onSystemSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={systemForm.control}
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
                            control={systemForm.control}
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
                            control={systemForm.control}
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
                            control={systemForm.control}
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
                          
                          <FormField
                            control={systemForm.control}
                            name="allowRegistration"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    User Registration
                                  </FormLabel>
                                  <FormDescription>
                                    Allow new users to register on the platform.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
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
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-4">
                <ProfileSettings user={user} userForm={userForm} onUserSubmit={onUserSubmit} />
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <SecuritySettings />
              </TabsContent>
            </Tabs>
          )}
          
          {role !== 'admin' && user && (
            <div className="mt-6">
              <ProfileSettings user={user} userForm={userForm} onUserSubmit={onUserSubmit} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Extracted into a separate component for reusability
const ProfileSettings = ({ 
  user, 
  userForm, 
  onUserSubmit 
}: { 
  user: any, 
  userForm: any,
  onUserSubmit: (data: UserSettingsFormValues) => void 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleAvatarUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Avatar updated",
        description: "Your profile image has been updated successfully.",
      });
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your personal information and preferences.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={handleAvatarUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Change Avatar
                </>
              )}
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">{user?.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
              <div>
                <span className="text-muted-foreground">Department:</span>
                <p>{user?.department || "Not specified"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Position:</span>
                <p>{user?.position || "Not specified"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Login:</span>
                <p>{user?.lastLogin || "Never"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p>{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <Form {...userForm}>
          <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={userForm.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your contact email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us a little about yourself" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Brief description visible on your profile. Max 160 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Notifications
                      </FormLabel>
                      <FormDescription>
                        Receive email notifications for important updates.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme Preference</FormLabel>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={field.value === 'light' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => field.onChange('light')}
                      >
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </Button>
                      
                      <Button
                        type="button"
                        variant={field.value === 'dark' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => field.onChange('dark')}
                      >
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </Button>
                      
                      <Button
                        type="button"
                        variant={field.value === 'system' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => field.onChange('system')}
                      >
                        <PanelLeft className="h-4 w-4 mr-2" />
                        System
                      </Button>
                    </div>
                    <FormDescription>
                      Choose how the application appears to you.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const SecuritySettings = () => {
  const [sessionLength, setSessionLength] = useState(60);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully."
    });
    setPassword("");
    setConfirmPassword("");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security and authentication options.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPasswords ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              
              <Button type="submit">Update Password</Button>
            </form>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              <Switch id="2fa" onCheckedChange={(checked) => {
                toast({
                  title: checked ? "2FA Enabled" : "2FA Disabled",
                  description: checked ? "Two-factor authentication has been enabled." : "Two-factor authentication has been disabled."
                });
              }} />
            </div>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account by requiring a verification code in addition to your password.
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Session Management</h3>
            <div className="flex items-center justify-between">
              <Label>Session Timeout (minutes)</Label>
              <div className="flex items-center space-x-2">
                {[30, 60, 120].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={sessionLength === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSessionLength(value);
                      toast({
                        title: "Setting updated",
                        description: `Session timeout set to ${value} minutes.`
                      });
                    }}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              You will be automatically logged out after this period of inactivity.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
