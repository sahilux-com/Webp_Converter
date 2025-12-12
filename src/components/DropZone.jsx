import React, { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';

export const DropZone = ({ onFilesAdded }) => {
    const [isDragActive, setIsDragActive] = useState(false);

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragActive(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragActive(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragActive(false);
        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type === 'image/jpeg' || file.type === 'image/png'
        );
        if (files.length > 0) {
            onFilesAdded(files);
        }
    }, [onFilesAdded]);

    const onFileInputChange = useCallback((e) => {
        const files = Array.from(e.target.files).filter(file =>
            file.type === 'image/jpeg' || file.type === 'image/png'
        );
        if (files.length > 0) {
            onFilesAdded(files);
        }
    }, [onFilesAdded]);

    return (
        <Card
            className={`
        relative border-2 border-dashed bg-slate-50/50 p-12 text-center cursor-pointer transition-all duration-300
        ${isDragActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                }
      `}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => document.getElementById('file-input').click()}
        >
            <input
                id="file-input"
                type="file"
                multiple
                accept="image/png, image/jpeg"
                onChange={onFileInputChange}
                className="hidden"
            />
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors duration-300 ${isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                <UploadCloud size={40} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Upload Files
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Drag & drop PNG or JPG images here, or click to browse files.
            </p>
        </Card>
    );
};
