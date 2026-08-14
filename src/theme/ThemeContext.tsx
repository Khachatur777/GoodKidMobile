import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {ColorSchemeName, StatusBar, useColorScheme} from 'react-native';
import {IColor, colorTheme} from './colors';
import {useEffectAsync} from 'hooks';

export type IGetColor = (name: IColor, percent?: number) => string;

export type IThemeMode = 'light' | 'dark' | 'system';

export const DEFAULT_ACCENT = '#6B4EE6';

// Пресеты акцентов из дизайна v2: light-вариант и осветлённый dark-вариант (rgb-триплеты)
const ACCENT_PRESETS: {[hex: string]: {light: string; dark: string}} = {
  '#6B4EE6': {light: '107, 78, 230', dark: '163, 139, 255'},
  '#E14A24': {light: '225, 74, 36', dark: '255, 122, 80'},
  '#2F6BFF': {light: '47, 107, 255', dark: '125, 162, 255'},
  '#0F8A7E': {light: '15, 138, 126', dark: '63, 194, 180'},
  '#F0417E': {light: '240, 65, 126', dark: '255, 122, 168'},
  '#F58A1F': {light: '245, 138, 31', dark: '255, 173, 92'},
  '#3FA845': {light: '63, 168, 69', dark: '111, 208, 118'},
  '#7B8794': {light: '123, 135, 148', dark: '166, 176, 188'},
};

// Токены, которые перекрашиваются выбранным акцентом
const ACCENT_TOKENS: IColor[] = [
  'accent_active',
  'controls_primary_default',
  'controls_primary_hover',
  'controls_primary_pressed',
  'controls_tab_bar_active',
  'links_default',
];

const hexToRgbTriplet = (hex: string): string | null => {
  const match = /^#?([0-9a-fA-F]{6})$/.exec(hex);
  if (!match) {
    return null;
  }
  const int = parseInt(match[1], 16);
  return `${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}`;
};

const accentTriplet = (accent: string, scheme: 'light' | 'dark'): string | null => {
  const preset = ACCENT_PRESETS[accent?.toUpperCase?.() ?? accent];
  if (preset) {
    return preset[scheme];
  }
  return hexToRgbTriplet(accent);
};

export interface IThemeContext {
  theme: ColorSchemeName | null;
  themeMode: IThemeMode;
  toggleTheme: (newTheme: ColorSchemeName) => void;
  useSystemTheme: () => void;
  accent: string;
  setAccent: (accent: string) => void;
  color: IGetColor;
}

const ThemeContext = createContext<IThemeContext>({
  theme: null,
  themeMode: 'system',
  toggleTheme: () => null,
  useSystemTheme: () => null,
  accent: DEFAULT_ACCENT,
  setAccent: () => null,
  color: () => '',
});

export const ThemeProvider = ({children}: {children: ReactNode}) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<ColorSchemeName>(colorScheme || 'light');
  const [themeMode, setThemeMode] = useState<IThemeMode>('system');
  const [accent, setAccentState] = useState<string>(DEFAULT_ACCENT);

  useEffect(() => {
    // Load saved theme and accent from storage
    const getSaved = async () => {
      try {
        const [savedTheme, savedAccent] = await Promise.all([
          AsyncStorage.getItem('themeType') as Promise<ColorSchemeName>,
          AsyncStorage.getItem('accentColor'),
        ]);

        if (savedTheme) {
          setTheme(savedTheme);
          setThemeMode(savedTheme as IThemeMode);
        }
        if (savedAccent) {
          setAccentState(savedAccent);
        }
      } catch (error) {
        if (__DEV__) {
          console.log('Error loading theme:', error);
        }
      }
    };
    getSaved();
  }, []);

  useEffectAsync(async () => {
    const savedTheme = await AsyncStorage.getItem('themeType');

    if (colorScheme && !savedTheme) {
      setTheme(colorScheme); // set theme to system selected theme
    }
  }, [colorScheme]);

  const toggleTheme = (newTheme: ColorSchemeName) => {
    setTheme(newTheme);
    setThemeMode((newTheme as IThemeMode) || 'system');
    AsyncStorage.setItem('themeType', newTheme!); // Save selected theme to storage
  };

  const useSystemTheme = () => {
    setTheme(colorScheme);
    setThemeMode('system');
    AsyncStorage.setItem('themeType', '');
  };

  const setAccent = (newAccent: string) => {
    setAccentState(newAccent);
    AsyncStorage.setItem('accentColor', newAccent);
  };

  function RGB(color = '0, 0, 0', percent = 1) {
    return `rgba(${color}, ${percent})`;
  }

  const color = useCallback(
    (name: IColor = 'bg_inverted', percent: number = 1) => {
      const scheme = (theme as 'light' | 'dark') || 'light';

      if (ACCENT_TOKENS.includes(name)) {
        const triplet = accentTriplet(accent, scheme);
        if (triplet) {
          return RGB(triplet, percent);
        }
      }

      return RGB(colorTheme?.[scheme]?.[name], percent);
    },
    [theme, accent],
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        toggleTheme,
        useSystemTheme,
        accent,
        setAccent,
        color,
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
      />

      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
