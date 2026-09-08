# Media Studio (WebP Converter)

A minimalist, high-performance client-side media converter built with **Vite**, **React 19**, **Tailwind CSS v4** and **shadcn/ui** (New York style, on top of Radix primitives).

![Screenshot](screenshot_placeholder.png)

## Features

- **Images → WebP**: Bulk convert PNG and JPG with a quality slider (HTML5 Canvas).
- **Video → WebM**: Convert MP4 and MOV clips with `MediaRecorder`, with live per-file
  progress. Encoding runs in real time (a 1-minute clip takes about a minute) and one
  clip is processed at a time.
- **SVG Studio**: Paste SVG code, preview it live on a checker/light/dark background,
  and download it as `.svg` or a 2x `.png`. Markup is rendered through a blob URL in an
  `<img>`, so scripts and external references inside pasted SVG stay inert.
- **Drag & Drop**: Intuitive file upload for both images and video.
- **ZIP Download**: Download all converted files in a single archive.
- **Analysis**: See size savings (original vs converted size).
- **Client-Side Only**: Nothing is ever uploaded to a server.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd webp-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Technology Stack

- **React 19**: UI library
- **Vite**: Build tool
- **Tailwind CSS v4**: Styling
- **shadcn/ui + Radix UI**: Component layer (`components.json`, `src/components/ui`)
- **lucide-react**: Icons
- **sonner**: Toasts
- **JSZip**: Bulk compression
- **Canvas API**: Image and SVG rasterisation
- **MediaRecorder API**: Video re-encoding

## Usage

**Images**
1. Drag PNG or JPG images into the dashed zone.
2. Click **Start Conversion**.
3. Download individual files or use **Download All (ZIP)**.

**Video**
1. Open the **Video** tab and drop MP4 or MOV clips in.
2. Click **Start Encoding** — progress is shown per clip while it plays back.
3. Download the resulting `.webm` files individually or as a ZIP.

Browser support: WebM recording needs Chrome, Edge or Firefox. Safari cannot record
WebM and the tab says so instead of failing silently.

**SVG**
1. Open the **SVG** tab, paste SVG markup (or use **Open** to load a `.svg` file).
2. Check the live preview, switch the backdrop, and fix errors reported under the editor.
3. Name the file and click **Download SVG** (or **PNG** for a 2x raster export).

## License

MIT
