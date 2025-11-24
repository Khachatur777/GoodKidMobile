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

export interface IThemeContext {
  theme: ColorSchemeName | null;
  toggleTheme: (newTheme: ColorSchemeName) => void;
  useSystemTheme: () => void;
  color: IGetColor;
}

const ThemeContext = createContext<IThemeContext>({
  theme: null,
  toggleTheme: () => null,
  useSystemTheme: () => null,
  color: () => '',
});

export const ThemeProvider = ({children}: {children: ReactNode}) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<ColorSchemeName>(colorScheme || 'light');

  useEffect(() => {
    // Load saved theme from storage
    const getTheme = async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem(
          'themeType',
        )) as ColorSchemeName;

        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        if (__DEV__) {
          console.log('Error loading theme:', error);
        }
      }
    };
    getTheme();
  }, []);

  useEffectAsync(async () => {
    const savedTheme = await AsyncStorage.getItem('themeType');

    if (colorScheme && !savedTheme) {
      setTheme(colorScheme); // set theme to system selected theme
    }
  }, [colorScheme]);

  const toggleTheme = (newTheme: ColorSchemeName) => {
    setTheme(newTheme);
    AsyncStorage.setItem('themeType', newTheme!); // Save selected theme to storage
  };

  const useSystemTheme = () => {
    setTheme(colorScheme);
    AsyncStorage.setItem('themeType', '');
  };

  function RGB(color = '0, 0, 0', percent = 1) {
    return `rgba(${color}, ${percent})`;
  }

  const color = useCallback(
    (name: IColor = 'bg_inverted', percent: number = 1) => {
      return RGB(colorTheme?.[theme as 'light']?.[name], percent);
    },
    [theme],
  );

  return (
    <ThemeContext.Provider value={{theme, toggleTheme, useSystemTheme, color}}>
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
