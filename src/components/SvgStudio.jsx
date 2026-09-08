import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Check, Copy, Download, FileCode2, FolderOpen, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    createSvgBlob,
    downloadSvg,
    downloadSvgAsPng,
    inspectSvg,
} from '@/utils/svg';
import { formatSize } from '@/utils/format';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="100" height="100" rx="24" fill="url(#g)" />
  <path d="M40 62 L55 77 L82 45" fill="none" stroke="white" stroke-width="9"
        stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

const BACKGROUNDS = [
    { id: 'checker', label: 'Checker' },
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
];

const CHECKER_STYLE = {
    backgroundImage:
        'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
    backgroundSize: '16px 16px',
    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
    backgroundColor: '#ffffff',
};

const SvgStudio = () => {
    const [code, setCode] = useState(SAMPLE_SVG);
    const [fileName, setFileName] = useState('graphic');
    const [background, setBackground] = useState('checker');
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef(null);

    const info = useMemo(() => inspectSvg(code), [code]);

    // Render through a blob URL in an <img>: scripts and external refs inside
    // pasted SVG stay inert instead of running in the app's context.
    const previewUrl = useMemo(
        () => (info.valid ? URL.createObjectURL(createSvgBlob(code)) : null),
        [code, info.valid]
    );

    useEffect(() => () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    useEffect(() => {
        if (!copied) return undefined;
        const timer = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(timer);
    }, [copied]);

    const byteSize = useMemo(() => new Blob([code]).size, [code]);

    const handleLoadFile = (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setCode(String(reader.result));
            setFileName(file.name.replace(/\.svg$/i, ''));
            toast.success(`Loaded ${file.name}`);
        };
        reader.onerror = () => toast.error('Could not read that file');
        reader.readAsText(file);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            toast.success('SVG code copied');
        } catch {
            toast.error('Clipboard is not available in this browser');
        }
    };

    const handleDownloadSvg = () => {
        if (!info.valid) {
            toast.error(info.error);
            return;
        }
        downloadSvg(code, fileName);
        toast.success('SVG downloaded');
    };

    const handleDownloadPng = async () => {
        if (!info.valid) {
            toast.error(info.error);
            return;
        }
        try {
            await downloadSvgAsPng(code, fileName, 2);
            toast.success('PNG downloaded (2x)');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1.5">
                        <CardTitle className="text-slate-900">SVG Code</CardTitle>
                        <CardDescription className="text-slate-500">
                            Paste SVG markup or open an existing file.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".svg,image/svg+xml"
                            className="hidden"
                            onChange={handleLoadFile}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-300 text-slate-700 hover:bg-slate-100"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <FolderOpen size={15} className="mr-2" /> Open
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setCode('')}
                        >
                            <Trash2 size={15} className="mr-2" /> Clear
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                        placeholder="<svg xmlns='http://www.w3.org/2000/svg' ...>"
                        className="h-[340px] resize-none bg-slate-50 font-mono text-xs leading-relaxed text-slate-800"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                        {info.valid ? (
                            <Badge className="border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Valid SVG</Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600">Not rendering</Badge>
                        )}
                        <span className="text-xs text-slate-500">{formatSize(byteSize)}</span>
                        {info.valid && (info.width || info.height) && (
                            <span className="text-xs text-slate-500">
                                {info.width || '?'} × {info.height || '?'}
                            </span>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            onClick={handleCopy}
                            disabled={!code.trim()}
                        >
                            {copied ? <Check size={15} className="mr-2" /> : <Copy size={15} className="mr-2" />}
                            {copied ? 'Copied' : 'Copy code'}
                        </Button>
                    </div>
                    {!info.valid && info.error && (
                        <p className="text-xs text-red-600">{info.error}</p>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1.5">
                        <CardTitle className="text-slate-900">Live Preview</CardTitle>
                        <CardDescription className="text-slate-500">
                            Rendered safely in a sandboxed image.
                        </CardDescription>
                    </div>
                    <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                        {BACKGROUNDS.map(bg => (
                            <button
                                key={bg.id}
                                type="button"
                                onClick={() => setBackground(bg.id)}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${background === bg.id
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {bg.label}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div
                        className={`flex h-[340px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 p-6 ${background === 'dark' ? 'bg-slate-900' : ''
                            } ${background === 'light' ? 'bg-white' : ''}`}
                        style={background === 'checker' ? CHECKER_STYLE : undefined}
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="SVG preview"
                                className="max-h-full max-w-full object-contain"
                            />
                        ) : (
                            <div className="text-center text-slate-400">
                                <FileCode2 size={40} className="mx-auto mb-3" />
                                <p className="text-sm">{info.error || 'Nothing to preview yet.'}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex flex-1 items-center gap-2">
                            <Input
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="file name"
                                className="flex-1"
                            />
                            <span className="text-sm text-slate-400">.svg</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="border-slate-300 text-slate-700 hover:bg-slate-100"
                                onClick={handleDownloadPng}
                                disabled={!info.valid}
                            >
                                <ImageIcon size={16} className="mr-2" /> PNG
                            </Button>
                            <Button
                                className="bg-indigo-600 text-white hover:bg-indigo-700"
                                onClick={handleDownloadSvg}
                                disabled={!info.valid}
                            >
                                <Download size={16} className="mr-2" /> Download SVG
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SvgStudio;
