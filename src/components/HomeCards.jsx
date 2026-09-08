import React from 'react';
import { ArrowRight, Clapperboard, FileCode2, ImageIcon, Sparkles, Zap } from 'lucide-react';

/** Decorative artwork for the hero card, in the flat two-tone marketplace style. */
const HeroArt = () => (
    <svg viewBox="0 0 320 200" className="h-40 w-full max-w-[320px]" aria-hidden="true">
        <rect x="14" y="150" width="292" height="26" rx="13" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
        <circle cx="34" cy="163" r="9" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
        <circle cx="286" cy="163" r="9" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
        <g stroke="#0f172a" strokeWidth="3" strokeLinejoin="round">
            <rect x="52" y="96" width="52" height="52" rx="6" fill="#2563eb" />
            <rect x="128" y="74" width="52" height="74" rx="6" fill="#ffffff" />
            <rect x="204" y="52" width="52" height="96" rx="6" fill="#2563eb" />
        </g>
        <g stroke="#0f172a" strokeWidth="3" strokeLinecap="round">
            <path d="M236 34 v-14" />
            <path d="M256 42 l10 -10" />
            <path d="M214 42 l-10 -10" />
        </g>
    </svg>
);

const TOOLS = [
    {
        id: 'images',
        label: 'Images',
        title: 'PNG & JPG to WebP',
        description: 'Bulk convert with a quality slider and instant size savings.',
        icon: ImageIcon,
        tint: 'bg-amber-50 hover:bg-amber-100/80',
        iconTint: 'text-amber-600',
    },
    {
        id: 'videos',
        label: 'Video',
        title: 'MP4 & MOV to WebM',
        description: 'Re-encode clips in the browser, no upload and no server.',
        icon: Clapperboard,
        tint: 'bg-sky-50 hover:bg-sky-100/80',
        iconTint: 'text-sky-600',
    },
    {
        id: 'svg',
        label: 'SVG',
        title: 'SVG code to preview',
        description: 'Paste markup, see it live, download the SVG or a 2x PNG.',
        icon: FileCode2,
        tint: 'bg-emerald-50 hover:bg-emerald-100/80',
        iconTint: 'text-emerald-600',
    },
];

const HomeCards = ({ onNavigate, stats }) => (
    <div className="space-y-10">
        <div className="grid gap-6 lg:grid-cols-3">
            <button
                type="button"
                onClick={() => onNavigate('images')}
                className="group col-span-1 rounded-2xl bg-blue-50 p-8 text-left transition-colors hover:bg-blue-100/80 lg:col-span-2"
            >
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Sparkles size={16} className="text-blue-600" />
                    Media tools
                </div>
                <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="max-w-sm">
                        <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                            Ship lighter assets
                        </h3>
                        <p className="mt-3 text-slate-600">
                            Convert images, video and vector graphics right in your browser —
                            nothing ever leaves your machine.
                        </p>
                    </div>
                    <HeroArt />
                </div>
                <span className="mt-6 inline-flex items-center gap-2 font-medium text-slate-900">
                    Explore
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
            </button>

            <div className="rounded-2xl bg-slate-50 p-8">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Zap size={16} className="text-slate-500" />
                    This session
                </div>
                <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                    {stats.filesConverted} converted
                </h3>
                <p className="mt-3 text-slate-600">
                    {stats.spaceSaved} MB saved across {stats.currentBatch} queued file(s).
                    Everything is processed locally with the Canvas and MediaRecorder APIs.
                </p>
            </div>
        </div>

        <div>
            <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-600">All tools</h4>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {TOOLS.map(tool => (
                    <button
                        key={tool.id}
                        type="button"
                        onClick={() => onNavigate(tool.id)}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className={`flex h-40 items-center justify-center transition-colors ${tool.tint}`}>
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-sm">
                                <tool.icon size={28} className={tool.iconTint} />
                            </div>
                        </div>
                        <div className="space-y-1.5 p-5">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-slate-900">{tool.title}</span>
                                <ArrowRight
                                    size={16}
                                    className="text-slate-400 transition-transform group-hover:translate-x-1"
                                />
                            </div>
                            <p className="text-sm text-slate-500">{tool.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export default HomeCards;
