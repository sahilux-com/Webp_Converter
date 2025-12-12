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
import { Download, X, Loader2 } from 'lucide-react';

const Spinner = () => <Loader2 className="h-4 w-4 animate-spin text-sky-500" />;

const FileTable = ({ files, onRemove }) => {
    return (
        <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-slate-900">Processing Queue</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-200 hover:bg-slate-50">
                            <TableHead className="w-[300px] text-slate-500">File Name</TableHead>
                            <TableHead className="text-slate-500">Original Size</TableHead>
                            <TableHead className="text-slate-500">WebP Size</TableHead>
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
                                        <div className="w-10 h-10 rounded bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                                            <img src={fileObj.preview} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="truncate max-w-[200px]" title={fileObj.file.name}>
                                            {fileObj.file.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-500">{fileObj.originalSizeDisplay}</TableCell>
                                <TableCell className="text-sky-600 font-medium">
                                    {fileObj.sizeDisplay || '-'}
                                </TableCell>
                                <TableCell className="text-emerald-600">
                                    {fileObj.size && fileObj.file.size ? Math.round((1 - fileObj.size / fileObj.file.size) * 100) + '%' : '-'}
                                </TableCell>
                                <TableCell>
                                    {fileObj.status === 'pending' && <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">Pending</Badge>}
                                    {fileObj.status === 'converting' && <Badge variant="outline" className="border-sky-500 text-sky-600">Processing</Badge>}
                                    {fileObj.status === 'done' && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">Done</Badge>}
                                    {fileObj.status === 'error' && <Badge variant="destructive">Error</Badge>}
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
                                                    const link = document.createElement('a');
                                                    link.href = fileObj.convertedUrl;
                                                    link.download = `${fileObj.file.name.substring(0, fileObj.file.name.lastIndexOf('.')) || fileObj.file.name}.webp`;
                                                    // Append to body is crucial for Firefox
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
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
