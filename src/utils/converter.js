import JSZip from 'jszip';

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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

export const downloadZip = async (files) => {
  const zip = new JSZip();
  const convertedFiles = files.filter(f => f.status === 'done' && f.convertedBlob);

  if (convertedFiles.length === 0) return;

  convertedFiles.forEach(fileObj => {
    const nameWithoutExt = fileObj.file.name.substring(0, fileObj.file.name.lastIndexOf('.')) || fileObj.file.name;
    zip.file(`${nameWithoutExt}.webp`, fileObj.convertedBlob);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'converted_images.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
