
'use server';

import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
import { adminDb } from '@/lib/firebase-admin';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  const validatedFields = formSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check your inputs.',
      success: false,
    };
  }

  try {
    // Here you would typically save the data to a database like Firestore
    // For example: await db.collection('submissions').add(validatedFields.data);
    console.log('Form submission received:', validatedFields.data);

    return {
      message: 'Thank you for your message! I will get back to you soon.',
      success: true,
    };
  } catch (error) {
    console.error('Error saving message:', error);
    return {
      message: 'Something went wrong. Please try again later.',
      success: false,
    };
  }
}


export async function uploadImage(formData: FormData) {
  const file = formData.get('image') as File;
  if (!file) {
    return {
      message: 'No image file provided.',
      success: false,
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const results = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        // Optionally, you can add upload presets, tags, etc.
        // folder: "portfolio_profiles",
      }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }).end(buffer);
    });

    return {
      message: 'Image uploaded successfully.',
      success: true,
      imageUrl: (results as any).secure_url,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      message: 'Failed to upload image.',
      success: false,
    };
  }
}

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return {
      message: 'No file provided.',
      success: false,
    };
  }

  // Optional: Add file type/size validation here

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const results = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        resource_type: 'auto', // Automatically detect file type
        public_id: 'resume' // Or make this dynamic if needed
      }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }).end(buffer);
    });

    return {
      message: 'File uploaded successfully.',
      success: true,
      fileUrl: (results as any).secure_url,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      message: 'Failed to upload file.',
      success: false,
    };
  }
}

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
    if (!adminDb) {
      return {
        success: false,
        message: "Database connection not configured. Please set the FIREBASE_SERVICE_ACCOUNT_KEY environment variable on your server.",
      };
    }

    try {
        const validatedData = profileSchema.parse(data);
        
        const portfolioDocRef = adminDb.doc('portfolio/main');

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

        await portfolioDocRef.set(dataToSave, { merge: true });

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
