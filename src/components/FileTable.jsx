import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Download, X } from 'lucide-react';
import { stripExtension, triggerDownload } from '@/utils/format';

const Thumbnail = ({ fileObj, kind }) => (
    <div className="w-10 h-10 rounded bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
        {kind === 'video' ? (
            <video src={fileObj.preview} muted playsInline preload="metadata" className="w-full h-full object-cover" />
        ) : (
            <img src={fileObj.preview} alt="" className="w-full h-full object-cover" />
        )}
    </div>
);

const FileTable = ({
    files,
    onRemove,
    title = 'Processing Queue',
    kind = 'image',
    targetLabel = 'WebP',
    extension = 'webp',
}) => {
    return (
        <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-slate-900">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-200 hover:bg-slate-50">
                            <TableHead className="w-[300px] text-slate-500">File Name</TableHead>
                            <TableHead className="text-slate-500">Original Size</TableHead>
                            <TableHead className="text-slate-500">{targetLabel} Size</TableHead>
                            <TableHead className="text-slate-500">Reduction</TableHead>
                            <TableHead className="text-slate-500">Status</TableHead>
                            <TableHead className="text-right text-slate-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {files.map((fileObj) => (
                            <TableRow key={fileObj.id} className="border-slate-200 hover:bg-slate-50">
                                <TableCell className="font-medium text-slate-900">
                                    <div className="flex items-center gap-3">
                                        <Thumbnail fileObj={fileObj} kind={kind} />
                                        <span className="truncate max-w-[200px]" title={fileObj.file.name}>
                                            {fileObj.file.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-500">{fileObj.originalSizeDisplay}</TableCell>
                                <TableCell className="text-sky-600 font-medium">
                                    {fileObj.sizeDisplay || '-'}
                                </TableCell>
                                <TableCell className={fileObj.size > fileObj.file.size ? 'text-orange-600' : 'text-emerald-600'}>
                                    {fileObj.size && fileObj.file.size ? Math.round((1 - fileObj.size / fileObj.file.size) * 100) + '%' : '-'}
                                </TableCell>
                                <TableCell>
                                    {fileObj.status === 'pending' && <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">Pending</Badge>}
                                    {fileObj.status === 'converting' && (
                                        <div className="flex flex-col gap-1.5 min-w-[110px]">
                                            <Badge variant="outline" className="border-sky-500 text-sky-600 w-fit">
                                                {typeof fileObj.progress === 'number'
                                                    ? `Encoding ${Math.round(fileObj.progress * 100)}%`
                                                    : 'Processing'}
                                            </Badge>
                                            {typeof fileObj.progress === 'number' && (
                                                <Progress value={fileObj.progress * 100} className="h-1.5" />
                                            )}
                                        </div>
                                    )}
                                    {fileObj.status === 'done' && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">Done</Badge>}
                                    {fileObj.status === 'error' && (
                                        <Badge variant="destructive" title={fileObj.error || undefined}>Error</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {fileObj.status === 'done' && fileObj.convertedUrl && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    triggerDownload(
                                                        fileObj.convertedUrl,
                                                        `${stripExtension(fileObj.file.name)}.${extension}`
                                                    );
                                                }}
                                            >
                                                <Download size={16} />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => onRemove(fileObj.id)}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default FileTable;
