// ====================================================
// GRID SYSTEM TYPES - PRODUCTION READY
// ====================================================

export type AspectRatio = '4:6' | '2:3' | '1:1' | '16:9';

export type GridSlot = {
  id: string;
  x: number;        // percentage (0-100)
  y: number;        // percentage (0-100)
  width: number;    // percentage (0-100)
  height: number;   // percentage (0-100)
  radius?: number;  // border radius in pixels
  zIndex?: number;  // layer order
};

export type GridTemplate = {
  id: string;
  name: string;
  stillCount: number;    // Number of photos required
  price: number;         // Price in INR
  aspectRatio: AspectRatio;
  canvasWidth: number;   // pixels at 300 DPI
  canvasHeight: number;  // pixels at 300 DPI
  previewType: 'grid' | 'strip' | 'collage';
  backgroundColor?: string;
  backgroundImage?: string;
  logo?: {
    url: string;
    x: number;      // percentage
    y: number;      // percentage
    width: number;  // percentage
    height: number; // percentage
  };
  slots: GridSlot[];
  isEnabled: boolean;    // Admin can disable
  sortOrder: number;     // Display order
  createdAt: number;
  updatedAt: number;
};

export type GridRenderOptions = {
  dpi?: number;           // default 300
  quality?: number;       // 0-1, default 0.95
  format?: 'png' | 'jpeg';
  includeBackground?: boolean;
  includeLogo?: boolean;
};

export type GridPreviewData = {
  gridId: string;
  photos: string[];  // base64 data URLs
  timestamp: number;
};

// ====================================================
// ASPECT RATIO CONFIGURATIONS
// ====================================================

export const ASPECT_RATIOS: Record<AspectRatio, { width: number; height: number; label: string }> = {
  '4:6': { width: 4, height: 6, label: '4x6 Photo Print' },
  '2:3': { width: 2, height: 3, label: '2x3 Wallet Size' },
  '1:1': { width: 1, height: 1, label: 'Square (Instagram)' },
  '16:9': { width: 16, height: 9, label: 'Widescreen' },
};

// ====================================================
// DPI CONFIGURATIONS
// ====================================================

export const DPI_PRESETS = {
  SCREEN: 72,
  PRINT_DRAFT: 150,
  PRINT_STANDARD: 300,
  PRINT_HIGH: 600,
} as const;

// ====================================================
// FIXED GRID TEMPLATES - PRODUCTION FINAL
// ====================================================
// These grid layouts are FIXED and FINAL.
// NO modifications allowed - no resizing, rearranging, adding, or removing slots.
// Same layouts used for preview, print, and QR output.
// All grids are 300 DPI print-ready.

export const FIXED_GRID_TEMPLATES: GridTemplate[] = [
  // 1️⃣ 2×6 Inch – Vertical Strip (2 Photos)
  {
    id: 'strip_2x6_2photos',
    name: '2×6" Vertical Strip',
    stillCount: 2,
    price: 70,
    aspectRatio: '2:3',
    canvasWidth: 600,   // 2 inches × 300 DPI
    canvasHeight: 1800, // 6 inches × 300 DPI
    previewType: 'strip',
    backgroundColor: '#ffffff',
    slots: [
      // Top photo
      { id: 's1', x: 5, y: 5, width: 90, height: 45, radius: 0, zIndex: 1 },
      // Bottom photo
      { id: 's2', x: 5, y: 50, width: 90, height: 45, radius: 0, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // 2️⃣ 2×6 Inch – Vertical Strip (4 Photos – Duplicate)
  {
    id: 'strip_2x6_4photos_duplicate',
    name: '2×6" Duplicate Strips',
    stillCount: 4,
    price: 100,
    aspectRatio: '4:6',
    canvasWidth: 1200,  // 4 inches × 300 DPI (two 2" strips side-by-side)
    canvasHeight: 1800, // 6 inches × 300 DPI
    previewType: 'strip',
    backgroundColor: '#ffffff',
    slots: [
      // Left strip - top photo
      { id: 's1', x: 2.5, y: 5, width: 45, height: 45, radius: 0, zIndex: 1 },
      // Left strip - bottom photo
      { id: 's2', x: 2.5, y: 50, width: 45, height: 45, radius: 0, zIndex: 1 },
      // Right strip - top photo (duplicate of s1)
      { id: 's3', x: 52.5, y: 5, width: 45, height: 45, radius: 0, zIndex: 1 },
      // Right strip - bottom photo (duplicate of s2)
      { id: 's4', x: 52.5, y: 50, width: 45, height: 45, radius: 0, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // 3️⃣ 4×6 Inch – Single Photo
  {
    id: 'single_4x6',
    name: '4×6" Single Photo',
    stillCount: 1,
    price: 50,
    aspectRatio: '4:6',
    canvasWidth: 1200,  // 4 inches × 300 DPI
    canvasHeight: 1800, // 6 inches × 300 DPI
    previewType: 'grid',
    backgroundColor: '#ffffff',
    slots: [
      // Single photo fills entire frame
      { id: 's1', x: 0, y: 0, width: 100, height: 100, radius: 0, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 3,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // 4️⃣ 4×6 Inch – Grid (4 Photos)
  {
    id: 'grid_4x6_2x2',
    name: '4×6" Grid (2×2)',
    stillCount: 4,
    price: 100,
    aspectRatio: '4:6',
    canvasWidth: 1200,  // 4 inches × 300 DPI
    canvasHeight: 1800, // 6 inches × 300 DPI
    previewType: 'grid',
    backgroundColor: '#ffffff',
    slots: [
      // Top-left
      { id: 's1', x: 2.5, y: 2.5, width: 45, height: 45, radius: 0, zIndex: 1 },
      // Top-right
      { id: 's2', x: 52.5, y: 2.5, width: 45, height: 45, radius: 0, zIndex: 1 },
      // Bottom-left
      { id: 's3', x: 2.5, y: 52.5, width: 45, height: 45, radius: 0, zIndex: 1 },
      // Bottom-right
      { id: 's4', x: 52.5, y: 52.5, width: 45, height: 45, radius: 0, zIndex: 1 },
    ],
    isEnabled: true,
    sortOrder: 4,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Export as MOCK_GRID_TEMPLATES for backward compatibility
export const MOCK_GRID_TEMPLATES = FIXED_GRID_TEMPLATES;
