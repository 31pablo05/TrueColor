# TrueColor - Color Extractor from Images

A fast, free, and open-source web app to extract and convert colors from images. Get HEX, RGB, and HSL values instantly with no signup required.

**Live**: https://truecolor.vercel.app/  
**Author**: Pablo Proboste

## Features

✅ **Extract Colors** - Click any pixel in an uploaded image to get its color  
✅ **Multiple Formats** - Display colors in HEX, RGB, and HSL  
✅ **Copy to Clipboard** - Quick copy buttons for each format  
✅ **Color History** - Automatic history tracking with localStorage  
✅ **Palette Manager** - Save and organize color palettes  
✅ **Dark/Light Theme** - Toggle theme with automatic persistence  
✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop  
✅ **No Signup Required** - 100% free, no account needed  
✅ **Privacy First** - All colors extracted locally in your browser

## Tech Stack

- **React** + **TypeScript** - UI components
- **Vite** - Fast build tool
- **Tailwind CSS** - Responsive styling
- **localStorage** - Persistent color history
- **Pointer Events API** - Touch/mouse handling

## Getting Started

### Development
```bash
npm install
npm run dev  # Start dev server at http://localhost:5173/
```

### Build
```bash
npm run build  # Creates optimized production build in dist/
npm run preview  # Preview production build locally
```

## Project Structure

```
src/
├── App.tsx              # Main component with color extraction logic
├── App.css              # Global styles, animations, responsive design
├── components/
│   ├── CanvasPicker.tsx    # Image canvas with color picking
│   ├── ColorPanel.tsx      # Display and copy color values
│   ├── ColorHistory.tsx    # Recent colors with delete options
│   ├── PaletteManager.tsx  # Save/manage color palettes
│   ├── Header.tsx          # Logo and theme toggle
│   ├── Footer.tsx          # Credits and links
│   └── Upload.tsx          # Image upload/URL input
├── hooks/
│   └── useLocalStorage.tsx # Custom hook for persistent storage
└── utils/
    └── colorUtils.ts       # Color conversion functions (HEX, RGB, HSL)

public/
├── robots.txt           # Search engine crawling directives
├── sitemap.xml          # URL index for Google
└── mascota/
    └── mascotaHongo.svg # App mascot image
```

## Color Conversions

Supported formats:
- **HEX**: `#FF5733`
- **RGB**: `rgb(255, 87, 51)` or `255, 87, 51`
- **HSL**: `hsl(9, 100%, 60%)`

All conversions are accurate to the pixel level.

## SEO & Performance

- ✅ JSON-LD structured data (SoftwareApplication, FAQPage)
- ✅ Open Graph & Twitter Card meta tags
- ✅ Mobile-optimized responsive design
- ✅ Fast Vite build (~3s production build)
- ✅ Gzipped assets (~60KB CSS, ~59KB JS)
- ✅ Google Site Verification enabled
- ✅ Sitemap and robots.txt for search indexing

**Current Search Status**:
- Google Search Console registered
- 71 impressions for "truecolor" keyword
- Optimization in progress for better ranking

See `SEO_ROADMAP.md` for detailed improvement plan.

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Free to use and modify.

## Contributing

Suggestions and feedback welcome!

---

**Want to improve TrueColor?** Check out `SEO_ROADMAP.md` for upcoming features and optimization roadmap.
