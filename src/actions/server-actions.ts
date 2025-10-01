
'use server';

import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { contactFormSchema } from '@/lib/types';


export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const submissionData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      isRead: false,
      createdAt: Timestamp.now(),
    };
    await addDoc(collection(db, 'contactSubmissions'), submissionData);

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
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

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
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

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
