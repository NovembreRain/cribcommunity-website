import type { Config } from 'tailwindcss'
import { colors, typography, spacing, borderRadius, shadows } from './src/lib/design-tokens'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colors from design tokens
      colors: {
        primary: colors.primary,
        accent: colors.accent,
        background: colors.background,
        surface: colors.surface,
        muted: colors.muted,
        sand: colors.sand,
        'dark-blue': colors.darkBlue,
        
        // Text colors
        'text-high': colors.textHigh,
        'text-medium': colors.textMedium,
        'text-low': colors.textLow,
        
        // Semantic colors
        success: colors.success,
        error: colors.error,
        warning: colors.warning,
        info: colors.info,
      },
      
      // Typography from design tokens
      fontFamily: {
        sans: ['var(--font-sans)', ...typography.fontFamily.body],
        serif: ['var(--font-serif)', ...typography.fontFamily.heading],
        heading: ['var(--font-serif)', ...typography.fontFamily.heading],
      },
      
      fontSize: {
        h1: [typography.fontSize.h1, { lineHeight: typography.lineHeight.tight }],
        h2: [typography.fontSize.h2, { lineHeight: typography.lineHeight.tight }],
        h3: [typography.fontSize.h3, { lineHeight: typography.lineHeight.normal }],
        h4: [typography.fontSize.h4, { lineHeight: typography.lineHeight.normal }],
        h5: [typography.fontSize.h5, { lineHeight: typography.lineHeight.normal }],
        h6: [typography.fontSize.h6, { lineHeight: typography.lineHeight.normal }],
        body: [typography.fontSize.body, { lineHeight: typography.lineHeight.relaxed }],
        'body-sm': [typography.fontSize.bodySmall, { lineHeight: typography.lineHeight.normal }],
        caption: [typography.fontSize.caption, { lineHeight: typography.lineHeight.normal }],
        tiny: [typography.fontSize.tiny, { lineHeight: typography.lineHeight.normal }],
      },
      
      // Spacing from design tokens (8px grid)
      spacing: {
        xs: spacing.xs,
        sm: spacing.sm,
        md: spacing.md,
        lg: spacing.lg,
        xl: spacing.xl,
        '2xl': spacing['2xl'],
        '3xl': spacing['3xl'],
      },
      
      // Border radius from design tokens
      borderRadius: {
        none: borderRadius.none,
        sm: borderRadius.sm,
        md: borderRadius.md,
        lg: borderRadius.lg,
        xl: borderRadius.xl,
        '2xl': borderRadius['2xl'],
        full: borderRadius.full,
      },
      
      // Box shadows from design tokens
      boxShadow: {
        sm: shadows.sm,
        md: shadows.md,
        lg: shadows.lg,
        xl: shadows.xl,
        '2xl': shadows['2xl'],
        inner: shadows.inner,
        none: shadows.none,
      },
      
      // Animation and transitions
      transitionDuration: {
        fast: '150ms',
        base: '300ms',
        slow: '500ms',
      },
    },
  },
  plugins: [],
}

export default config
