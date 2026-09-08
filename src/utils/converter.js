import JSZip from 'jszip';
import { formatSize, stripExtension, triggerDownload } from './format';

export { formatSize, stripExtension, triggerDownload };

export const convertToWebP = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Conversion failed'));
            return;
          }
          const webpBlob = new Blob([blob], { type: 'image/webp' });
          const url = URL.createObjectURL(webpBlob);
          resolve({
            url,
            blob: webpBlob,
            size: blob.size,
            sizeDisplay: formatSize(blob.size),
            originalSizeDisplay: formatSize(file.size)
          });
        }, 'image/webp', quality);
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const downloadZip = async (files, zipName = 'converted_images.zip') => {
  const zip = new JSZip();
  const convertedFiles = files.filter(f => f.status === 'done' && f.convertedBlob);

  if (convertedFiles.length === 0) return;

  convertedFiles.forEach(fileObj => {
    zip.file(`${stripExtension(fileObj.file.name)}.webp`, fileObj.convertedBlob);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  triggerDownload(url, zipName);
  URL.revokeObjectURL(url);
};
