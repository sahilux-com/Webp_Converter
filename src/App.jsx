import React, { useCallback, useMemo, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import StatsCards from '@/components/StatsCards';
import HomeCards from '@/components/HomeCards';
import ImageConverter from '@/components/ImageConverter';
import VideoConverter from '@/components/VideoConverter';
import SvgStudio from '@/components/SvgStudio';

const VIEWS = [
  { id: 'home', label: 'Discover', heading: 'Discover', subheading: 'Pick a tool to get started.' },
  { id: 'images', label: 'Images', heading: 'Image Converter', subheading: 'Convert PNG and JPG assets to WebP.' },
  { id: 'videos', label: 'Video', heading: 'Video Converter', subheading: 'Re-encode MP4 and MOV clips to WebM.' },
  { id: 'svg', label: 'SVG', heading: 'SVG Studio', subheading: 'Preview SVG code and download the file.' },
];

const emptyTotals = { filesConverted: 0, savedBytes: 0, queued: 0 };

const totalsFrom = (files) => {
  const completed = files.filter(f => f.status === 'done');
  return {
    filesConverted: completed.length,
    savedBytes: completed.reduce((acc, curr) => acc + (curr.file.size - (curr.size || 0)), 0),
    queued: files.length,
  };
};

function App() {
  const [view, setView] = useState('home');
  const [imageTotals, setImageTotals] = useState(emptyTotals);
  const [videoTotals, setVideoTotals] = useState(emptyTotals);

  const handleImageStats = useCallback((files) => setImageTotals(totalsFrom(files)), []);
  const handleVideoStats = useCallback((files) => setVideoTotals(totalsFrom(files)), []);

  const stats = useMemo(() => {
    const savedBytes = imageTotals.savedBytes + videoTotals.savedBytes;
    return {
      filesConverted: imageTotals.filesConverted + videoTotals.filesConverted,
      spaceSaved: (Math.max(savedBytes, 0) / (1024 * 1024)).toFixed(2),
      currentBatch: imageTotals.queued + videoTotals.queued,
    };
  }, [imageTotals, videoTotals]);

  const active = VIEWS.find(v => v.id === view) ?? VIEWS[0];

  return (
    <DashboardLayout activeView={view} onNavigate={setView}>
      <div className="flex flex-col gap-8">
        <nav className="flex flex-wrap items-center gap-6 border-b border-slate-200 pb-1">
          {VIEWS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`-mb-px border-b-2 pb-3 text-2xl font-semibold tracking-tight transition-colors ${view === item.id
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {view !== 'home' && (
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{active.heading}</h2>
            <p className="text-slate-500">{active.subheading}</p>
          </div>
        )}

        {view === 'home' && <HomeCards onNavigate={setView} stats={stats} />}

        {view !== 'home' && view !== 'svg' && <StatsCards stats={stats} />}

        {/* Both converters stay mounted so queues survive tab switches. */}
        <div hidden={view !== 'images'}>
          <ImageConverter onStatsChange={handleImageStats} />
        </div>
        <div hidden={view !== 'videos'}>
          <VideoConverter onStatsChange={handleVideoStats} />
        </div>
        {view === 'svg' && <SvgStudio />}
      </div>
    </DashboardLayout>
  );
}

export default App;
