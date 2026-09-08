import { useCallback, useEffect, useRef, useState } from 'react';
import { formatSize } from '@/utils/format';
import { toast } from 'sonner';

const makeId = () => Math.random().toString(36).slice(2, 11);

/**
 * Shared queue state for the image and video converters: object URL lifecycle,
 * per-file status/progress, and reporting totals back to the dashboard.
 */
export const useConversionQueue = (onStatsChange) => {
    const [files, setFiles] = useState([]);
    const filesRef = useRef(files);

    useEffect(() => {
        filesRef.current = files;
        onStatsChange?.(files);
    }, [files, onStatsChange]);

    // Revoke every object URL still alive when the panel unmounts.
    useEffect(() => () => {
        filesRef.current.forEach(file => {
            if (file.preview) URL.revokeObjectURL(file.preview);
            if (file.convertedUrl) URL.revokeObjectURL(file.convertedUrl);
        });
    }, []);

    const addFiles = useCallback((newFiles) => {
        const queued = newFiles.map(file => ({
            id: makeId(),
            file,
            preview: URL.createObjectURL(file),
            status: 'pending',
            progress: null,
            error: null,
            convertedUrl: null,
            convertedBlob: null,
            originalSizeDisplay: formatSize(file.size),
        }));
        setFiles(prev => [...prev, ...queued]);
        toast.success(`${newFiles.length} file(s) added to queue`);
    }, []);

    const removeFile = useCallback((id) => {
        setFiles(prev => {
            const target = prev.find(f => f.id === id);
            if (target?.preview) URL.revokeObjectURL(target.preview);
            if (target?.convertedUrl) URL.revokeObjectURL(target.convertedUrl);
            return prev.filter(f => f.id !== id);
        });
    }, []);

    const clearAll = useCallback(() => {
        setFiles(prev => {
            prev.forEach(file => {
                if (file.preview) URL.revokeObjectURL(file.preview);
                if (file.convertedUrl) URL.revokeObjectURL(file.convertedUrl);
            });
            return [];
        });
    }, []);

    const patch = useCallback((id, changes) => {
        setFiles(prev => prev.map(f => (f.id === id ? { ...f, ...changes } : f)));
    }, []);

    /**
     * Runs `convert(file, { onProgress })` over every pending file.
     * `sequential` keeps video encoding one-at-a-time (it is real-time playback,
     * so parallel runs would starve each other).
     */
    const runConversion = useCallback(async (convert, { sequential = false } = {}) => {
        const pending = filesRef.current.filter(f => f.status !== 'done');

        const process = async (fileObj) => {
            patch(fileObj.id, { status: 'converting', progress: sequential ? 0 : null, error: null });
            try {
                const result = await convert(fileObj.file, {
                    onProgress: (value) => patch(fileObj.id, { progress: value }),
                });
                patch(fileObj.id, {
                    status: 'done',
                    progress: 1,
                    convertedUrl: result.url,
                    convertedBlob: result.blob,
                    size: result.size,
                    sizeDisplay: result.sizeDisplay,
                    originalSizeDisplay: result.originalSizeDisplay,
                });
            } catch (err) {
                console.error(err);
                patch(fileObj.id, { status: 'error', progress: null, error: err.message });
                toast.error(`Failed to convert ${fileObj.file.name}: ${err.message}`);
            }
        };

        if (sequential) {
            for (const fileObj of pending) {
                await process(fileObj);
            }
        } else {
            await Promise.all(pending.map(process));
        }
    }, [patch]);

    return { files, addFiles, removeFile, clearAll, runConversion };
};
