import React, { useMemo, useState } from 'react';
import { DropZone } from '@/components/DropZone';
import FileTable from '@/components/FileTable';
import QualityControl from '@/components/QualityControl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { convertToWebM, downloadVideoZip, isWebMSupported } from '@/utils/videoConverter';
import { useConversionQueue } from '@/hooks/useConversionQueue';
import { toast } from 'sonner';
import { AlertTriangle, Clapperboard, Play } from 'lucide-react';

const ACCEPTED = ['video/mp4', 'video/quicktime', 'video/webm', '.mov', '.mp4'];

const VideoConverter = ({ onStatsChange }) => {
    const [quality, setQuality] = useState(0.8);
    const [isConverting, setIsConverting] = useState(false);
    const { files, addFiles, removeFile, runConversion } = useConversionQueue(onStatsChange);
    const supported = useMemo(() => isWebMSupported(), []);

    const hasConverted = useMemo(() => files.some(f => f.status === 'done'), [files]);

    const handleConvertAll = async () => {
        setIsConverting(true);
        toast.info('Encoding runs in real time — sit tight.');
        // One clip at a time: encoding is driven by actual playback.
        await runConversion(
            (file, { onProgress }) => convertToWebM(file, { quality, onProgress }),
            { sequential: true }
        );
        setIsConverting(false);
        toast.success('All videos processed!');
    };

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
                <DropZone
                    onFilesAdded={addFiles}
                    accept="video/mp4, video/quicktime, video/webm, .mov, .mp4"
                    acceptedTypes={ACCEPTED}
                    title="Upload Videos"
                    description="Drag & drop MP4 or MOV clips here, or click to browse files."
                    icon={Clapperboard}
                />
                {files.length > 0 && (
                    <FileTable
                        files={files}
                        onRemove={removeFile}
                        title="Encoding Queue"
                        kind="video"
                        targetLabel="WebM"
                        extension="webm"
                    />
                )}
            </div>

            <div className="space-y-6">
                <QualityControl
                    quality={quality}
                    setQuality={setQuality}
                    title="Bitrate Settings"
                    description="Higher quality means a larger WebM file."
                    hint="Encoding happens in real time, so a 1-minute clip takes about a minute."
                />

                {!supported && (
                    <Card className="border-amber-200 bg-amber-50 shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <CardTitle className="text-sm font-medium text-amber-800">
                                Not supported here
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-amber-700">
                                This browser cannot record WebM. Try Chrome, Edge or Firefox.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="flex flex-col gap-3">
                    <Button
                        size="lg"
                        className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                        onClick={handleConvertAll}
                        disabled={isConverting || files.length === 0 || !supported}
                    >
                        {isConverting ? 'Encoding...' : (
                            <>
                                <Play className="mr-2 h-4 w-4" /> Start Encoding
                            </>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
                        onClick={() => downloadVideoZip(files)}
                        disabled={!hasConverted}
                    >
                        Download All (ZIP)
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VideoConverter;
