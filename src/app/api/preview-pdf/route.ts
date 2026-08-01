import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/preview-pdf?url=<cloudinary-url>
 *
 * Proxies a Cloudinary PDF (raw or image resource type) and always serves it as
 *   Content-Type: application/pdf
 *   Content-Disposition: inline
 *
 * Cloudinary raw uploads return Content-Type: application/octet-stream, which
 * causes browsers to download instead of preview. This proxy overrides that.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Security: only allow Cloudinary URLs to prevent open-proxy abuse
  if (!fileUrl.startsWith('https://res.cloudinary.com/')) {
    return new NextResponse('Only Cloudinary URLs are allowed', { status: 403 });
  }

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return new NextResponse(`Failed to fetch file from Cloudinary: ${response.statusText}`, {
        status: response.status,
      });
    }

    const arrayBuffer = await response.arrayBuffer();

    // Derive a clean filename from the URL (strip duplicate .pdf.pdf if any)
    const rawFileName = decodeURIComponent(fileUrl.split('/').pop() || 'resume.pdf');
    const fileName = rawFileName.replace(/\.pdf\.pdf$/i, '.pdf').endsWith('.pdf')
      ? rawFileName.replace(/\.pdf\.pdf$/i, '.pdf')
      : rawFileName + '.pdf';

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        // Always force application/pdf regardless of what Cloudinary returns.
        // Raw uploads return application/octet-stream which forces a download.
        'Content-Type': 'application/pdf',
        // 'inline' tells the browser to open in its built-in PDF viewer
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[preview-pdf] Error:', error);
    return new NextResponse('Error fetching file from Cloudinary', { status: 500 });
  }
}
