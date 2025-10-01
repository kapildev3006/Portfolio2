
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Plus, Upload, Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { uploadImage, saveProjectData } from '@/actions/server-actions';
import Image from 'next/image';
import { useActionState } from 'react';

const formSchema = z.object({
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


export default function AddProjectForm({ onClose }: { onClose?: () => void }) {
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(saveProjectData, {
    message: '',
    success: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    if (state.message) {
        toast({
            title: state.success ? 'Success!' : 'Error',
            description: state.message,
            variant: state.success ? 'default' : 'destructive',
        });
        if (state.success) {
            form.reset();
            onClose?.();
        }
    }
  }, [state, toast, form, onClose]);


  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Add Project
        </Button>
      </form>
    </Form>
  );
}
