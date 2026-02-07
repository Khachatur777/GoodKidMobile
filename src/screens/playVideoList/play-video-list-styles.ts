import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const playVideoListStyles = ({
  color,
  isTablet,
  width,
  height,
  playerHeightWithControls,
}: {
  color?: IGetColor;
  isTablet?: boolean;
  width: number;
  height: number;
  playerHeightWithControls?: number;
}) =>
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
      padding: 16,
    },

    //PlayVideoListModal
    modalContainer: {
      flex: 1,
      padding: 0,
    },

    //PlayerYoutuber
    videoYoutubeContainer: {
      position: 'relative',
      height: isTablet ? playerHeightWithControls : 230,
      overflow: 'hidden',
    },

    videoThumbnail: {
      width: '100%',
      height: isTablet ? playerHeightWithControls : 230,
      borderRadius: 12,
    },

    hideYoutubeContainer: {
      position: 'absolute',
      width: width * 0.6,
      zIndex: 9999,
      height: height * 0.06,
      bottom: 12,
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
    videoInfoContainer: {
      paddingHorizontal: 16,
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
