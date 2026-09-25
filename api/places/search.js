/**
 * API Endpoint: Resolve Query / Business Name to Real Google Place ID & WriteReview URL
 * Tanpa Google Places API Key berbayar.
 * Menggunakan pencarian Google Maps query via endpoint internal untuk mengekstrak Place ID resmi (ChIJ...).
 */

export const config = {
  runtime: 'nodejs',
  maxDuration: 10,
};

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const query = req.method === 'GET'
    ? (new URL(req.url, 'http://localhost').searchParams.get('query') || '')
    : (req.body?.query || req.body?.business_name || '');

  const trimmed = query.trim();
  if (!trimmed) {
    return res.status(400).json({ success: false, error: 'Query parameter is required' });
  }

  try {
    const searchUrl = `https://www.google.com/search?tbm=map&authuser=0&hl=id&gl=id&q=${encodeURIComponent(trimmed)}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9'
      }
    });

    if (!response.ok) {
      return res.status(502).json({ success: false, error: 'Failed to search Google Maps' });
    }

    const html = await response.text();

    // 1. Ekstrak Place ID resmi (ChIJ...)
    const chijMatches = html.match(/ChIJ[a-zA-Z0-9_-]{20,}/g);
    const placeId = chijMatches && chijMatches.length > 0 ? chijMatches[0] : null;

    if (placeId) {
      const writeReviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
      return res.status(200).json({
        success: true,
        place_id: placeId,
        placeId: placeId,
        name: trimmed,
        writeReviewUrl,
        direct_url: writeReviewUrl
      });
    }

    return res.status(404).json({
      success: false,
      error: `Place ID not found for "${trimmed}"`
    });
  } catch (error) {
    console.error('Resolve place error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
