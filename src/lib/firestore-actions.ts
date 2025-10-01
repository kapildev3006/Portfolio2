
'use client';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, setDoc, addDoc, collection, Timestamp } from 'firebase/firestore';

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


export async function saveProfileData(data: z.infer<typeof profileSchema>) {
    try {
        const validatedData = profileSchema.parse(data);
        
        const portfolioDocRef = doc(db, 'portfolio/main');

        const dataToSave = {
            hero: {
                name: validatedData.name,
                title: validatedData.title,
                subtitle: validatedData.subtitle,
                imageUrl: validatedData.imageUrl,
                resumeUrl: validatedData.resumeUrl,
            },
            contact: {
                email: validatedData.email,
                phone: validatedData.phone,
                location: validatedData.location,
            },
            socials: {
                linkedin: validatedData.linkedin,
                github: validatedData.github,
                twitter: validatedData.twitter,
            }
        };

        await setDoc(portfolioDocRef, dataToSave, { merge: true });

        return {
            success: true,
            message: 'Profile updated successfully!',
        };
    } catch (error) {
        console.error("Error saving profile data: ", error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed: ' + error.errors.map(e => e.message).join(', '),
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred while saving your profile.',
        };
    }
}

const projectFormSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  techstack: z.string().min(1, { message: 'Please add at least one technology.' }),
  liveUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  sourceUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  imageUrl: z.string().url({ message: 'Please upload an image.' }).min(1, 'Please upload an image.'),
});


export async function saveProjectData(data: z.infer<typeof projectFormSchema>) {
  try {
    const validatedData = projectFormSchema.parse(data);

    const dataToSave = {
      ...validatedData,
      tags: validatedData.techstack.split(',').map(tag => tag.trim()),
      createdAt: Timestamp.now(),
    };
    
    // Remove techstack as we've converted it to tags
    delete (dataToSave as any).techstack;

    await addDoc(collection(db, 'projects'), dataToSave);
    
    return {
      message: `Project "${validatedData.title}" has been successfully created.`,
      success: true,
    };

  } catch (error) {
    console.error("Error saving project data: ", error);
     if (error instanceof z.ZodError) {
        return {
            success: false,
            message: 'Validation failed: ' + error.errors.map(e => e.message).join(', '),
        };
    }
    return {
      message: 'An unexpected error occurred while saving the project.',
      success: false,
    };
  }
}
