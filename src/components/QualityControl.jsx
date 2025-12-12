import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';

const QualityControl = ({ quality, setQuality }) => {
    return (
        <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-slate-900">Quality Settings</CardTitle>
                <CardDescription className="text-slate-500">Adjust the compression level (0.1 - 1.0)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-slate-700">Quality</Label>
                    <span className="text-sm font-mono text-sky-600">{Math.round(quality * 100)}%</span>
                </div>
                <Slider
                    value={[quality]}
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    onValueChange={(vals) => setQuality(vals[0])}
                    className="py-4"
                />
                <p className="text-xs text-slate-500">
                    Lower quality results in smaller file sizes but may introduce artifacts.
                </p>
            </CardContent>
        </Card>
    );
};

export default QualityControl;
