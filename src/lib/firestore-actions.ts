
'use client';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, setDoc, addDoc, collection, Timestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { SkillCategory, Experience, Achievement } from '@/lib/types';
import { contactFormSchema } from '@/lib/types';

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
  achievements: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
  })),
});

export async function saveAboutData(data: { 
  skills: Omit<SkillCategory, 'icon'>[], 
  experience: Omit<Experience, 'icon'>[],
  achievements: Omit<Achievement, 'icon'>[] 
}) {
    try {
        const validatedData = aboutSchema.parse(data);
        const portfolioDocRef = doc(db, 'portfolio/main');

        const dataToSave = {
            about: {
                skills: validatedData.skills,
                experience: validatedData.experience,
            },
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

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const submissionData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      isRead: false,
      createdAt: Timestamp.now(),
    };

    // Since validation is handled client-side by react-hook-form,
    // we can remove the redundant server-side Zod parsing.
    // contactFormSchema.parse(submissionData)

    await addDoc(collection(db, 'contactSubmissions'), submissionData);

    return {
      message: 'Thank you for your message! I will get back to you soon.',
      success: true,
    };
  } catch (error) {
    // We can still keep a generic catch block for unexpected errors.
    console.error('Error saving message:', error);
    return {
      message: 'Something went wrong. Please try again later.',
      success: false,
    };
  }
}


export function updateContactSubmissionStatus(id: string, isRead: boolean) {
  const docRef = doc(db, 'contactSubmissions', id);
  return updateDoc(docRef, { isRead })
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: { isRead },
        });
        errorEmitter.emit('permission-error', permissionError);
        // Re-throw the error so Promise.all will reject
        throw serverError;
    });
}

export async function deleteContactSubmission(id: string): Promise<{ success: boolean; message: string }> {
  const docRef = doc(db, 'contactSubmissions', id);
  
  deleteDoc(docRef).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: docRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
  
  // Optimistically return success, error will be thrown by the listener
  return {
    success: true,
    message: 'Submission deleted successfully.',
  };
}
