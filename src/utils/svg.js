import { triggerDownload } from './format';

/**
 * Parses SVG source and reports whether it is renderable.
 * Returns { valid, error, width, height }.
 */
export const inspectSvg = (code) => {
  const source = (code || '').trim();
  if (!source) return { valid: false, error: 'Paste some SVG code to preview it.' };

  let doc;
  try {
    doc = new DOMParser().parseFromString(source, 'image/svg+xml');
  } catch {
    return { valid: false, error: 'This is not valid XML.' };
  }

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    return { valid: false, error: 'Invalid SVG: the markup could not be parsed.' };
  }

  const root = doc.documentElement;
  if (!root || root.nodeName.toLowerCase() !== 'svg') {
    return { valid: false, error: 'The root element must be <svg>.' };
  }

  const viewBox = root.getAttribute('viewBox');
  const [, , vbWidth, vbHeight] = viewBox ? viewBox.trim().split(/[\s,]+/) : [];

  return {
    valid: true,
    error: null,
    width: root.getAttribute('width') || vbWidth || null,
    height: root.getAttribute('height') || vbHeight || null,
    viewBox,
  };
};

export const createSvgBlob = (code) =>
  new Blob([code], { type: 'image/svg+xml;charset=utf-8' });

export const sanitizeFileName = (name) => {
  const cleaned = (name || '').trim().replace(/\.svg$/i, '').replace(/[^\w\-. ]+/g, '-');
  return (cleaned || 'graphic').replace(/\s+/g, '-');
};

export const downloadSvg = (code, fileName = 'graphic') => {
  const url = URL.createObjectURL(createSvgBlob(code));
  triggerDownload(url, `${sanitizeFileName(fileName)}.svg`);
  URL.revokeObjectURL(url);
};

/** Rasterises the SVG to PNG at an optional scale factor. */
export const svgToPng = (code, { scale = 1 } = {}) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(createSvgBlob(code));
    const img = new Image();
    img.onload = () => {
      const { width, height } = inspectSvg(code);
      const baseWidth = img.naturalWidth || parseFloat(width) || 512;
      const baseHeight = img.naturalHeight || parseFloat(height) || 512;
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(Math.round(baseWidth * scale), 1);
      canvas.height = Math.max(Math.round(baseHeight * scale), 1);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) reject(new Error('Could not rasterise this SVG'));
        else resolve(blob);
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not render this SVG'));
    };
    img.src = url;
  });

export const downloadSvgAsPng = async (code, fileName = 'graphic', scale = 1) => {
  const blob = await svgToPng(code, { scale });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${sanitizeFileName(fileName)}.png`);
  URL.revokeObjectURL(url);
};
