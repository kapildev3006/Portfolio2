'use server';

import { v2 as cloudinary } from 'cloudinary';

// ─── Shared helper ─────────────────────────────────────────────────────────────

function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key    = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) return false;
  cloudinary.config({ cloud_name, api_key, api_secret });
  return true;
}

/**
 * Extracts the Cloudinary public_id from a secure URL.
 * e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/folder/file.jpg
 *   → folder/file   (extension stripped for image/video)
 * e.g. https://res.cloudinary.com/<cloud>/raw/upload/v123/folder/file
 *   → folder/file   (no extension to strip for raw)
 */
function extractPublicId(url: string): { publicId: string; resourceType: 'image' | 'raw' | 'video' } | null {
  try {
    const match = url.match(/\/(?:(image|raw|video)\/upload)\/.+?\/(?:v\d+\/)?(.+)$/);
    if (!match) return null;
    const resourceType = match[1] as 'image' | 'raw' | 'video';
    let publicId = match[2];
    // For image/video resources strip the file extension so Cloudinary resolves correctly
    if (resourceType !== 'raw') {
      publicId = publicId.replace(/\.[^/.]+$/, '');
    }
    return { publicId, resourceType };
  } catch {
    return null;
  }
}

// ─── Delete ────────────────────────────────────────────────────────────────────

/**
 * Deletes a Cloudinary asset by its secure URL.
 * Called before uploading a replacement so old assets don't accumulate.
 */
export async function deleteCloudinaryAsset(url: string): Promise<{ success: boolean; message: string }> {
  if (!url || !url.includes('res.cloudinary.com')) {
    return { success: false, message: 'Not a Cloudinary URL — skipping delete.' };
  }
  if (!configureCloudinary()) {
    return { success: false, message: 'Missing Cloudinary credentials.' };
  }

  const parsed = extractPublicId(url);
  if (!parsed) {
    return { success: false, message: `Could not parse public_id from URL: ${url}` };
  }

  try {
    const result = await cloudinary.uploader.destroy(parsed.publicId, {
      resource_type: parsed.resourceType,
      invalidate: true, // Purge from CDN cache too
    });
    console.log(`🗑️ Deleted Cloudinary asset [${parsed.resourceType}] ${parsed.publicId}:`, result);
    return { success: true, message: `Deleted ${parsed.publicId}` };
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    return { success: false, message: (error as Error).message };
  }
}

// ─── Profile image upload ───────────────────────────────────────────────────────

export async function uploadImageToCloudinary(formData: FormData) {
  try {
    console.log('=== PROFILE IMAGE UPLOAD START ===');

    const file = formData.get('image') as File;
    if (!file) return { success: false, message: 'No image file provided.' };

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, message: 'File too large. Please use an image smaller than 5MB.' };
    }
    if (!file.type.startsWith('image/')) {
      return { success: false, message: 'Please upload a valid image file.' };
    }

    // Delete previous profile image before uploading new one
    const oldUrl = formData.get('oldUrl') as string | null;
    if (oldUrl) {
      console.log('🗑️ Deleting old profile image...');
      const del = await deleteCloudinaryAsset(oldUrl);
      console.log('Delete result:', del.message);
    }

    if (!configureCloudinary()) {
      return { success: false, message: 'Server configuration error.' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio_profiles',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
          tags: ['portfolio', 'profile'],
        },
        (error, result) => {
          if (error) { console.log('❌ Cloudinary error:', error); reject(error); }
          else { console.log('✅ Profile image uploaded'); resolve(result); }
        }
      ).end(buffer);
    });

    const result = uploadResult as any;
    console.log('🎉 Profile image upload complete:', result.secure_url);
    return { success: true, message: 'Image uploaded successfully!', imageUrl: result.secure_url };

  } catch (error) {
    console.error('💥 Profile image upload error:', error);
    let msg = 'Upload failed: ';
    if (error instanceof Error) {
      if (error.message.includes('Body exceeded') || error.message.includes('1 MB limit')) msg = 'File too large for server processing. Use an image smaller than 1MB.';
      else if (error.message.includes('timeout')) msg = 'Upload timeout. Try with a smaller image.';
      else msg += error.message;
    } else msg += 'Unknown error.';
    return { success: false, message: msg };
  }
}

// ─── Resume upload ──────────────────────────────────────────────────────────────

