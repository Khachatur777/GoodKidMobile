import {Spinner} from 'molecules';
import {FC, useContext} from 'react';
import {View} from 'react-native';
import {ThemeContext} from 'theme';
import {loaderStyles} from './loader-styles';

export interface LoaderProps {
  isLoading: boolean;
}

const Loader: FC<LoaderProps> = ({isLoading}) => {
  const {color} = useContext(ThemeContext);

  return isLoading ? (
    <View style={loaderStyles({color}).container}>
      <Spinner size="large" />
    </View>
  ) : null;
};

export default Loader;
