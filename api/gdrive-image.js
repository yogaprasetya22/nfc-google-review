import { google } from 'googleapis';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { id } = req.query || {};
  const urlObj = new URL(req.url, 'http://localhost');
  const fileId = id || urlObj.searchParams.get('id');

  if (!fileId) {
    return res.status(400).json({ success: false, error: 'File ID diperlukan' });
  }

  try {
    let clientId = process.env.GDRIVE_CLIENT_ID;
    let clientSecret = process.env.GDRIVE_CLIENT_SECRET;
    let refreshToken = process.env.GDRIVE_REFRESH_TOKEN;

    if (!refreshToken && fs.existsSync('gdrive_oauth.json')) {
      try {
        const localCreds = JSON.parse(fs.readFileSync('gdrive_oauth.json', 'utf8'));
        clientId = clientId || localCreds.client_id;
        clientSecret = clientSecret || localCreds.client_secret;
        refreshToken = refreshToken || localCreds.refresh_token;
      } catch (e) {
        console.warn('Gagal membaca gdrive_oauth.json:', e);
      }
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Ambil metadata untuk mimeType dan nama
    const meta = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size'
    });

    res.setHeader('Content-Type', meta.data.mimeType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Stream isi file gambar langsung ke client
    const responseStream = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    responseStream.data.pipe(res);
  } catch (error) {
    if (error.code === 404 || error.status === 404) {
      if (!res.headersSent) {
        return res.status(404).json({ success: false, error: 'File tidak ditemukan di Google Drive.' });
      }
    }
    console.error('GDrive Image Proxy Error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