export async function uploadResumeToCloudinary(formData: FormData) {
  try {
    console.log('=== RESUME UPLOAD START ===');

    const file = formData.get('file') as File;
    if (!file) return { success: false, message: 'No file provided.' };

    console.log('📄 File received:', {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.type,
    });

    const originalName = file.name;
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_');

    if (file.size > 10 * 1024 * 1024) return { success: false, message: 'File too large. Use a file smaller than 10MB.' };
    if (file.type !== 'application/pdf') return { success: false, message: 'Please upload a PDF file only.' };

    // Delete previous resume before uploading new one
    const oldUrl = formData.get('oldUrl') as string | null;
    if (oldUrl) {
      console.log('🗑️ Deleting old resume...');
      const del = await deleteCloudinaryAsset(oldUrl);
      console.log('Delete result:', del.message);
    }

    if (!configureCloudinary()) return { success: false, message: 'Server configuration error.' };

    console.log('⬆️ Starting upload to Cloudinary...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('💾 Buffer created, size:', buffer.length);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // MUST be 'raw' to preserve actual PDF bytes. 'image' rasterizes the PDF and breaks it.
          folder: 'portfolio_resumes',
          public_id: `${sanitizedName}_${Date.now()}`, // No .pdf extension
          tags: ['portfolio', 'resume', 'pdf'],
        },
        (error, result) => {
          if (error) { console.log('❌ Cloudinary error:', error); reject(error); }
          else { console.log('✅ Cloudinary upload successful'); resolve(result); }
        }
      ).end(buffer);
    });

    const result = uploadResult as any;
    console.log('🎉 Upload complete:', result.secure_url);
    return { success: true, message: 'Resume uploaded successfully!', fileUrl: result.secure_url, originalFileName: originalName };

  } catch (error) {
    console.error('💥 Server action error:', error);
    let msg = 'Upload failed: ';
    if (error instanceof Error) {
      if (error.message.includes('Body exceeded') || error.message.includes('1 MB limit')) msg = 'File too large for server processing.';
      else if (error.message.includes('timeout')) msg = 'Upload timeout.';
      else if (error.message.includes('network')) msg = 'Network error.';
      else msg += error.message;
    } else msg += 'Unknown error.';
    return { success: false, message: msg };
  }
}

// ─── Project image upload ───────────────────────────────────────────────────────

/**
 * Uploads a project screenshot/thumbnail to Cloudinary.
 * Deletes the old image first if an oldUrl is provided.
 * Images go to portfolio_projects folder (separate from profile images).
 */
export async function uploadProjectImageToCloudinary(formData: FormData) {
  try {
    console.log('=== PROJECT IMAGE UPLOAD START ===');

    const file = formData.get('image') as File;
    if (!file) return { success: false, message: 'No image file provided.' };

    if (file.size > 10 * 1024 * 1024) return { success: false, message: 'File too large. Use an image smaller than 10MB.' };
    if (!file.type.startsWith('image/')) return { success: false, message: 'Please upload a valid image file.' };

    // Delete old project image before uploading new one
    const oldUrl = formData.get('oldUrl') as string | null;
    if (oldUrl) {
      console.log('🗑️ Deleting old project image...');
      const del = await deleteCloudinaryAsset(oldUrl);
      console.log('Delete result:', del.message);
    }

    if (!configureCloudinary()) return { success: false, message: 'Server configuration error.' };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio_projects', // ← dedicated folder for project images
          transformation: [
            { width: 1280, height: 800, crop: 'fill' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
          tags: ['portfolio', 'project'],
        },
        (error, result) => {
          if (error) { console.log('❌ Cloudinary error:', error); reject(error); }
          else { console.log('✅ Project image uploaded'); resolve(result); }
        }
      ).end(buffer);
    });

    const result = uploadResult as any;
    console.log('🎉 Project image upload complete:', result.secure_url);
    return { success: true, message: 'Project image uploaded successfully!', imageUrl: result.secure_url };

  } catch (error) {
    console.error('💥 Project image upload error:', error);
    let msg = 'Upload failed: ';
    if (error instanceof Error) msg += error.message;
    else msg += 'Unknown error.';
    return { success: false, message: msg };
  }
}

// ─── Certificate upload ─────────────────────────────────────────────────────────

export async function uploadCertificateToCloudinary(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) return { success: false, message: 'No file provided.' };

    const originalName = file.name;
    const isPdf = file.type === 'application/pdf';

    // Delete old certificate before uploading new one
    const oldUrl = formData.get('oldUrl') as string | null;
    if (oldUrl) {
      console.log('🗑️ Deleting old certificate...');
      await deleteCloudinaryAsset(oldUrl);
    }

    if (!configureCloudinary()) return { success: false, message: 'Server configuration error.' };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: isPdf ? 'raw' : 'auto',
          folder: 'portfolio_certificates',
          public_id: isPdf ? `${originalName.replace(/\.[^/.]+$/, '')}_${Date.now()}` : undefined,
          tags: ['portfolio', 'certificate'],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const result = uploadResult as any;
    return { success: true, message: 'Certificate uploaded successfully!', fileUrl: result.secure_url, originalFileName: originalName };

  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, message: 'Upload failed.' };
  }
}

export async function downloadFileWithOriginalName(fileUrl: string, fileName: string) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
    const fileBuffer = await response.arrayBuffer();
    return {
      success: true,
      fileBuffer: Array.from(new Uint8Array(fileBuffer)),
      fileName,
      contentType: response.headers.get('content-type') || 'application/pdf',
    };
  } catch (error) {
    console.error('💥 Download error:', error);
    return { success: false, message: `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}
