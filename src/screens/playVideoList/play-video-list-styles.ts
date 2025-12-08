import { Dimensions, StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

const {width, height} = Dimensions.get('window');

export const playVideoListStyles = ({ color, playing = false, videoHeight }: { color?: IGetColor, playing?: boolean, videoHeight?: number }) =>
  StyleSheet.create({
    activeIndicatorContainer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    videoCardContainer: {
      marginBottom: 8,
    },
    videoThumbnailContainer: {
      position: 'relative',
    },
    videoItemThumbnail: {
      width: '100%',
      height: 215,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    duration: {
      backgroundColor: color?.('bg_secondary'),
      borderRadius: 4,
      alignItems: 'center',
      position: 'absolute',
      padding: 4,
      right: 16,
      bottom: 16,
    },
    title: {
      padding: 16
    },

    //PlayVideoListModal
    modalContainer: {
      flex: 1,
      padding: 0,
    },

    //PlayerYoutuber
    videoYoutubeContainer: {
      position: 'relative',
      height: 230,
      overflow: 'hidden',
    },
    hideYoutubeContainer: {
      position: 'absolute',
      width: playing ? width/2 :width/1.7 ,
      zIndex: 9999,
      height: playing ? height/14 :height/15,
      bottom: 8,
      right: 0,
    },
    hideYoutubeContainerAndroid: {
      position: 'absolute',
      width: width/5,
      zIndex: 9999,
      height:  height/31 ,
      bottom: 8,
      right:  width/8,
    },
    hideYoutubeHeader: {
      position: 'absolute',
      width: width,
      zIndex: 9999,
      height: height/18,
      top: 8,
      left: 0,
    },

    videoInfoContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    videoThumbnail: {
      width: '100%',
      height: videoHeight,
      borderRadius: 12,
    },

    // Loading states
    centerLoader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerLoader: {
      paddingVertical: 20,
      alignItems: 'center',
    },
  });
