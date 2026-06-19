import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { isNativePlatform } from '@/utils/platform';

/**
 * Camera and Photo service for MelodyWings Mobile.
 * Used for profile picture uploads and any media capture.
 */

export interface CapturedPhoto {
  base64String?: string;
  dataUrl?: string;
  webPath?: string;
  format: string;
}

/** Take a photo using the device camera */
export const takePhoto = async (): Promise<CapturedPhoto | null> => {
  try {
    const photo: Photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      width: 500,
      height: 500,
    });

    return {
      dataUrl: photo.dataUrl,
      base64String: photo.base64String,
      webPath: photo.webPath,
      format: photo.format,
    };
  } catch (error) {
    console.error('[Camera] Take photo failed:', error);
    return null;
  }
};

/** Pick a photo from the device gallery */
export const pickFromGallery = async (): Promise<CapturedPhoto | null> => {
  try {
    const photo: Photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      width: 500,
      height: 500,
    });

    return {
      dataUrl: photo.dataUrl,
      base64String: photo.base64String,
      webPath: photo.webPath,
      format: photo.format,
    };
  } catch (error) {
    console.error('[Camera] Gallery pick failed:', error);
    return null;
  }
};

/** Check and request camera permissions */
export const checkCameraPermissions = async (): Promise<boolean> => {
  if (!isNativePlatform()) return true;

  const permissions = await Camera.checkPermissions();

  if (permissions.camera === 'granted' && permissions.photos === 'granted') {
    return true;
  }

  const requested = await Camera.requestPermissions();
  return requested.camera === 'granted';
};

/** Convert a data URL to a File object (for uploading to backend) */
export const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
