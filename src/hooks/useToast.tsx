import {Icon, Typography} from 'molecules';
import {useContext} from 'react';
import {Platform, Pressable, StyleSheet, View} from 'react-native';
import {ToastConfig} from 'react-native-toast-message';
import {IGetColor, ThemeContext} from 'theme';

const style = ({color}: {color?: IGetColor}) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 48,
      marginHorizontal: 24,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      gap: 8,
      flexShrink: 1,
      backgroundColor: color?.('surface_inverted'),
    },
    shadow: {
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 16,
      shadowColor: color?.('blue_900', Platform.OS === 'android' ? 0.4 : 0.6),
    },
    icon: {
      alignSelf: 'flex-start',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 4,
    },
    closeIcon: {
      alignSelf: 'flex-start',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 6,
    },
    title: {
      flexShrink: 1,
    },
  });

const useToast = () => {
  const {color} = useContext(ThemeContext);

  const toastConfig: ToastConfig = {
    default: props =>
      props?.isVisible ? (
        <View style={[style({color}).container, style({color}).shadow]}>
          <Typography textColor="text_inverted" textStyles={style({}).title}>
            {props.text1}
          </Typography>

          <Pressable onPress={() => props.hide()} style={style({}).closeIcon}>
            <Icon
              name="XCloseIcon"
              color="icon_secondary"
              width={20}
              height={20}
            />
          </Pressable>
        </View>
      ) : null,
    success: props =>
      props?.isVisible ? (
        <View style={[style({color}).container, style({color}).shadow]}>
          <View style={style({}).icon}>
            <Icon name="CheckMark" color="green_500" />
          </View>
          <Typography textColor="text_inverted" textStyles={style({}).title}>
            {props.text1}
          </Typography>

          <Pressable onPress={() => props.hide()} style={style({}).closeIcon}>
            <Icon
              name="XCloseIcon"
              color="icon_secondary"
              width={20}
              height={20}
            />
          </Pressable>
        </View>
      ) : null,
    error: props =>
      props?.isVisible ? (
        <View style={[style({color}).container, style({color}).shadow]}>
          <View style={style({}).icon}>
            <Icon name="XCloseIcon" color="red_500" />
          </View>

          <Typography textColor="text_inverted" textStyles={style({}).title}>
            {props.text1}
          </Typography>

          <Pressable onPress={() => props.hide()} style={style({}).closeIcon}>
            <Icon
              name="XCloseIcon"
              color="icon_secondary"
              width={20}
              height={20}
            />
          </Pressable>
        </View>
      ) : null,
    info: props =>
      props?.isVisible ? (
        <View style={[style({color}).container, style({color}).shadow]}>
          <View style={style({}).icon}>
            <Icon name="InfoIcon" color="blue_celestial_500" />
          </View>

          <Typography textColor="text_inverted" textStyles={style({}).title}>
            {props.text1}
          </Typography>

          <Pressable onPress={() => props.hide()} style={style({}).closeIcon}>
            <Icon
              name="XCloseIcon"
              color="icon_secondary"
              width={20}
              height={20}
            />
          </Pressable>
        </View>
      ) : null,
  };

  return {toastConfig};
};

export default useToast;
