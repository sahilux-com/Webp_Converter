export const formatSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const stripExtension = (name) =>
  name.substring(0, name.lastIndexOf('.')) || name;

export const triggerDownload = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  // Appending to the body is required for Firefox.
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
