import {FirebaseStorage} from 'firebase/storage';

export function getPublicDownloadUrlMedia(storage: FirebaseStorage, path: string) {

  const bucket = storage.app.options.storageBucket;
  path = path.startsWith('/') ? path.substring(1) : path;

  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media`;
}
