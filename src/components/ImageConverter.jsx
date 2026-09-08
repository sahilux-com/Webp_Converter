import React, { useMemo, useState } from 'react';
import { DropZone } from '@/components/DropZone';
import FileTable from '@/components/FileTable';
import QualityControl from '@/components/QualityControl';
import { Button } from '@/components/ui/button';
import { convertToWebP, downloadZip } from '@/utils/converter';
import { useConversionQueue } from '@/hooks/useConversionQueue';
import { toast } from 'sonner';
import { Play } from 'lucide-react';

const ACCEPTED = ['image/jpeg', 'image/png'];

const ImageConverter = ({ onStatsChange }) => {
    const [quality, setQuality] = useState(0.8);
    const [isConverting, setIsConverting] = useState(false);
    const { files, addFiles, removeFile, runConversion } = useConversionQueue(onStatsChange);

    const hasConverted = useMemo(() => files.some(f => f.status === 'done'), [files]);

    const handleConvertAll = async () => {
        setIsConverting(true);
        toast.info('Conversion started...');
        await runConversion((file) => convertToWebP(file, quality));
        setIsConverting(false);
        toast.success('All files processed!');
    };

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
                <DropZone
                    onFilesAdded={addFiles}
                    accept="image/png, image/jpeg"
                    acceptedTypes={ACCEPTED}
                    title="Upload Images"
                    description="Drag & drop PNG or JPG images here, or click to browse files."
                />
                {files.length > 0 && (
                    <FileTable files={files} onRemove={removeFile} targetLabel="WebP" extension="webp" />
                )}
            </div>

            <div className="space-y-6">
                <QualityControl quality={quality} setQuality={setQuality} />

                <div className="flex flex-col gap-3">
                    <Button
                        size="lg"
                        className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                        onClick={handleConvertAll}
                        disabled={isConverting || files.length === 0}
                    >
                        {isConverting ? 'Processing...' : (
                            <>
                                <Play className="mr-2 h-4 w-4" /> Start Conversion
                            </>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
                        onClick={() => downloadZip(files)}
                        disabled={!hasConverted}
                    >
                        Download All (ZIP)
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ImageConverter;
