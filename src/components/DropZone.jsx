import React, { useCallback, useId, useState } from 'react';
import { Card } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';

const DEFAULT_TYPES = ['image/jpeg', 'image/png'];

export const DropZone = ({
    onFilesAdded,
    accept = 'image/png, image/jpeg',
    acceptedTypes = DEFAULT_TYPES,
    title = 'Upload Files',
    description = 'Drag & drop PNG or JPG images here, or click to browse files.',
    icon = UploadCloud,
}) => {
    const Icon = icon;
    const [isDragActive, setIsDragActive] = useState(false);
    const inputId = useId();

    const filterFiles = useCallback(
        (list) => Array.from(list).filter(file =>
            acceptedTypes.some(type =>
                type.endsWith('/*')
                    ? file.type.startsWith(type.slice(0, -1))
                    : file.type === type || file.name.toLowerCase().endsWith(type)
            )
        ),
        [acceptedTypes]
    );

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
        const files = filterFiles(e.dataTransfer.files);
        if (files.length > 0) onFilesAdded(files);
    }, [filterFiles, onFilesAdded]);

    const onFileInputChange = useCallback((e) => {
        const files = filterFiles(e.target.files);
        if (files.length > 0) onFilesAdded(files);
        e.target.value = '';
    }, [filterFiles, onFilesAdded]);

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
            onClick={() => document.getElementById(inputId)?.click()}
        >
            <input
                id={inputId}
                type="file"
                multiple
                accept={accept}
                onChange={onFileInputChange}
                className="hidden"
            />
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors duration-300 ${isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                <Icon size={40} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {title}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                {description}
            </p>
        </Card>
    );
};
