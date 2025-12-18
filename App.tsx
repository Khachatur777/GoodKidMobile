import React, {useEffect} from 'react';

import { Keyboard } from 'react-native';
import 'react-native-screens';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import { ThemeProvider } from './src/theme';
import AppBuilder from './src/AppBuilder';
import { createStore, FormContextProvider } from './src/rtk';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function App(): React.JSX.Element {

  useEffect(() => {
    Orientation.lockToPortrait();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <SafeAreaProvider
      onStartShouldSetResponder={() => {
        Keyboard.dismiss();
        return false;
      }}
    >
      <FormContextProvider>
        <Provider store={createStore}>
          <ThemeProvider>
            <AppBuilder />
          </ThemeProvider>
        </Provider>
      </FormContextProvider>

    </SafeAreaProvider>
  );
}

export default App;
