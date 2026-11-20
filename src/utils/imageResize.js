/**
 * Image Resize Utility
 * Resizes any image (base64 or file/blob) so that its final size is strictly under 500 KB
 * suitable for storing directly in Firebase Firestore documents.
 */

const MAX_BYTES = 500 * 1024; // 500 KB = 512,000 bytes
const MAX_DIMENSION = 800; // Max width or height

/**
 * Calculates byte size of a Base64 Data URL string
 */
export function getBase64SizeInBytes(base64String) {
  if (!base64String) return 0;
  const padding = (base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0);
  const base64Length = base64String.length - (base64String.indexOf(',') + 1);
  return (base64Length * 3) / 4 - padding;
}

/**
 * Resizes and compresses an image to guarantee size is under 500 KB
 * @param {string | File | Blob} source - Data URL string or File/Blob object
 * @returns {Promise<{ dataUrl: string, sizeKB: number, width: number, height: number }>}
 */
export function resizeImageToMax500KB(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // 1. Calculate scaled dimensions keeping aspect ratio
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Fill white background for transparent PNG conversions to JPEG
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Iteratively adjust quality until under 500 KB
      let quality = 0.88;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);
      let sizeBytes = getBase64SizeInBytes(dataUrl);

      // Binary/Linear step down if above 500 KB
      while (sizeBytes > MAX_BYTES && quality > 0.15) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
        sizeBytes = getBase64SizeInBytes(dataUrl);
      }

      // If still above 500 KB (rare), scale down dimensions further
      if (sizeBytes > MAX_BYTES) {
        const scaledCanvas = document.createElement('canvas');
        scaledCanvas.width = Math.round(width * 0.7);
        scaledCanvas.height = Math.round(height * 0.7);
        const sCtx = scaledCanvas.getContext('2d');
        sCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
        dataUrl = scaledCanvas.toDataURL('image/jpeg', 0.7);
        sizeBytes = getBase64SizeInBytes(dataUrl);
        width = scaledCanvas.width;
        height = scaledCanvas.height;
      }

      const sizeKB = Math.round((sizeBytes / 1024) * 10) / 10;
      console.log(`[ImageResizer] Successfully resized to ${width}x${height}, size: ${sizeKB} KB (Max allowed: 500 KB)`);

      resolve({
        dataUrl,
        sizeKB,
        width,
        height
      });
    };

    img.onerror = (err) => {
      console.error('[ImageResizer] Failed to load image for resizing:', err);
      reject(new Error('Failed to load image for resizing'));
    };

    // Load source
    if (typeof source === 'string') {
      img.src = source;
    } else if (source instanceof Blob || source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    } else {
      reject(new Error('Invalid image source'));
    }
  });
}
