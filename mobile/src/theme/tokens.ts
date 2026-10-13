/**
 * NeuroAI mobile design tokens.
 *
 * Visual identity: warm ivory + muted lavender / deep plum (light theme)
 * and deep charcoal-plum surfaces with lavender accents (dark theme).
 * Token names are semantic and palette-agnostic (primary / accent /
 * highlight) so the brand palette can evolve without touching screens.
 *
 * Contrast notes (light): primaryPressed text on background ≈ 10:1,
 * onPrimary on primaryPressed ≈ 11:1, accentText (plum) on accentSoft
 * (lavender) ≈ 6.8:1. Contrast notes (dark): primary on surface ≈ 7.4:1,
 * onPrimary on primary ≈ 8.8:1, accentText on accentSoft ≈ 6.1:1.
 *
 * Amber marks demonstration content; muted pink is reserved for sparing
 * EEG-related highlights. Green/blue appear only as semantic status
 * colours (e.g. success), never as primary UI colours.
 *
 * This file contains design tokens ONLY. No clinical meaning is attached
 * to any colour, label, or value defined here.
 */

import { Platform, TextStyle, ViewStyle } from 'react-native';

export type ThemeName = 'light' | 'dark';

/** User preference: follow the OS, or force one theme. */
export type ThemePreference = 'system' | ThemeName;

export interface ThemeColors {
  /** App background behind all content. */
  background: string;
  /** Default card / sheet surface. */
  surface: string;
  /** Slightly tinted surface for nested blocks. */
  surfaceAlt: string;
  /** Recessed surface (input fills, code blocks). */
  surfaceSunken: string;

  border: string;
  borderStrong: string;

  text: string;
  textMuted: string;
  textFaint: string;

  /** Deep plum — primary actions and identity accents. */
  primary: string;
  /** Deeper plum for button fills and primary text (AA on surfaces). */
  primaryPressed: string;
  /** Content rendered on top of primary fills. */
  onPrimary: string;

  /** Muted lavender accent: focus rings, accent borders, icon tints. */
  accent: string;
  /** Soft lavender surface for icon/avatar backgrounds and info notices. */
  accentSoft: string;
  /** Text/icon colour that sits on accentSoft (AA verified). */
  accentText: string;

  /** Muted pink — EEG-related highlights, used sparingly. */
  highlight: string;
  highlightSoft: string;
  highlightText: string;

  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;

  /** Amber used exclusively to mark demonstration (mock) content. */
  mock: string;
  mockSoft: string;
  mockBorder: string;

  /** Waveform + chart strokes. */
  chartGrid: string;
  chartTrace: string;
  chartTraceAlt: string;

  shadowColor: string;
  /** Scrim behind modals / tab bar presses. */
  overlay: string;
}

export const lightColors: ThemeColors = {
  background: '#F7F5F8',
  surface: '#FFFFFF',
  surfaceAlt: '#EFEBF3',
  surfaceSunken: '#E9E4EE',

  border: '#E1DBE6',
  borderStrong: '#CFC6D8',

  text: '#292630',
  textMuted: '#6A6375',
  textFaint: '#756E7E',

  primary: '#554466',
  primaryPressed: '#463653',
  onPrimary: '#FFFFFF',

  accent: '#A395BD',
  accentSoft: '#E8E0F0',
  accentText: '#554466',

  highlight: '#C99BAB',
  highlightSoft: '#F6E9EE',
  highlightText: '#9C5675',

  success: '#35714B',
  successSoft: '#E3EFE7',
  warning: '#8C5E12',
  warningSoft: '#FBF1DC',
  danger: '#B03A52',
  dangerSoft: '#FBE9ED',

  mock: '#8A5A00',
  mockSoft: '#FBF1DC',
  mockBorder: '#E0C48A',

  chartGrid: '#E1DBE6',
  chartTrace: '#554466',
  chartTraceAlt: '#B0789A',

  shadowColor: '#2B2431',
  overlay: 'rgba(33, 30, 37, 0.45)',
};

export const darkColors: ThemeColors = {
  background: '#211E25',
  surface: '#302A35',
  surfaceAlt: '#39313F',
  surfaceSunken: '#282330',

  border: '#49414F',
  borderStrong: '#5C5268',

  text: '#F5F1F7',
  textMuted: '#B9B0C1',
  textFaint: '#8F8698',

  primary: '#C5B8D9',
  primaryPressed: '#B3A4C9',
  onPrimary: '#211E25',

  accent: '#6B5C7D',
  accentSoft: '#403648',
  accentText: '#C5B8D9',

  highlight: '#D4A0B5',
  highlightSoft: '#3A2A32',
  highlightText: '#E3B3C6',

  success: '#7FC79E',
  successSoft: '#1C3226',
  warning: '#E5B25F',
  warningSoft: '#382D15',
  danger: '#F0899B',
  dangerSoft: '#3E2028',

  mock: '#EFCB7A',
  mockSoft: '#3A3018',
  mockBorder: '#6F5A24',

  chartGrid: '#49414F',
  chartTrace: '#C5B8D9',
  chartTraceAlt: '#D4A0B5',

  shadowColor: '#000000',
  overlay: 'rgba(10, 8, 12, 0.6)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 26,
  pill: 999,
} as const;

/**
 * Type scale. The app uses the platform system font to avoid bundling font
 * assets. Sizes, weights and letter-spacing create the typographic
 * hierarchy: tight display headings, comfortable body, restrained captions.
 */
export const typography = {
  display: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  h1: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '400',
  },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
  },
  small: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
  },
  caption: {
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '500',
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

/** Deliberately restrained shadows — borders carry most of the structure. */
export const shadows = {
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: lightColors.shadowColor,
      shadowOpacity: 0.05,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 1 },
    default: {},
  }) as ViewStyle,
  raised: Platform.select<ViewStyle>({
    ios: {
      shadowColor: lightColors.shadowColor,
      shadowOpacity: 0.1,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 3 },
    default: {},
  }) as ViewStyle,
} as const;

export interface Theme {
  name: ThemeName;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: typeof shadows;
}

export const themes: Record<ThemeName, Theme> = {
  light: { name: 'light', colors: lightColors, spacing, radius, typography, shadows },
  dark: { name: 'dark', colors: darkColors, spacing, radius, typography, shadows },
};
