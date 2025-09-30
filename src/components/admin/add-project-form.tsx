
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Camera, Plus, Upload } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/actions/server-actions';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  tags: z.string().min(1, { message: 'Please add at least one tag.' }),
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
                    <Upload className="w-10 h-10 mb-2" />
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


export default function AddProjectForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      liveUrl: '',
      sourceUrl: '',
      imageUrl: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically handle form submission, e.g., send data to an API
    console.log(values);
    toast({
      title: 'Project Added!',
      description: `Project "${values.title}" has been successfully created.`,
    });
    // You might want to close the dialog here
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma-separated)</FormLabel>
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

        <Button type="submit" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </form>
    </Form>
  );
}
