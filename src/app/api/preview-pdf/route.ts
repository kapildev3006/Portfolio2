import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * GET /api/preview-pdf?url=<cloudinary-url>
 *
 * Proxies a Cloudinary PDF and serves it as:
 *   Content-Type: application/pdf
 *   Content-Disposition: inline
 *
 * Includes automatic fallback: if an old/deleted resume URL returns 404,
 * it searches portfolio_resumes for the latest valid resume so the user
 * is never blocked by stale Firestore URLs.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  if (!fileUrl.startsWith('https://res.cloudinary.com/')) {
    return new NextResponse('Only Cloudinary URLs are allowed', { status: 403 });
  }

  console.log('[preview-pdf] Fetching:', fileUrl);

  try {
    let response = await fetch(fileUrl);
    console.log('[preview-pdf] Status:', response.status, response.statusText);

    // If 404 and it's a resume URL, attempt to recover using the latest valid resume in Cloudinary
    if (!response.ok && response.status === 404 && fileUrl.includes('portfolio_resumes')) {
      console.warn('[preview-pdf] 404 for requested resume. Checking Cloudinary for latest valid resume...');
      try {
        const list = await cloudinary.api.resources({
          resource_type: 'raw',
          type: 'upload',
          prefix: 'portfolio_resumes',
          max_results: 10,
        });

        const sorted = (list.resources || []).sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        for (const res of sorted) {
          if (res.secure_url) {
            console.log('[preview-pdf] Testing fallback resume:', res.secure_url);
            const fbRes = await fetch(res.secure_url);
            if (fbRes.ok) {
              console.log('[preview-pdf] Successfully resolved to fallback resume:', res.secure_url);
              const arrayBuffer = await fbRes.arrayBuffer();
              const rawFileName = decodeURIComponent(res.secure_url.split('/').pop() || 'resume.pdf');
              const fileName = rawFileName.endsWith('.pdf') ? rawFileName : rawFileName + '.pdf';
              return new NextResponse(arrayBuffer, {
                status: 200,
                headers: {
                  'Content-Type': 'application/pdf',
                  'Content-Disposition': `inline; filename="${fileName}"`,
                  'Cache-Control': 'public, max-age=3600',
                  'X-Resolved-Url': res.secure_url,
                },
              });
            }
          }
        }
      } catch (fallbackError) {
        console.error('[preview-pdf] Fallback recovery error:', fallbackError);
      }
    }

    if (!response.ok) {
      console.error('[preview-pdf] Failed:', response.status, fileUrl);
      return new NextResponse(
        `Failed to fetch file: ${response.status} ${response.statusText}`,
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const rawFileName = decodeURIComponent(fileUrl.split('/').pop() || 'resume.pdf');
    const fileName = rawFileName.endsWith('.pdf') ? rawFileName : rawFileName + '.pdf';

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[preview-pdf] Error:', error);
    return new NextResponse('Error fetching file from Cloudinary', { status: 500 });
  }
}
