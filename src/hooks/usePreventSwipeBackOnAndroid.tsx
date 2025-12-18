import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {Platform} from 'react-native';

const usePreventSwipeBackOnAndroid = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    if (Platform.OS === 'android') {
      navigation.addListener('beforeRemove', e => {
        if (e.data.action?.type === 'RESET') {
          return; // Allow reset navigation
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();
      });
    }
  }, [navigation]);

  return {};
};

export default usePreventSwipeBackOnAndroid;
