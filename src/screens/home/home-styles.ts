import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';



export const homeStyles = ({
                             color,
                             playing = false,
                             width,
                             height,
                             isTablet,
                             thumbHeight,
                           }: {
  color?: IGetColor;
  playing?: boolean;
  width: number;
  height: number;
  isTablet: boolean;
  thumbHeight: number;
}) =>
  StyleSheet.create({
    rightHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    activeIndicatorContainer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    //VideItem

    videoCardContainer: {
      marginTop: 12,
    },
    videoThumbnailContainer: {
      position: 'relative',
    },
    videoItemThumbnail: {
      width: '100%',
      height: thumbHeight,
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
      padding: 16,
    },

    videoYoutubeContainer: {
      position: 'relative',
      height: isTablet ? Math.round(width * 0.45) : Math.round(width * 0.56), // tablet чуть ниже, phone 16:9
      overflow: 'hidden',
    },

    // Эти "hide*" лучше тоже от width/height, а не фикс
    hideYoutubeContainer: {
      position: 'absolute',
      width: playing ? width * 0.5 : width * 0.6,
      zIndex: 9999,
      height: playing ? height * 0.07 : height * 0.06,
      bottom: 8,
      right: 0,
    },
    hideYoutubeContainerAndroid: {
      position: 'absolute',
      width: width * 0.2,
      zIndex: 9999,
      height: height * 0.035,
      bottom: 8,
      right: width * 0.12,
    },
    hideYoutubeHeader: {
      position: 'absolute',
      width: width,
      zIndex: 9999,
      height: height * 0.06,
      top: 8,
      left: 0,
    },

    //PlayVideoListModal
    modalContainer: {
      flex: 1,
      padding: 0,
    },

    videoInfoContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    videoThumbnail: {
      borderRadius: 12,
      width: '100%',
      height: thumbHeight,
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
