'use server';

import { v2 as cloudinary } from 'cloudinary';

export async function uploadImageToCloudinary(formData: FormData) {
  try {
    console.log('=== UPLOAD START ===');
    
    const file = formData.get('image') as File;
    if (!file) {
      console.log('❌ No file provided');
      return {
        success: false,
        message: 'No image file provided.',
      };
    }
    
    console.log('📁 File received:', {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.type
    });
    
    // Validate file size - be more conservative due to server action limits
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large');
      return {
        success: false,
        message: 'File too large. Please use an image smaller than 5MB.',
      };
    }
    
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type');
      return {
        success: false,
        message: 'Please upload a valid image file.',
      };
    }
    
    // Configure Cloudinary
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };
    
    console.log('🔑 Cloudinary config:', {
      cloud_name: !!config.cloud_name,
      api_key: !!config.api_key,
      api_secret: !!config.api_secret,
    });
    
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.log('❌ Missing Cloudinary credentials');
      return {
        success: false,
        message: 'Server configuration error.',
      };
    }
    
    cloudinary.config(config);
    
    console.log('⬆️ Starting upload to Cloudinary...');
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log('💾 Buffer created, size:', buffer.length);
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio_profiles',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ],
          tags: ['portfolio', 'profile']
        },
        (error, result) => {
          if (error) {
            console.log('❌ Cloudinary error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful');
            resolve(result);
          }
        }
      ).end(buffer);
    });
    
    const result = uploadResult as any;
    console.log('🎉 Upload complete:', result.secure_url);
    
    return {
      success: true,
      message: 'Image uploaded successfully!',
      imageUrl: result.secure_url,
    };
    
  } catch (error) {
    console.log('💥 Server action error:', error);
    
    // Handle specific error types
    let errorMessage = 'Upload failed: ';
    
    if (error instanceof Error) {
      if (error.message.includes('Body exceeded') || error.message.includes('1 MB limit')) {
        errorMessage = 'File too large for server processing. Please use an image smaller than 1MB.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Upload timeout. Please try with a smaller image.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        errorMessage += error.message;
      }
    } else {
      errorMessage += 'Unknown error occurred.';
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function uploadResumeToCloudinary(formData: FormData) {
  try {
    console.log('=== RESUME UPLOAD START ===');
    
    const file = formData.get('file') as File;
    if (!file) {
      console.log('❌ No file provided');
      return {
        success: false,
        message: 'No file provided.',
      };
    }
    
    console.log('📄 File received:', {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.type
    });
    
    // Extract filename without extension for public_id
    const originalName = file.name;
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_');
    
    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ File too large');
      return {
        success: false,
        message: 'File too large. Please use a file smaller than 10MB.',
      };
    }
    
    if (file.type !== 'application/pdf') {
      console.log('❌ Invalid file type');
      return {
        success: false,
        message: 'Please upload a PDF file only.',
      };
    }
    
    // Configure Cloudinary
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };
    
    console.log('🔑 Cloudinary config:', {
      cloud_name: !!config.cloud_name,
      api_key: !!config.api_key,
      api_secret: !!config.api_secret,
    });
    
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.log('❌ Missing Cloudinary credentials');
      return {
        success: false,
        message: 'Server configuration error.',
      };
    }
    
    cloudinary.config(config);
    
    console.log('⬆️ Starting upload to Cloudinary...');
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log('💾 Buffer created, size:', buffer.length);
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image', // Use image for PDF to allow native inline browser preview
          folder: 'portfolio_resumes',
          public_id: `${sanitizedName}_${Date.now()}.pdf`, // Original name + timestamp for uniqueness
          tags: ['portfolio', 'resume', 'pdf']
        },
        (error, result) => {
          if (error) {
            console.log('❌ Cloudinary error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful');
            resolve(result);
          }
        }
      ).end(buffer);
    });
    
    const result = uploadResult as any;
    console.log('🎉 Upload complete:', result.secure_url);
    
    return {
      success: true,
      message: 'Resume uploaded successfully!',
      fileUrl: result.secure_url,
      originalFileName: originalName,
    };
    
  } catch (error) {
    console.log('💥 Server action error:', error);
    
    // Handle specific error types
    let errorMessage = 'Upload failed: ';
    
    if (error instanceof Error) {
      if (error.message.includes('Body exceeded') || error.message.includes('1 MB limit')) {
        errorMessage = 'File too large for server processing. Please use a file smaller than 1MB.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Upload timeout. Please try with a smaller file.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        errorMessage += error.message;
      }
    } else {
      errorMessage += 'Unknown error occurred.';
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function downloadFileWithOriginalName(fileUrl: string, fileName: string) {
  try {
    console.log('=== FILE DOWNLOAD START ===');
    console.log('📥 Downloading:', { fileUrl, fileName });
    
    // Fetch the file from Cloudinary
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    
    // Get the file as ArrayBuffer
    const fileBuffer = await response.arrayBuffer();
    
    console.log('✅ File fetched successfully, size:', fileBuffer.byteLength);
    
    return {
      success: true,
      fileBuffer: Array.from(new Uint8Array(fileBuffer)),
      fileName,
      contentType: response.headers.get('content-type') || 'application/pdf',
    };
    
  } catch (error) {
    console.error('💥 Download error:', error);
    return {
      success: false,
      message: `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
