import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import StatsCards from '@/components/StatsCards';
import { DropZone } from '@/components/DropZone';
import FileTable from '@/components/FileTable';
import QualityControl from '@/components/QualityControl';
import { Button } from '@/components/ui/button'; // Adjust based on path
import { convertToWebP, downloadZip } from './utils/converter';
import { toast } from 'sonner';
import { Play } from 'lucide-react';

function App() {
  const [files, setFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(0.8);

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
        if (file.convertedUrl) URL.revokeObjectURL(file.convertedUrl);
      });
    };
  }, []);

  const handleFilesAdded = (newFiles) => {
    const newFileObjs = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      convertedUrl: null,
      convertedBlob: null
    }));
    setFiles(prev => [...prev, ...newFileObjs]);
    toast.success(`${newFiles.length} file(s) added to queue`);
  };

  const handleRemove = (id) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
      if (fileToRemove?.convertedUrl) URL.revokeObjectURL(fileToRemove.convertedUrl);
      return prev.filter(f => f.id !== id);
    });
  };

  const handleConvertAll = async () => {
    setIsConverting(true);
    toast.info('Conversion started...');

    const promises = files.map(async (fileObj) => {
      if (fileObj.status === 'done' || fileObj.status === 'error') return fileObj;

      setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'converting' } : f));

      try {
        const result = await convertToWebP(fileObj.file, quality); // Pass quality
        setFiles(prev => prev.map(f => f.id === fileObj.id ? {
          ...f,
          status: 'done',
          convertedUrl: result.url,
          convertedBlob: result.blob,
          size: result.size,
          sizeDisplay: result.sizeDisplay,
          originalSizeDisplay: result.originalSizeDisplay
        } : f));
      } catch (err) {
        console.error(err);
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error' } : f));
        toast.error(`Failed to convert ${fileObj.file.name}`);
      }
    });

    await Promise.all(promises);
    setIsConverting(false);
    toast.success('All files processed!');
  };

  const stats = useMemo(() => {
    const completed = files.filter(f => f.status === 'done');
    const totalFiles = completed.length;
    const savedBytes = completed.reduce((acc, curr) => {
      const original = curr.file.size;
      const converted = curr.size;
      return acc + (original - converted);
    }, 0);
    const savedMB = (savedBytes / (1024 * 1024)).toFixed(2);

    return {
      filesConverted: totalFiles,
      spaceSaved: savedMB,
      currentBatch: files.length
    };
  }, [files]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Converter Dashboard</h2>
          <p className="text-slate-500">Manage and convert your image assets.</p>
        </div>

        <StatsCards stats={stats} />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <DropZone onFilesAdded={handleFilesAdded} />
            {files.length > 0 && <FileTable files={files} onRemove={handleRemove} />}
          </div>

          <div className="space-y-6">
            <QualityControl quality={quality} setQuality={setQuality} />

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
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
                disabled={files.length === 0 || !files.some(f => f.status === 'done')}
              >
                Download All (ZIP)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default App;
