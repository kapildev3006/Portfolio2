
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, Upload, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/actions/server-actions';
import { saveProjectData, updateProjectData } from '@/lib/firestore-actions';
import Image from 'next/image';
import type { Project as ProjectType } from '@/hooks/use-projects';

const projectFormSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  techstack: z.string().min(1, { message: 'Please add at least one technology.' }),
  liveUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  sourceUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  imageUrl: z.string().url({ message: 'Please upload an image.' }).min(1, 'Please upload an image.'),
});

const ImageUploader = ({ onUpload, currentUrl }: { onUpload: (url: string) => void; currentUrl?: string }) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const { toast } = useToast();

    const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      try {
        const result = await uploadImage(formData);

        if (result.success && result.imageUrl) {
            onUpload(result.imageUrl);
            toast({
                title: 'Image Uploaded!',
                description: 'The project image has been successfully uploaded.',
            });
        } else {
            toast({
                title: 'Upload Failed',
                description: result.message,
                variant: 'destructive',
            });
        }
      } catch (error) {
        toast({
            title: 'Upload Failed',
            description: 'An unexpected error occurred.',
            variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    }, [onUpload, toast]);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      multiple: false,
      accept: { 'image/*': ['.jpeg', '.png', '.gif', '.jpg'] },
    });

    return (
        <div 
            {...getRootProps()} 
            className={cn(
            "relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer text-muted-foreground h-52",
            isDragActive ? "border-primary bg-primary/10" : "border-input"
            )}
        >
            <input {...getInputProps()} />

            {currentUrl && !isUploading ? (
                 <Image src={currentUrl} alt="Project image preview" fill className="object-cover rounded-lg" />
            ) : (
                <>
                    {isUploading ? (
                      <Loader2 className="w-10 h-10 mb-2 animate-spin" />
                    ) : (
                      <Upload className="w-10 h-10 mb-2" />
                    )}

                    {isUploading ? (
                      <p>Uploading...</p>
                    ) : isDragActive ? (
                      <p>Drop the image here...</p>
                    ) : (
                      <p>Drag 'n' drop an image, or click to select</p>
                    )}
                </>
            )}
        </div>
    );
};


export default function ProjectForm({ project, onClose }: { project?: ProjectType; onClose?: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!project;

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      description: '',
      techstack: '',
      liveUrl: '',
      sourceUrl: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (isEditMode && project) {
      form.reset({
        title: project.title,
        description: project.description,
        techstack: project.tags.join(', '),
        liveUrl: project.liveUrl,
        sourceUrl: project.sourceUrl,
        imageUrl: project.imageUrl,
      });
    }
  }, [isEditMode, project, form]);

  const onSubmit = async (values: z.infer<typeof projectFormSchema>) => {
    setIsSubmitting(true);
    
    let result;
    if (isEditMode && project) {
      result = await updateProjectData(project.id, values);
    } else {
      result = await saveProjectData(values);
    }

    setIsSubmitting(false);

    toast({
      title: result.success ? 'Success!' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });

    if (result.success) {
      form.reset();
      onClose?.();
    }
  };


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Project Zenith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the project." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="techstack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tech Stack (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., React, Next.js, Tailwind" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Project Image</FormLabel>
                <FormControl>
                    <ImageUploader 
                        onUpload={(url) => field.onChange(url)}
                        currentUrl={field.value}
                    />
                </FormControl>
                 <Input type="hidden" {...field} />
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="liveUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://project.live" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sourceUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/user/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
            isEditMode ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />
          }
          {isEditMode ? 'Update Project' : 'Add Project'}
        </Button>
      </form>
    </Form>
  );
}
