
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
import { staticData } from '@/lib/portfolio-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, FileUp, Upload } from 'lucide-react';
import React, { useEffect } from 'react';
import { uploadImage, uploadFile, saveProfileData } from '@/actions/server-actions';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

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
});

const ResumeUploader = ({ onUpload, currentUrl }: { onUpload: (url: string) => void; currentUrl?: string }) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const { toast } = useToast();

    const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
          toast({
              title: 'Invalid File Type',
              description: 'Please upload a PDF file.',
              variant: 'destructive',
          });
          return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadFile(formData);

      if (result.success && result.fileUrl) {
          onUpload(result.fileUrl);
          toast({
              title: 'Resume Uploaded!',
              description: 'Your resume has been successfully updated.',
          });
      } else {
          toast({
              title: 'Upload Failed',
              description: result.message,
              variant: 'destructive',
          });
      }
      setIsUploading(false);
    }, [onUpload, toast]);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      multiple: false,
      accept: { 'application/pdf': ['.pdf'] },
    });

    return (
      <div 
        {...getRootProps()} 
        className={cn(
          "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer text-muted-foreground",
          isDragActive ? "border-primary bg-primary/10" : "border-input"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mb-2" />
        {isUploading ? (
          <p>Uploading...</p>
        ) : isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drag 'n' drop your resume here, or click to select a file</p>
        )}
        <p className="text-xs mt-1">(PDF format only)</p>
        {currentUrl && !isUploading && (
            <Button asChild variant="link" className="mt-2" onClick={(e) => e.stopPropagation()}>
                <a href={currentUrl} target="_blank" rel="noopener noreferrer">View Current Resume</a>
            </Button>
        )}
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
  const router = useRouter();
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

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
    },
  });

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const docRef = doc(db, 'portfolio', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          form.reset({
            name: data.hero?.name || '',
            title: data.hero?.title || '',
            subtitle: data.hero?.subtitle || '',
            imageUrl: data.hero?.imageUrl || '',
            resumeUrl: data.hero?.resumeUrl || '',
            email: data.contact?.email || '',
            phone: data.contact?.phone || '',
            location: data.contact?.location || '',
            linkedin: data.socials?.linkedin || '',
            github: data.socials?.github || '',
            twitter: data.socials?.twitter || '',
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: 'Error',
          description: 'Could not fetch profile data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfileData();
  }, [form, toast]);


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    const result = await uploadImage(formData);

    if (result.success && result.imageUrl) {
      form.setValue('imageUrl', result.imageUrl);
      toast({
        title: 'Image Uploaded!',
        description: 'Your profile picture has been updated.',
      });
      router.refresh();
    } else {
      toast({
        title: 'Upload Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsUploading(false);
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    const result = await saveProfileData(values);
    
    toast({
      title: result.success ? 'Profile Updated!' : 'Update Failed',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
  };
  
  if (isLoading) {
    return (
        <div className="flex-1 bg-background p-8 text-foreground">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and settings.</p>
          </div>
          <ProfileFormSkeleton />
        </div>
    );
  }


  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and settings.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your photo and personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
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
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your public contact details.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

           <Card className="mt-8">
            <CardHeader>
              <CardTitle>Resume / CV</CardTitle>
              <CardDescription>Upload and manage your resume.</CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                  control={form.control}
                  name="resumeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                         <ResumeUploader 
                            onUpload={(url) => field.onChange(url)}
                            currentUrl={field.value}
                         />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>

          <Card className="mt-8">
             <CardHeader>
              <CardTitle>Social Profiles</CardTitle>
              <CardDescription>Link your social media accounts.</CardDescription>
            </Header>
            <CardContent className="space-y-4">
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
             <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
