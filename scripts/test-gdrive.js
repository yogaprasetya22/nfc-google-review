/**
 * Script Pengujian Koneksi & Upload ke Google Drive
 * Jalankan dengan: node scripts/test-gdrive.js
 */
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function testGDrive() {
  console.log('====================================================');
  console.log('🚀 MEMULAI PENGUJIAN KONEKSI & UPLOAD GOOGLE DRIVE');
  console.log('====================================================\n');

  // 1. Baca Credential Base64 atau JSON
  let jsonKey;
  if (fs.existsSync('gdrive_base64.txt')) {
    const b64 = fs.readFileSync('gdrive_base64.txt', 'utf8').trim();
    jsonKey = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
    console.log('🔑 Credential Base64 berhasil dimuat.');
  } else if (fs.existsSync('search-509508-bb1c563e6df7.json')) {
    jsonKey = JSON.parse(fs.readFileSync('search-509508-bb1c563e6df7.json', 'utf8'));
    console.log('🔑 Credential JSON langsung berhasil dimuat.');
  } else {
    console.error('❌ File credential tidak ditemukan!');
    process.exit(1);
  }

  console.log('   - Client Email :', jsonKey.client_email);
  console.log('   - Project ID    :', jsonKey.project_id);

  // 2. Inisialisasi Auth
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: jsonKey.client_email,
      private_key: jsonKey.private_key,
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });
  const folderId = '16tAjCfyklYBH2Jv2XEYYyKcLSEIx74d7';

  // 3. Test Baca Folder Target
  console.log('\n📂 [Step 1] Memeriksa Hak Akses ke Folder Google Drive:');
  console.log('   Folder ID:', folderId);
  try {
    const folderRes = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType, capabilities, owners'
    });
    console.log('   ✅ Terhubung ke Folder :', folderRes.data.name);
    console.log('   ✅ Izin Menambah File   :', folderRes.data.capabilities?.canAddChildren ? 'DIIZINKAN' : 'TIDAK DIIZINKAN');
  } catch (err) {
    console.error('   ❌ Gagal mengakses folder:', err.message);
    process.exit(1);
  }

  // 4. Test Upload File
  console.log('\n📤 [Step 2] Mencoba Unggah File Uji Coba...');
  const testFileName = `test-nfc-upload-${Date.now()}.txt`;
  const fileContent = `Halo! Ini adalah file uji coba upload otomatis NFC Google Review ke Google Drive pada ${new Date().toISOString()}`;

  try {
    const uploadRes = await drive.files.create({
      requestBody: {
        name: testFileName,
        parents: [folderId],
      },
      media: {
        mimeType: 'text/plain',
        body: fileContent,
      },
      fields: 'id, name, webViewLink, webContentLink',
      supportsAllDrives: true,
    });

    console.log('   🎉 UPLOAD BERHASIL!');
    console.log('   - File ID       :', uploadRes.data.id);
    console.log('   - File Name     :', uploadRes.data.name);
    console.log('   - WebView Link  :', uploadRes.data.webViewLink);
  } catch (err) {
    console.error('   ⚠️ Penjelasan Kegagalan Upload:');
    console.error('   Pesan Error:', err.message);
    if (err.message.includes('Service Accounts do not have storage quota')) {
      console.log('\n----------------------------------------------------');
      console.log('💡 DIAGNOSA MASALAH:');
      console.log('Google Cloud membatasi Service Account bawaan yang mengunggah ke folder Drive Personal (@gmail.com).');
      console.log('Service account dianggap tidak memiliki kuota storage sendiri (storage quota = 0 MB).');
      console.log('Solusi resmi Google: Folder harus berupa Google Workspace "Shared Drive" (Google Workspace Drive Bersama)');
      console.log('ATAU jika menggunakan Gmail biasa, file disimpan di storage Supabase/Cloudinary.');
      console.log('----------------------------------------------------');
    }
  }
}

testGDrive();
