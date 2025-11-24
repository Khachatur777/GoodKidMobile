import {createStackNavigator} from '@react-navigation/stack';
import {NoInternetConnection} from 'screens/no-internet-connection/index';

const NetInfoNav = createStackNavigator();

export const NetInfo = () => {
  return (
    <NetInfoNav.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <NetInfoNav.Screen name="NetInfoNav" component={NoInternetConnection} />
    </NetInfoNav.Navigator>
  );
};
