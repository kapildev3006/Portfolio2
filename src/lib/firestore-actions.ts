
'use client';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, setDoc, addDoc, collection, Timestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { SkillCategory, Experience, Achievement } from '@/lib/types';

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

        setDoc(portfolioDocRef, dataToSave, { merge: true }).catch((serverError) => {
          const permissionError = new FirestorePermissionError({
            path: portfolioDocRef.path,
            operation: 'update',
            requestResourceData: dataToSave,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

        return {
            success: true,
            message: 'Profile updated successfully!',
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed: ' + error.errors.map(e => e.message).join(', '),
            };
        }
        console.error("Error saving profile data: ", error);
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


export async function saveProjectData(data: z.infer<typeof projectFormSchema>): Promise<{success: boolean, message: string}> {
  try {
    const validatedData = projectFormSchema.parse(data);

    const dataToSave = {
      ...validatedData,
      tags: validatedData.techstack.split(',').map(tag => tag.trim()),
      createdAt: Timestamp.now(),
    };
    
    delete (dataToSave as any).techstack;

    const collectionRef = collection(db, 'projects');
    
    addDoc(collectionRef, dataToSave)
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: dataToSave,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    return {
      message: `Project "${validatedData.title}" has been successfully created.`,
      success: true,
    };

  } catch (error) {
     if (error instanceof z.ZodError) {
        return {
            success: false,
            message: 'Validation failed: ' + error.errors.map(e => e.message).join(', '),
        };
    }
    console.error("Error saving project data: ", error);
    return {
      message: 'An unexpected error occurred while saving the project.',
      success: false,
    };
  }
}

export async function updateProjectData(id: string, data: z.infer<typeof projectFormSchema>): Promise<{success: boolean, message: string}> {
  try {
    const validatedData = projectFormSchema.parse(data);
    
    const dataToUpdate = {
      ...validatedData,
      tags: validatedData.techstack.split(',').map(tag => tag.trim()),
    };
    delete (dataToUpdate as any).techstack;

    const docRef = doc(db, 'projects', id);
    
    updateDoc(docRef, dataToUpdate)
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: dataToUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    return {
      message: `Project "${validatedData.title}" has been successfully updated.`,
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
          success: false,
          message: 'Validation failed: ' + error.errors.map(e => e.message).join(', '),
      };
    }
    console.error("Error updating project data: ", error);
    return {
      message: 'An unexpected error occurred while updating the project.',
      success: false,
    };
  }
}

export async function deleteProject(id: string): Promise<{success: boolean, message: string}> {
  try {
    const docRef = doc(db, 'projects', id);
    
    deleteDoc(docRef)
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    return {
      message: 'Project has been successfully deleted.',
      success: true,
    };
  } catch (error) {
    console.error("Error deleting project: ", error);
    return {
      message: 'An unexpected error occurred while deleting the project.',
      success: false,
    };
  }
}

const aboutSchema = z.object({
  skills: z.array(z.object({
    id: z.string(),
    title: z.string(),
    skills: z.string(),
  })),
  experience: z.array(z.object({
    id: z.string(),
    role: z.string(),
    company: z.string(),
    period: z.string(),
    description: z.string(),
  })),
});

export async function saveAboutData(data: { skills: Omit<SkillCategory, 'icon'>[], experience: Omit<Experience, 'icon'>[] }) {
    try {
        const validatedData = aboutSchema.parse(data);
        const portfolioDocRef = doc(db, 'portfolio/main');

        const dataToSave = {
            about: {
                ...validatedData,
            },
        };

        setDoc(portfolioDocRef, dataToSave, { merge: true }).catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: portfolioDocRef.path,
                operation: 'update',
                requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
        });

        return {
            success: true,
            message: 'About page data updated successfully!',
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed: ' + error.errors.map(e => e.message).join(', '),
            };
        }
        console.error("Error saving about data: ", error);
        return {
            success: false,
            message: 'An unexpected error occurred while saving your about page data.',
        };
    }
}


const achievementsSchema = z.object({
  achievements: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
  })),
});

export async function saveAchievementsData(data: { achievements: Omit<Achievement, 'icon'>[] }) {
    try {
        const validatedData = achievementsSchema.parse(data);
        const portfolioDocRef = doc(db, 'portfolio/main');

        const dataToSave = {
            achievements: validatedData.achievements,
        };

        setDoc(portfolioDocRef, dataToSave, { merge: true }).catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: portfolioDocRef.path,
                operation: 'update',
                requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
        });

        return {
            success: true,
            message: 'Achievements data updated successfully!',
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed: ' + error.errors.map(e => e.message).join(', '),
            };
        }
        console.error("Error saving achievements data: ", error);
        return {
            success: false,
            message: 'An unexpected error occurred while saving your achievements.',
        };
    }
}
