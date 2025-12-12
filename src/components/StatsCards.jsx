import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, HardDrive, Layers } from 'lucide-react';

const StatsCards = ({ stats }) => {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">
                        Files Converted
                    </CardTitle>
                    <FileImage className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{stats.filesConverted}</div>
                    <p className="text-xs text-slate-500">
                        +12% from last session
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">
                        Space Saved
                    </CardTitle>
                    <HardDrive className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{stats.spaceSaved} MB</div>
                    <p className="text-xs text-slate-500">
                        Avg. 45% reduction
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">
                        Current Batch
                    </CardTitle>
                    <Layers className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{stats.currentBatch}</div>
                    <p className="text-xs text-slate-500">
                        Images queued
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatsCards;
