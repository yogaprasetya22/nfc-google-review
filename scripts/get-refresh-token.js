/**
 * One-time OAuth Token Generator untuk Google Drive (yogaagle123z@gmail.com)
 * Jalankan dengan: node scripts/get-refresh-token.js
 */
import http from 'http';
import url from 'url';
import open from 'child_process';
import { google } from 'googleapis';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GDRIVE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GDRIVE_CLIENT_SECRET || '';
const REDIRECT_URI = 'http://localhost:3333/oauth2callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Mohon set GDRIVE_CLIENT_ID dan GDRIVE_CLIENT_SECRET di file .env terlebih dahulu.');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = url.parse(req.url, true);
    if (reqUrl.pathname === '/oauth2callback') {
      const code = reqUrl.query.code;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #10b981;">🎉 Otorisasi Google Drive Berhasil!</h1>
          <p>Refresh token telah disimpan secara otomatis. Anda bisa menutup tab ini dan kembali ke terminal.</p>
        </div>
      `);

      const { tokens } = await oauth2Client.getToken(code);
      console.log('\n======================================================');
      console.log('✅ REFRESH TOKEN BERHASIL DIDAPATKAN!');
      console.log('======================================================');
      console.log('Refresh Token:', tokens.refresh_token);

      const folderId = process.env.GDRIVE_FOLDER_ID || '';
      fs.writeFileSync('gdrive_oauth.json', JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: tokens.refresh_token,
        folder_id: folderId
      }, null, 2));

      console.log('💾 Token disimpan di gdrive_oauth.json (diabaikan oleh git).');
      console.log('======================================================\n');

      setTimeout(() => process.exit(0), 1000);
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error: ' + err.message);
  }
});

server.listen(3333, () => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file'
    ]
  });

  console.log('\n======================================================');
  console.log('🔗 BUKA TAUTAN BERIKUT DI BROWSER ANDA UNTUK LOGIN:');
  console.log('======================================================\n');
  console.log(authUrl);
  console.log('\n======================================================');
  console.log('Menunggu login dari browser (port 3333)...');
});
