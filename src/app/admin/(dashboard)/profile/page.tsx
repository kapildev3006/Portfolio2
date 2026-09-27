
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
import { Camera, Upload, FileText, Eye, RefreshCw, Download, Loader2, Trash2 } from 'lucide-react';
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


const profileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  title: z.string().min(5, 'Title is too short'),
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
  const { portfolioData, loading: isLoading, refreshPortfolioData } = useContext(PortfolioDataContext);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      title: '',
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
      form.reset({
        name: portfolioData.hero?.name || '',
        title: portfolioData.hero?.title || '',
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
    const result = await saveProfileData(values);
    
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
                      <FormLabel>Title / Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Full Stack Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
