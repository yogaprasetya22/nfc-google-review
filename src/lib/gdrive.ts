/**
 * Utility helpers for Google Drive via serverless API
 */
export interface GDriveUploadResult {
  fileId: string;
  fileName: string;
  link: string;
  directUrl: string;
  downloadLink?: string;
  thumbnailUrl?: string;
}

export interface GDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  createdTime: string;
  directUrl: string;
  thumbnailUrl: string;
}

/** folderType: 'profile' → GDRIVE_FOLDER_ID_PROFILE, 'background' → GDRIVE_FOLDER_ID_BACKGROUND, undefined → default */
export async function uploadToGoogleDrive(
  file: File | Blob,
  fileName?: string,
  folderType?: 'profile' | 'background'
): Promise<GDriveUploadResult> {
  const formData = new FormData();
  if (file instanceof File) {
    formData.append('file', file);
  } else {
    formData.append('file', file, fileName || `file-${Date.now()}`);
  }
  if (folderType) formData.append('folderType', folderType);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const text = await response.text();
  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(text || `Server error (${response.status})`);
  }

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Gagal mengunggah file ke Google Drive.');
  }

  return {
    fileId: data.fileId,
    fileName: data.fileName || (file instanceof File ? file.name : 'uploaded_file'),
    link: data.link,
    directUrl: data.directUrl || data.link,
    downloadLink: data.downloadLink,
    thumbnailUrl: data.thumbnailUrl
  };
}

export async function listGDriveFiles(): Promise<GDriveFile[]> {
  const response = await fetch('/api/gdrive-files');
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Gagal mengambil daftar file dari Google Drive.');
  }
  return data.files || [];
}

export async function deleteGDriveFile(fileId: string): Promise<void> {
  const response = await fetch('/api/gdrive-delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId })
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Gagal menghapus file dari Google Drive.');
  }
}

/** Extract GDrive file ID from lh3 CDN URL or /api/gdrive-image?id= URL */
export function extractGDriveFileId(url: string): string | null {
  const lh3Match = url.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match) return lh3Match[1];
  const proxyMatch = url.match(/\/api\/gdrive-image\?id=([a-zA-Z0-9_-]+)/);
  if (proxyMatch) return proxyMatch[1];
  return null;
}

