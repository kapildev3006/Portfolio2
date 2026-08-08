import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/preview-pdf?url=<cloudinary-url>
 *
 * Proxies a Cloudinary PDF and serves it as:
 *   Content-Type: application/pdf
 *   Content-Disposition: inline
 *
 * Now that "Allow delivery of PDF and ZIP files" is enabled in the
 * Cloudinary security settings, direct CDN URLs work fine.
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
    const response = await fetch(fileUrl);
    console.log('[preview-pdf] Status:', response.status, response.statusText);

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
