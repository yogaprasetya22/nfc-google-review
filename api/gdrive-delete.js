import { google } from 'googleapis';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    // Parse body for fileId
    let body = '';
    await new Promise((resolve) => {
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', resolve);
    });

    let fileId;
    try {
      const parsed = JSON.parse(body);
      fileId = parsed.fileId;
    } catch {
      fileId = null;
    }

    if (!fileId) {
      return res.status(400).json({ success: false, error: 'fileId diperlukan.' });
    }

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

    if (!clientId || !clientSecret || !refreshToken) {
      return res.status(500).json({ success: false, error: 'Kredensial OAuth belum lengkap.' });
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    try {
      await drive.files.delete({ fileId });
    } catch (delErr) {
      if (delErr.code === 404 || delErr.status === 404) {
        return res.status(200).json({ success: true, deletedFileId: fileId, note: 'File already deleted' });
      }
      throw delErr;
    }

    return res.status(200).json({ success: true, deletedFileId: fileId });
  } catch (error) {
    console.error('GDrive Delete Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
