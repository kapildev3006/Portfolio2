
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, FileText, Eye, RefreshCw, Download, Loader2, Trash2, Plus, X, Sparkles, Clock, Palette, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import React, { useEffect, useContext } from 'react';
import { uploadImageToCloudinary, uploadResumeToCloudinary } from '@/actions/upload-actions';
import { saveProfileData } from '@/lib/firestore-actions';
import { useDropzone } from 'react-dropzone';
import { cn, downloadFile } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';
import { Switch } from '@/components/ui/switch';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';


const SOLID_PRESETS = [
  { name: 'Sky', hex: '#38bdf8' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'White', hex: '#ffffff' },
];

const GRADIENT_PRESETS = [
  { name: 'Cyan → Blue', value: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
  { name: 'Emerald → Teal', value: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  { name: 'Sunset Flame', value: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { name: 'Cosmic Violet', value: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
  { name: 'Neon Lime', value: 'linear-gradient(135deg, #a3e635, #10b981)' },
  { name: 'Electric Sky', value: 'linear-gradient(135deg, #38bdf8, #818cf8)' },
  { name: 'Gold Amber', value: 'linear-gradient(135deg, #fbbf24, #ea580c)' },
  { name: 'Rose Pink', value: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 50%, #f43f5e 100%)' },
];

const profileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  title: z.string().min(2, 'Title is too short'),
  titles: z.array(z.string()).optional(),
  titleInterval: z.coerce.number().min(0.5).max(30).optional(),
  titleColor: z.string().optional(),
  subtitle: z.string().min(10, 'Subtitle is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  resumeUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  resumeFileName: z.string().optional(),
  isResumeVisible: z.boolean().optional(),
  isImageVisible: z.boolean().optional(),
});


const ResumeUploader = ({ 
  onUpload, 
  onRemove,
  currentUrl, 
  currentFileName,
  onResolvedUrl,
}: { 
  onUpload: (url: string, fileName: string) => void; 
  onRemove?: () => void;
  currentUrl?: string;
  currentFileName?: string;
  onResolvedUrl?: (url: string, fileName: string) => void;
}) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const [showUploader, setShowUploader] = React.useState(!currentUrl);
    const { toast } = useToast();

    React.useEffect(() => {
      if (currentUrl) {
        setShowUploader(false);
      }
    }, [currentUrl]);

    const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Client-side validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: 'File Too Large',
          description: `Please select a PDF smaller than ${maxSize / 1024 / 1024}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          variant: 'destructive',
        });
        return;
      }

      if (file.type !== 'application/pdf') {
          toast({
              title: 'Invalid File Type',
              description: 'Please upload a PDF file only.',
              variant: 'destructive',
          });
          return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      // Pass the existing resume URL so the server action deletes the old Cloudinary asset
      if (currentUrl) formData.append('oldUrl', currentUrl);

      try {
        console.log('📄 Starting resume upload...');
        const result = await uploadResumeToCloudinary(formData);
        console.log('📥 Resume upload result:', result);

        if (result.success && result.fileUrl) {
            onUpload(result.fileUrl, result.originalFileName || 'resume.pdf');
            setShowUploader(false);
            toast({
                title: 'Success!',
                description: result.message,
            });
            console.log('✅ Resume URL set:', result.fileUrl);
            console.log('✅ Original filename:', result.originalFileName);
        } else {
            toast({
                title: 'Upload Failed',
                description: result.message,
                variant: 'destructive',
            });
            console.log('❌ Resume upload failed:', result.message);
        }
      } catch (error) {
        console.error('💥 Client error during resume upload:', error);
        toast({
            title: 'Network Error',
            description: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    }, [onUpload, toast]);

    const handleDownload = React.useCallback(async () => {
      if (currentUrl && currentFileName) {
        setIsUploading(true); // Reuse uploading state for download progress
        try {
          const result = await downloadFile(currentUrl, currentFileName);
          
          if (result.success) {
            toast({
              title: 'Download Started',
              description: `Downloading ${currentFileName}...`,
            });
          } else {
            toast({
              title: 'Download Failed',
              description: 'The resume file is no longer available on storage. Please upload a new resume.',
              variant: 'destructive',
            });
            setShowUploader(true);
          }
        } catch (error) {
          console.error('Download failed:', error);
          toast({
            title: 'Download Failed',
            description: 'Could not download the file. Please upload a new resume.',
            variant: 'destructive',
          });
          setShowUploader(true);
        } finally {
          setIsUploading(false);
        }
      }
    }, [currentUrl, currentFileName, toast]);
    
    /**
     * Fetches the PDF bytes via the server proxy (which always returns
     * Content-Type: application/pdf), then opens a blob: URL in a new tab.
     * Blob URLs are ALWAYS rendered inline by the browser's native PDF viewer
     * regardless of Content-Disposition or browser settings.
     */
    const handlePreview = React.useCallback(async () => {
      if (!currentUrl) return;
      setIsUploading(true);
      try {
        const proxyUrl = `/api/preview-pdf?url=${encodeURIComponent(currentUrl)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) {
          if (res.status === 404) {
            toast({
              title: 'Resume Not Found',
              description: 'The uploaded resume file could not be found on storage. Please upload your resume again.',
              variant: 'destructive',
            });
            setShowUploader(true);
            return;
          }
          throw new Error(`Failed to fetch PDF: ${res.statusText}`);
        }

        // If preview-pdf auto-resolved a dead link to the latest valid resume, sync it!
        const resolvedUrl = res.headers.get('x-resolved-url');
        if (resolvedUrl && resolvedUrl !== currentUrl && onResolvedUrl) {
          const newName = decodeURIComponent(resolvedUrl.split('/').pop() || 'resume.pdf');
          onResolvedUrl(resolvedUrl, newName);
        }

        const blob = await res.blob();
        // Force the blob type to application/pdf so the browser always treats it as PDF
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(pdfBlob);
        const tab = window.open(blobUrl, '_blank');
        // Revoke after 60s to free memory (the tab will have loaded by then)
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
        if (!tab) {
          toast({
            title: 'Popup Blocked',
            description: 'Please allow popups for this site to preview the resume.',
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        console.error('Preview failed:', error);
        toast({
          title: 'Preview Failed',
          description: error?.message || 'Could not load the PDF. Please try uploading your resume again.',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    }, [currentUrl, toast, onResolvedUrl]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      multiple: false,
      accept: { 'application/pdf': ['.pdf'] },
    });

    // Show current resume when available
    if (currentUrl && !showUploader && !isUploading) {
      return (
        <div className="space-y-4">
          {/* Current Resume Display */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-xl bg-card border-border/80 shadow-sm">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2.5 bg-primary/10 rounded-xl shrink-0 text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm sm:text-base text-foreground">Resume Uploaded</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate" title={currentFileName || 'resume.pdf'}>
                  {currentFileName || 'Your current resume is ready to view'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={handleDownload}
                disabled={isUploading}
                className="flex-1 sm:flex-initial h-9 text-xs sm:text-sm font-medium"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download
              </Button>
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={handlePreview}
                disabled={isUploading}
                className="flex-1 sm:flex-initial h-9 text-xs sm:text-sm font-medium"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                {isUploading ? 'Loading...' : 'Preview'}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={() => setShowUploader(true)}
                disabled={isUploading}
                className="flex-1 sm:flex-initial h-9 text-xs sm:text-sm font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Change
              </Button>
              {onRemove && (
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={onRemove}
                  disabled={isUploading}
                  className="flex-1 sm:flex-initial h-9 text-xs sm:text-sm font-medium text-destructive hover:text-destructive"
                  title="Remove resume"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Show uploader (either no current resume or user wants to change)
    return (
      <div className="space-y-4">
        {currentUrl && (
          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground gap-2">
            <span className="truncate">Uploading a new resume will replace the current one</span>
            <Button 
              type="button"
              variant="ghost" 
              size="sm"
              onClick={() => setShowUploader(false)}
              className="shrink-0"
            >
              Cancel
            </Button>
          </div>
        )}
        
        <div 
          {...getRootProps()} 
          className={cn(
            "flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed rounded-xl cursor-pointer text-muted-foreground transition-colors",
            isDragActive ? "border-primary bg-primary/10" : "border-input hover:border-primary/50"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-muted-foreground" />
          {isUploading ? (
            <div className="text-center">
              <p className="font-medium text-sm sm:text-base">Uploading...</p>
              <p className="text-xs mt-1 text-muted-foreground">Please wait while we upload your resume</p>
            </div>
          ) : isDragActive ? (
            <p className="font-medium text-sm sm:text-base text-primary">Drop the PDF file here...</p>
          ) : (
            <div className="text-center px-2">
              <p className="font-medium text-sm sm:text-base text-foreground">
                {currentUrl ? 'Upload New Resume' : 'Upload Your Resume'}
              </p>
              <p className="text-xs sm:text-sm mt-1 text-muted-foreground">Drag & drop your resume here, or click to browse</p>
            </div>
          )}
          <p className="text-[11px] sm:text-xs mt-2 px-3 py-1 bg-muted rounded-full">(PDF format only, max 10MB)</p>
        </div>
      </div>
    );
};

function ProfileFormSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your photo and personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Update your public contact details.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
      </Card>
      {/* Add other skeletons as needed */}
    </div>
  );
}


export default function AdminProfilePage() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = React.useState(false);
  const [newTitleInput, setNewTitleInput] = React.useState('');
  const [colorMode, setColorMode] = React.useState<'solid' | 'gradient'>('solid');
  const [gradientStart, setGradientStart] = React.useState('#06b6d4');
  const [gradientEnd, setGradientEnd] = React.useState('#3b82f6');
  const [gradientAngle, setGradientAngle] = React.useState('135deg');
  const { portfolioData, loading: isLoading, refreshPortfolioData } = useContext(PortfolioDataContext);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      title: '',
      titles: [],
      titleInterval: 3,
      titleColor: '',
      subtitle: '',
      email: '',
      phone: '',
      location: '',
      imageUrl: '',
      resumeUrl: '',
      linkedin: '',
      github: '',
      twitter: '',
      isResumeVisible: true,
      isImageVisible: true,
    },
  });

  useEffect(() => {
    if (portfolioData) {
      if (portfolioData.hero?.titleColor?.includes('gradient') || portfolioData.hero?.titleColor?.includes('linear-')) {
        setColorMode('gradient');
      } else {
        setColorMode('solid');
      }

      form.reset({
        name: portfolioData.hero?.name || '',
        title: portfolioData.hero?.title || '',
        titles: portfolioData.hero?.titles && portfolioData.hero.titles.length > 0
          ? portfolioData.hero.titles
          : (portfolioData.hero?.title ? [portfolioData.hero.title] : ['Full Stack Developer']),
        titleInterval: portfolioData.hero?.titleInterval ?? 3,
        titleColor: portfolioData.hero?.titleColor || '',
        subtitle: portfolioData.hero?.subtitle || '',
        imageUrl: portfolioData.hero?.imageUrl || '',
        resumeUrl: portfolioData.hero?.resumeUrl || '',
        resumeFileName: portfolioData.hero?.resumeFileName || '',
        email: portfolioData.contact?.email || '',
        phone: portfolioData.contact?.phone || '',
        location: portfolioData.contact?.location || '',
        linkedin: portfolioData.socials?.linkedin || '',
        github: portfolioData.socials?.github || '',
        twitter: portfolioData.socials?.twitter || '',
        isResumeVisible: portfolioData.hero?.isResumeVisible ?? true,
        isImageVisible: portfolioData.hero?.isImageVisible ?? true,
      });
    }
  }, [portfolioData, form]);


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Client-side file validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: 'File Too Large',
        description: `Please select an image smaller than ${maxSize / 1024 / 1024}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        variant: 'destructive',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select a valid image file (JPG, PNG, GIF, WebP).',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    // Pass the existing image URL so the server action can delete the old Cloudinary asset
    const currentImageUrl = form.getValues('imageUrl');
    if (currentImageUrl) formData.append('oldUrl', currentImageUrl);

    try {
      console.log('🚀 Starting image upload...');
      const result = await uploadImageToCloudinary(formData);
      console.log('📥 Upload result:', result);

      if (result.success && result.imageUrl) {
        form.setValue('imageUrl', result.imageUrl);
        toast({
          title: 'Success!',
          description: result.message,
        });
        console.log('✅ Image URL set:', result.imageUrl);
      } else {
        toast({
          title: 'Upload Failed',
          description: result.message,
          variant: 'destructive',
        });
        console.log('❌ Upload failed:', result.message);
      }
    } catch (error) {
      console.error('💥 Client error during upload:', error);
      toast({
        title: 'Network Error',
        description: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    let titles = values.titles && values.titles.length > 0 ? values.titles : [values.title];
    if (values.title && !titles.includes(values.title)) {
      titles = [values.title, ...titles];
    }
    const result = await saveProfileData({ ...values, titles });
    
    toast({
      title: result.success ? 'Profile Updated!' : 'Update Failed',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });

    if (result.success) {
      await refreshPortfolioData();
    }
  };
  
  if (isLoading) {
    return (
        <div className="flex-1 bg-background p-4 sm:p-6 lg:p-8 text-foreground max-w-5xl mx-auto w-full">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">My Profile</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your personal information and settings.</p>
          </div>
          <ProfileFormSkeleton />
        </div>
    );
  }


  return (
    <div className="flex-1 bg-background p-4 sm:p-6 lg:p-8 text-foreground max-w-5xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your personal information and settings.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your photo and personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={field.value} alt={form.getValues('name')} />
                          <AvatarFallback>
                            {form.getValues('name')?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="relative">
                           <Button type="button" variant="outline" disabled={isUploading}>
                            <Camera className="mr-2 h-4 w-4" />
                            {isUploading ? 'Uploading...' : 'Change Photo'}
                           </Button>
                           <Input 
                             type="file" 
                             accept="image/*"
                             className="absolute inset-0 cursor-pointer opacity-0" 
                             onChange={handleImageUpload}
                             disabled={isUploading}
                           />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isImageVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-6">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Profile Image Visibility</FormLabel>
                      <CardDescription className="text-[10px]">Show your profile image to visitors.</CardDescription>
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Title / Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Full Stack Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Rotating Sub-titles Manager */}
              <div className="space-y-3 rounded-lg border p-4 bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <FormLabel className="text-sm font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Rotating Sub-titles (Typewriter: Erase & Write)
                    </FormLabel>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Add multiple titles/roles. On the website, each title writes out, stays for your configured time, then erases and writes the next in a continuous loop.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 bg-muted rounded self-start sm:self-auto">
                    {form.watch('titles')?.length || 0} {(form.watch('titles')?.length || 0) === 1 ? 'title' : 'titles'}
                  </span>
                </div>

                {/* Badges / Chips list */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(form.watch('titles') || []).map((t, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium flex items-center gap-2 bg-background border border-border shadow-sm group hover:border-primary/50 transition-colors"
                    >
                      <span className="text-primary font-mono text-[11px] font-bold">#{idx + 1}</span>
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = form.getValues('titles') || [];
                          const updated = current.filter((_, i) => i !== idx);
                          form.setValue('titles', updated, { shouldDirty: true });
                          if (updated.length > 0 && form.getValues('title') === t) {
                            form.setValue('title', updated[0], { shouldDirty: true });
                          }
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-1 p-0.5 rounded-full hover:bg-destructive/10"
                        title="Remove title"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))}
                  {(!form.watch('titles') || form.watch('titles')?.length === 0) && (
                    <p className="text-xs text-muted-foreground italic">No rotating titles added yet. Add your titles below!</p>
                  )}
                </div>

                {/* Add new title input */}
                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="e.g., Next.js Specialist, UI/UX Designer..."
                    value={newTitleInput}
                    onChange={(e) => setNewTitleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = newTitleInput.trim();
                        if (!val) return;
                        const current = form.getValues('titles') || [];
                        if (current.includes(val)) {
                          toast({ title: 'Already exists', description: 'This title is already in your rotation list.' });
                          return;
                        }
                        const updated = [...current, val];
                        form.setValue('titles', updated, { shouldDirty: true });
                        if (!form.getValues('title')) {
                          form.setValue('title', val, { shouldDirty: true });
                        }
                        setNewTitleInput('');
                      }
                    }}
                    className="h-9 text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 h-9 px-3 gap-1"
                    onClick={() => {
                      const val = newTitleInput.trim();
                      if (!val) return;
                      const current = form.getValues('titles') || [];
                      if (current.includes(val)) {
                        toast({ title: 'Already exists', description: 'This title is already in your rotation list.' });
                        return;
                      }
                      const updated = [...current, val];
                      form.setValue('titles', updated, { shouldDirty: true });
                      if (!form.getValues('title')) {
                        form.setValue('title', val, { shouldDirty: true });
                      }
                      setNewTitleInput('');
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </Button>
                </div>

                {/* Motion Settings: Interval & Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border/60">
                  {/* Display Duration */}
                  <div className="space-y-2 p-3 rounded-lg border border-border/50 bg-background/60">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium flex items-center gap-1.5 text-foreground">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        Rotation Interval
                      </label>
                      <Badge variant="outline" className="font-mono text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/30">
                        {form.watch('titleInterval') ?? 3}s
                      </Badge>
                    </div>

                    <div className="pt-2 pb-1">
                      <Slider
                        value={[form.watch('titleInterval') ?? 3]}
                        min={1}
                        max={15}
                        step={0.5}
                        onValueChange={([val]) => form.setValue('titleInterval', val, { shouldDirty: true })}
                        className="w-full cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Fast (1s)</span>
                      <span>Default (3s)</span>
                      <span>Slow (15s)</span>
                    </div>

                    {/* Quick Interval Preset Pills */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-muted-foreground">Presets:</span>
                      {[1.5, 2, 3, 5, 8].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => form.setValue('titleInterval', sec, { shouldDirty: true })}
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded border transition-colors",
                            (form.watch('titleInterval') ?? 3) === sec
                              ? "bg-primary text-primary-foreground border-primary font-bold"
                              : "bg-muted/50 hover:bg-muted border-border/80 text-muted-foreground"
                          )}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title Text Color & Gradient */}
                  <div className="space-y-3 p-3 rounded-lg border border-border/50 bg-background/60">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium flex items-center gap-1.5 text-foreground">
                        <Palette className="w-3.5 h-3.5 text-primary" />
                        Subtitle Color & Gradient
                      </label>

                      {/* Mode Toggle: Solid vs Gradient */}
                      <div className="flex items-center gap-0.5 p-0.5 bg-muted rounded-md border border-border/60">
                        <button
                          type="button"
                          onClick={() => {
                            setColorMode('solid');
                            if (form.getValues('titleColor')?.includes('gradient')) {
                              form.setValue('titleColor', '#10b981', { shouldDirty: true });
                            }
                          }}
                          className={cn(
                            "px-2 py-0.5 text-[11px] rounded font-medium transition-all",
                            colorMode === 'solid'
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Solid
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setColorMode('gradient');
                            if (!form.getValues('titleColor')?.includes('gradient')) {
                              form.setValue('titleColor', `linear-gradient(${gradientAngle}, ${gradientStart}, ${gradientEnd})`, { shouldDirty: true });
                            }
                          }}
                          className={cn(
                            "px-2 py-0.5 text-[11px] rounded font-medium transition-all",
                            colorMode === 'gradient'
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Gradient
                        </button>
                      </div>
                    </div>

                    {/* SOLID COLOR CONTROLS */}
                    {colorMode === 'solid' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 pt-1">
                          <div className="relative shrink-0">
                            <input
                              type="color"
                              value={form.watch('titleColor')?.startsWith('#') ? form.watch('titleColor') : '#10b981'}
                              onChange={(e) => form.setValue('titleColor', e.target.value, { shouldDirty: true })}
                              className="w-9 h-9 p-0.5 rounded-lg border border-border bg-background cursor-pointer"
                              title="Pick custom color"
                            />
                          </div>
                          <Input
                            placeholder="#10b981 or default"
                            value={form.watch('titleColor') || ''}
                            onChange={(e) => form.setValue('titleColor', e.target.value, { shouldDirty: true })}
                            className="h-9 text-xs font-mono"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0 gap-1"
                            onClick={() => form.setValue('titleColor', '', { shouldDirty: true })}
                            title="Reset to default theme color"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Reset
                          </Button>
                        </div>

                        {/* Preset Colors Palette */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-muted-foreground">Palettes:</span>
                          {SOLID_PRESETS.map((preset) => (
                            <button
                              key={preset.hex}
                              type="button"
                              onClick={() => form.setValue('titleColor', preset.hex, { shouldDirty: true })}
                              className={cn(
                                "w-5 h-5 rounded-full border transition-all flex items-center justify-center hover:scale-110",
                                form.watch('titleColor')?.toLowerCase() === preset.hex.toLowerCase()
                                  ? "ring-2 ring-primary ring-offset-1 border-white"
                                  : "border-border/60 hover:border-foreground/50"
                              )}
                              style={{ backgroundColor: preset.hex }}
                              title={preset.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* GRADIENT CONTROLS */}
                    {colorMode === 'gradient' && (
                      <div className="space-y-2.5">
                        {/* 2-Stop Color Picker + Angle Selector */}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              type="color"
                              value={gradientStart}
                              onChange={(e) => {
                                const newStart = e.target.value;
                                setGradientStart(newStart);
                                form.setValue('titleColor', `linear-gradient(${gradientAngle}, ${newStart}, ${gradientEnd})`, { shouldDirty: true });
                              }}
                              className="w-8 h-8 p-0.5 rounded-lg border border-border bg-background cursor-pointer"
                              title="Start Color"
                            />
                            <span className="text-xs text-muted-foreground font-mono">→</span>
                            <input
                              type="color"
                              value={gradientEnd}
                              onChange={(e) => {
                                const newEnd = e.target.value;
                                setGradientEnd(newEnd);
                                form.setValue('titleColor', `linear-gradient(${gradientAngle}, ${gradientStart}, ${newEnd})`, { shouldDirty: true });
                              }}
                              className="w-8 h-8 p-0.5 rounded-lg border border-border bg-background cursor-pointer"
                              title="End Color"
                            />
                          </div>

                          {/* Direction angles */}
                          <div className="flex items-center gap-1">
                            {[
                              { label: '→', angle: 'to right', title: 'Left to Right' },
                              { label: '↘', angle: '135deg', title: 'Diagonal' },
                              { label: '↓', angle: 'to bottom', title: 'Top to Bottom' },
                            ].map((dir) => (
                              <button
                                key={dir.angle}
                                type="button"
                                onClick={() => {
                                  setGradientAngle(dir.angle);
                                  form.setValue('titleColor', `linear-gradient(${dir.angle}, ${gradientStart}, ${gradientEnd})`, { shouldDirty: true });
                                }}
                                className={cn(
                                  "w-7 h-7 text-xs rounded border flex items-center justify-center transition-colors",
                                  gradientAngle === dir.angle
                                    ? "bg-primary text-primary-foreground border-primary font-bold"
                                    : "bg-muted/40 hover:bg-muted border-border/80 text-muted-foreground"
                                )}
                                title={dir.title}
                              >
                                {dir.label}
                              </button>
                            ))}
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0 gap-1 ml-auto"
                            onClick={() => form.setValue('titleColor', '', { shouldDirty: true })}
                            title="Reset to default theme color"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Reset
                          </Button>
                        </div>

                        {/* Preset Gradients (9 modern gradients) */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground">Preset Gradients:</span>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {GRADIENT_PRESETS.map((preset) => {
                              const isSelected = form.watch('titleColor') === preset.value;
                              return (
                                <button
                                  key={preset.name}
                                  type="button"
                                  onClick={() => form.setValue('titleColor', preset.value, { shouldDirty: true })}
                                  className={cn(
                                    "px-2.5 py-1 text-[11px] rounded-full font-medium transition-all shadow-sm text-white",
                                    isSelected
                                      ? "ring-2 ring-primary ring-offset-2 scale-105"
                                      : "hover:scale-105 opacity-90 hover:opacity-100"
                                  )}
                                  style={{ backgroundImage: preset.value }}
                                  title={preset.value}
                                >
                                  {preset.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Live Preview Text */}
                    <div className="pt-2 border-t border-border/40 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-muted-foreground text-[11px] shrink-0">Preview:</span>
                        <span
                          className="font-bold tracking-tight text-sm transition-all truncate"
                          style={
                            form.watch('titleColor')?.includes('gradient') || form.watch('titleColor')?.includes('linear-')
                              ? {
                                  backgroundImage: form.watch('titleColor'),
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text',
                                  display: 'inline-block',
                                }
                              : {
                                  color: form.watch('titleColor') || undefined,
                                }
                          }
                        >
                          {form.watch('titles')?.[0] || form.watch('title') || 'Full Stack Developer'}
                        </span>
                      </div>

                      {form.watch('titleColor') ? (
                        <span
                          className="w-4 h-4 rounded-full border border-border shadow-inner shrink-0 ml-2"
                          style={
                            form.watch('titleColor')?.includes('gradient') || form.watch('titleColor')?.includes('linear-')
                              ? { backgroundImage: form.watch('titleColor') }
                              : { backgroundColor: form.watch('titleColor') }
                          }
                        />
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic shrink-0 ml-2">Theme Default</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio / Subtitle</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A short bio about yourself..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>
          
          <Card className="mt-6 sm:mt-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your public contact details.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>

          <Card className="mt-6 sm:mt-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Resume / CV</CardTitle>
              <CardDescription>Upload and manage your resume.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
                <FormField
                  control={form.control}
                  name="resumeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                         <ResumeUploader 
                            onUpload={async (url, fileName) => {
                              field.onChange(url);
                              form.setValue('resumeFileName', fileName);
                              try {
                                await setDoc(doc(db, 'portfolio', 'main'), {
                                  hero: {
                                    resumeUrl: url,
                                    resumeFileName: fileName,
                                  }
                                }, { merge: true });
                                if (refreshPortfolioData) await refreshPortfolioData();
                                toast({
                                  title: 'Resume Saved!',
                                  description: 'Your resume has been uploaded and saved to your profile.',
                                });
                              } catch (err) {
                                console.error('Failed to auto-save resume:', err);
                              }
                            }}
                            onRemove={async () => {
                              field.onChange('');
                              form.setValue('resumeFileName', '');
                              try {
                                await setDoc(doc(db, 'portfolio', 'main'), {
                                  hero: {
                                    resumeUrl: '',
                                    resumeFileName: '',
                                  }
                                }, { merge: true });
                                if (refreshPortfolioData) await refreshPortfolioData();
                                toast({
                                  title: 'Resume Removed',
                                  description: 'Your resume has been removed from your profile.',
                                });
                              } catch (err) {
                                console.error('Failed to remove resume:', err);
                              }
                            }}
                            onResolvedUrl={async (url, fileName) => {
                              field.onChange(url);
                              form.setValue('resumeFileName', fileName);
                              try {
                                await setDoc(doc(db, 'portfolio', 'main'), {
                                  hero: {
                                    resumeUrl: url,
                                    resumeFileName: fileName,
                                  }
                                }, { merge: true });
                                if (refreshPortfolioData) await refreshPortfolioData();
                              } catch (err) {
                                console.error('Failed to sync resolved resume URL:', err);
                              }
                            }}
                            currentUrl={field.value}
                            currentFileName={form.watch('resumeFileName')}
                         />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isResumeVisible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Resume Visibility</FormLabel>
                        <CardDescription className="text-[10px]">Show "Download Resume" button to visitors.</CardDescription>
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
            </CardContent>
          </Card>

          <Card className="mt-6 sm:mt-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Social Profiles</CardTitle>
              <CardDescription>Link your social media accounts.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                 <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter / X</FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
            <CardFooter className="border-t p-4 sm:p-6 flex justify-end">
              <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
