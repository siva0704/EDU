
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

interface DownloadableResource {
  id: string;
  title: string;
  type: string;
  url: string;
}

export const useDownloadUtils = () => {
  const { role } = useAuth();
  
  const downloadSingleResource = async (resource: DownloadableResource) => {
    try {
      // In a real app, this would fetch the actual file
      const response = await fetch(resource.url);
      const blob = await response.blob();
      
      // Create a temporary anchor to trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${resource.title}.${getFileExtension(resource.type)}`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: `${resource.title} is being downloaded.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: `Failed to download ${resource.title}.`,
        variant: "destructive",
      });
    }
  };
  
  const downloadAllResources = async (resources: DownloadableResource[], sessionName: string) => {
    if (resources.length === 0) {
      toast({
        title: "No resources to download",
        description: "There are no resources available for download.",
      });
      return;
    }
    
    try {
      toast({
        title: "Preparing download",
        description: "Preparing all resources for download...",
      });
      
      // In a real app, this would bundle files into a ZIP
      // For now, let's simulate a delay and then show success
      setTimeout(() => {
        toast({
          title: "Download started",
          description: `All resources for ${sessionName} are being downloaded as a ZIP file.`,
        });
      }, 1500);
    } catch (error) {
      console.error('Download all error:', error);
      toast({
        title: "Download failed",
        description: "Failed to download all resources.",
        variant: "destructive",
      });
    }
  };
  
  // Helper function to get file extension based on resource type
  const getFileExtension = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'video':
        return 'mp4';
      case 'document':
      case 'lesson':
        return 'pdf';
      case 'attendance':
        return 'xlsx';
      case 'event':
        return 'ics';
      default:
        return 'txt';
    }
  };
  
  // Check if user has download permissions based on role
  const canDownload = (): boolean => {
    return ['admin', 'teacher', 'student'].includes(role as string);
  };
  
  return {
    downloadSingleResource,
    downloadAllResources,
    canDownload,
  };
};
