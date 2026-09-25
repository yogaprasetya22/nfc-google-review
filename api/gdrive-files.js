import { google } from 'googleapis';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let clientId = process.env.GDRIVE_CLIENT_ID;
    let clientSecret = process.env.GDRIVE_CLIENT_SECRET;
    let refreshToken = process.env.GDRIVE_REFRESH_TOKEN;
    let folderId = process.env.GDRIVE_FOLDER_ID || '16tAjCfyklYBH2Jv2XEYYyKcLSEIx74d7';

    if (!refreshToken && fs.existsSync('gdrive_oauth.json')) {
      try {
        const localCreds = JSON.parse(fs.readFileSync('gdrive_oauth.json', 'utf8'));
        clientId = clientId || localCreds.client_id;
        clientSecret = clientSecret || localCreds.client_secret;
        refreshToken = refreshToken || localCreds.refresh_token;
        folderId = folderId || localCreds.folder_id;
      } catch (e) {
        console.warn('Gagal membaca gdrive_oauth.json:', e);
      }
    }

    if (!clientId || !clientSecret || !refreshToken) {
      return res.status(500).json({ success: false, error: 'Kredensial OAuth belum lengkap.' });
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`,
      fields: 'files(id, name, mimeType, size, createdTime)',
      orderBy: 'createdTime desc',
      pageSize: 50
    });

    const files = (response.data.files || []).map(f => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      size: Number(f.size || 0),
      createdTime: f.createdTime,
      directUrl: `/api/gdrive-image?id=${f.id}`,
      lh3Url: `https://lh3.googleusercontent.com/d/${f.id}`,
      thumbnailUrl: `https://lh3.googleusercontent.com/d/${f.id}=s200`
    }));

    return res.status(200).json({ success: true, files });
  } catch (error) {
    console.error('GDrive List Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
