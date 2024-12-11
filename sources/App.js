import * as React from 'react';
import Routes from './navigation/Routes';
import i18next from 'i18next';
import {I18nextProvider} from 'react-i18next';
import {ThemeProvider} from './common/RNThemeContext';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import Store from './redux';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={DefaultTheme}>
        <ThemeProvider>
          <I18nextProvider i18n={i18next}>
            <Provider store={Store}>
              <Routes />
            </Provider>
          </I18nextProvider>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
