import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const playVideoListStyles = ({
  color,
  isTablet,
  width,
  height,
  playerHeightWithControls,
  playerHeight,
}: {
  color?: IGetColor;
  isTablet?: boolean;
  width: number;
  height: number;
  playerHeightWithControls?: number;
  playerHeight?: number;
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

    // Dark top block with the player (design v2)
    darkHeader: {
      backgroundColor: '#191634',
      paddingBottom: 12,
    },
    backRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    // The block under the player stays compact: title, chips and "next" must fit
    // so that the following video is already visible on screen
    infoContainer: {
      paddingHorizontal: 22,
      paddingTop: 12,
      paddingBottom: 2,
      gap: 8,
    },
    chipsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    categoryChip: {
      paddingVertical: 5,
      paddingHorizontal: 13,
      borderRadius: 999,
      backgroundColor: color?.('accent_active', 0.12),
    },
    ageChip: {
      paddingVertical: 5,
      paddingHorizontal: 13,
      borderRadius: 999,
      backgroundColor: color?.('surface_primary'),
    },
    upNextLabel: {
      paddingHorizontal: 22,
      paddingTop: 6,
      paddingBottom: 4,
    },
    upNextList: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },

    //PlayerYoutuber
    // Exactly 16:9 with nothing spare: YouTube draws its controls over the video,
    // and the extra height was left as an empty dark strip under the picture
    videoYoutubeContainer: {
      position: 'relative',
      height: playerHeight,
      overflow: 'hidden',
    },

    videoThumbnail: {
      width: '100%',
      height: playerHeight,
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
