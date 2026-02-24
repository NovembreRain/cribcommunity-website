/**
 * Design Tokens - Travellers Next v2
 * Source of truth for all design values
 * Never use raw values in components - always reference these tokens
 */

export const colors = {
  // Primary & Accent
  primary: '#E67E22',      // Fire Orange - main brand color
  accent: '#E67E22',       // Fire Orange - actions, highlights
  
  // Backgrounds
  background: '#0A0E14',   // Midnight - main page background
  surface: '#151922',      // Dark Blue - cards, containers
  
  // Text Colors
  textHigh: '#D1D1D1',     // Light Gray - primary text
  textMedium: '#8E8E8E',   // Medium Gray - secondary text
  textLow: '#8C6A43',      // Brown/Sand - tertiary text, hints
  
  // Utility
  muted: '#8E8E8E',        // Medium Gray - disabled, placeholders
  sand: '#8C6A43',         // Brown/Sand - decorative accent
  darkBlue: '#151922',     // Dark Blue - alternative surface
  
  // Semantic colors (can be expanded later)
  success: '#27AE60',
  error: '#E74C3C',
  warning: '#F39C12',
  info: '#3498DB',
} as const;

export const typography = {
  fontFamily: {
    heading: ['Playfair Display', 'serif'],
    body: ['Outfit', 'sans-serif'],
  },
  fontSize: {
    // Headings
    h1: '64px',
    h2: '48px',
    h3: '32px',
    h4: '24px',
    h5: '20px',
    h6: '18px',
    
    // Body
    body: '18px',
    bodySmall: '16px',
    caption: '14px',
    tiny: '12px',
  },
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75',
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const spacing = {
  // 8px grid system base
  base: 8,
  
  // Helper function for consistent spacing
  scale: (multiplier: number) => `${8 * multiplier}px`,
  
  // Common spacing values (in px)
  xs: '8px',    // 1x
  sm: '16px',   // 2x
  md: '24px',   // 3x
  lg: '32px',   // 4x
  xl: '48px',   // 6x
  '2xl': '64px',  // 8x
  '3xl': '96px',  // 12x
} as const;

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Transition presets
export const transitions = {
  fast: '150ms ease-in-out',
  base: '300ms ease-in-out',
  slow: '500ms ease-in-out',
} as const;

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;
