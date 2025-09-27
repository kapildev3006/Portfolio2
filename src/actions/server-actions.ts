'use server';

import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  const validatedFields = formSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
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
