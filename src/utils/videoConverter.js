import JSZip from 'jszip';
import { formatSize, stripExtension } from './format';

const VIDEO_MIME_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8,opus',
  'video/webm;codecs=vp8',
  'video/webm',
];

/**
 * Picks the best WebM mime type the current browser can actually record.
 * Returns null when MediaRecorder cannot produce WebM at all (e.g. Safari).
 */
export const getSupportedWebMMime = () => {
  if (typeof MediaRecorder === 'undefined') return null;
  return VIDEO_MIME_CANDIDATES.find(type => MediaRecorder.isTypeSupported(type)) || null;
};

export const isWebMSupported = () => getSupportedWebMMime() !== null;

const captureStream = (video) => {
  if (typeof video.captureStream === 'function') return video.captureStream();
  if (typeof video.mozCaptureStream === 'function') return video.mozCaptureStream();
  throw new Error('This browser cannot capture video streams');
};

/**
 * Derives a video bitrate from the 0.1 - 1.0 quality slider, scaled by the
 * frame size so a 4K clip is not encoded at the same budget as a thumbnail.
 */
const bitrateFor = (width, height, quality) => {
  const pixels = Math.max(width * height, 1);
  return Math.min(Math.max(Math.round(pixels * 3 * quality), 400_000), 25_000_000);
};

/**
 * Converts MP4 / MOV (or any file the browser can decode) to WebM by playing it
 * back muted and re-encoding the captured stream with MediaRecorder.
 * Encoding runs in real time, so a 30s clip takes roughly 30s.
 */
export const convertToWebM = (file, { quality = 0.8, onProgress } = {}) => {
  return new Promise((resolve, reject) => {
    const mimeType = getSupportedWebMMime();
    if (!mimeType) {
      reject(new Error('WebM recording is not supported in this browser'));
      return;
    }

    const sourceUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = sourceUrl;
    video.muted = true;
    video.playsInline = true;
    // Note: leaving preload at its default matters — forcing 'auto' makes
    // Chromium reset the decoder mid-capture and MediaRecorder aborts with
    // "Encoding failed".

    let recorder = null;
    let settled = false;
    const chunks = [];

    const cleanup = () => {
      video.removeAttribute('src');
      video.load();
      URL.revokeObjectURL(sourceUrl);
    };

    const fail = (error) => {
      if (settled) return;
      settled = true;
      try {
        if (recorder && recorder.state !== 'inactive') recorder.stop();
      } catch {
        /* recorder already torn down */
      }
      cleanup();
      reject(error instanceof Error ? error : new Error('Video conversion failed'));
    };

    video.onerror = () => fail(new Error('Could not decode this video file'));

    video.onloadedmetadata = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      if (!width || !height) {
        fail(new Error('Video has no visual track'));
        return;
      }

      let stream;
      try {
        stream = captureStream(video);
      } catch (err) {
        fail(err);
        return;
      }

      try {
        recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: bitrateFor(width, height, quality),
        });
      } catch (err) {
        fail(err);
        return;
      }

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunks.push(event.data);
      };

      recorder.onerror = (event) => fail(event?.error || new Error('Recording failed'));

      recorder.onstop = () => {
        if (settled) return;
        settled = true;
        stream.getTracks().forEach(track => track.stop());
        cleanup();

        const blob = new Blob(chunks, { type: 'video/webm' });
        if (blob.size === 0) {
          reject(new Error('Conversion produced an empty file'));
          return;
        }
        onProgress?.(1);
        resolve({
          url: URL.createObjectURL(blob),
          blob,
          size: blob.size,
          sizeDisplay: formatSize(blob.size),
          originalSizeDisplay: formatSize(file.size),
          width,
          height,
          duration: Number.isFinite(video.duration) ? video.duration : null,
        });
      };

      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : null;
      video.ontimeupdate = () => {
        if (duration) onProgress?.(Math.min(video.currentTime / duration, 0.99));
      };
      video.onended = () => {
        if (recorder && recorder.state !== 'inactive') recorder.stop();
      };

      recorder.start(250);
      video.play().catch(fail);
    };
  });
};

export const downloadVideoZip = async (files, zipName = 'converted_videos.zip') => {
  const zip = new JSZip();
  const converted = files.filter(f => f.status === 'done' && f.convertedBlob);
  if (converted.length === 0) return;

  converted.forEach(fileObj => {
    zip.file(`${stripExtension(fileObj.file.name)}.webm`, fileObj.convertedBlob);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = zipName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
