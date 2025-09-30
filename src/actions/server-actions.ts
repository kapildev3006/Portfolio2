
'use server';

import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';

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
