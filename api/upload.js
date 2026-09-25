import { google } from 'googleapis';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    // 1. Parse file multipart
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 25 * 1024 * 1024
    });

    const [, files] = await form.parse(req);
    const file = files.file ? (Array.isArray(files.file) ? files.file[0] : files.file) : null;

    if (!file) {
      return res.status(400).json({ success: false, error: 'Tidak ada file yang diunggah.' });
    }

    // 2. Ambil OAuth credentials (dari env var Vercel atau fallback local file gdrive_oauth.json)
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
      return res.status(500).json({
        success: false,
        error: 'Kredensial OAuth Google Drive belum lengkap (GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN).'
      });
    }

    // 3. Autentikasi OAuth2 User (Menggunakan kuota 15GB akun Google Anda)
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // 4. Siapkan metadata dan stream file
    const fileMetadata = {
      name: file.originalFilename || 'uploaded_asset',
      parents: folderId ? [folderId] : [],
    };

    const media = {
      mimeType: file.mimetype || 'application/octet-stream',
      body: fs.createReadStream(file.filepath),
    };

    // 5. Eksekusi upload ke Google Drive
    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink, thumbnailLink',
      supportsAllDrives: true
    });

    const fileId = driveResponse.data.id;

    // 6. Buat file publik agar bisa langsung tampil sebagai image src / link preview
    try {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } catch (permErr) {
      console.warn('Set permission warning:', permErr.message);
    }

    // Reliable proxy streaming endpoint + lh3 CDN direct URL
    const directViewUrl = `/api/gdrive-image?id=${fileId}`;
    const lh3Url = `https://lh3.googleusercontent.com/d/${fileId}`;

    return res.status(200).json({
      success: true,
      fileId: fileId,
      fileName: driveResponse.data.name,
      link: driveResponse.data.webViewLink,
      downloadLink: driveResponse.data.webContentLink,
      directUrl: directViewUrl,
      lh3Url: lh3Url,
      thumbnailUrl: `https://lh3.googleusercontent.com/d/${fileId}=s200`
    });
  } catch (error) {
    console.error('GDrive Upload Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Terjadi kesalahan saat mengunggah file ke Google Drive.'
    });
  }
}
