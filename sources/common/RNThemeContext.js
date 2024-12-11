import React, {createContext, useContext, useState, useEffect} from 'react';
import {Appearance} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';

const RNThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  // const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const [colorScheme, setColorScheme] = useState('light');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme_preference');
        const storedLanguage = await AsyncStorage.getItem(
          'language_preference',
        );

        if (storedTheme) {
          setColorScheme(
            storedTheme === 'system_default'
              ? Appearance.getColorScheme()
              : storedTheme.toLowerCase(),
          );
        }

        if (storedLanguage) {
          setSelectedLanguage(storedLanguage);
          i18next.changeLanguage(storedLanguage);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to load preferences.', error);
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const updateTheme = async theme => {
    try {
      const newTheme =
        theme === 'system_default'
          ? Appearance.getColorScheme()
          : theme.toLowerCase();
      setColorScheme(newTheme);
      await AsyncStorage.setItem('theme_preference', theme);
    } catch (error) {
      console.error('Failed to update theme.', error);
    }
  };

  const updateLanguage = async language => {
    try {
      setSelectedLanguage(language);
      i18next.changeLanguage(language);
      await AsyncStorage.setItem('language_preference', language);
    } catch (error) {
      console.error('Failed to update language.', error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <RNThemeContext.Provider
      value={{colorScheme, selectedLanguage, updateTheme, updateLanguage}}>
      {children}
    </RNThemeContext.Provider>
  );
};

export const useTheme = () => useContext(RNThemeContext);
