# WebP Image Converter

A minimalist, high-performance client-side image converter built with **Vite**, **React**, and **Tailwind CSS**.

![Screenshot](screenshot_placeholder.png)

## Features

- **Drag & Drop**: Intuitive file upload.
- **Client-Side Conversion**: Powered by HTML5 Canvas (Privacy-focused, no server uploads).
- **Bulk Processing**: Convert multiple images simultaneously.
- **ZIP Download**: Download all converted files in a single archive.
- **Analysis**: See size savings (Original vs WebP size).
- **Responsive**: Fully responsive dark mode UI.

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

- **React**: UI Library
- **Vite**: Build Tool
- **Tailwind CSS**: Styling
- **JSZip**: Bulk compression
- **Canvas API**: Image processing

## Usage

1. Drag PNG or JPG images into the dashed zone.
2. Click **Convert All** to start processing.
3. View the compression stats.
4. Download individual files or use **Download ZIP** for all.

## License

MIT
