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

    // Header (in-screen, design v2)
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 22,
      paddingTop: 8,
      paddingBottom: 12,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    logo: {
      width: 34,
      height: 34,
      resizeMode: 'contain',
    },
    // The child's Home per the design: search is a full-width field rather than a
    // corner icon — a large tap area with a legible label
    kidSearchField: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      height: 56,
      borderRadius: 18,
      paddingHorizontal: 18,
      marginHorizontal: 16,
      marginBottom: 8,
      backgroundColor: color?.('surface_primary'),
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: {width: 0, height: 2},
      elevation: 2,
    },
    searchButton: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: color?.('surface_primary'),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: {width: 0, height: 2},
      elevation: 2,
    },
    greetingContainer: {
      paddingHorizontal: 22,
      paddingBottom: 14,
      gap: 3,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 120,
    },
    chipsRow: {
      paddingHorizontal: 22,
      paddingBottom: 16,
      gap: 8,
      flexDirection: 'row',
    },
    chip: {
      paddingVertical: 9,
      paddingHorizontal: 16,
      borderRadius: 999,
      backgroundColor: color?.('surface_primary'),
    },
    chipActive: {
      backgroundColor: color?.('accent_active'),
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
      marginBottom: 18,
      borderRadius: 26,
      padding: 10,
      paddingBottom: 16,
      backgroundColor: color?.('surface_primary'),
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 4},
      elevation: 3,
    },
    videoThumbnailContainer: {
      position: 'relative',
    },
    videoItemThumbnail: {
      width: '100%',
      height: thumbHeight,
      borderRadius: 20,
    },
    duration: {
      backgroundColor: 'rgba(25, 22, 52, 0.82)',
      color: '#FFFFFF',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center',
      position: 'absolute',
      paddingVertical: 4,
      paddingHorizontal: 9,
      right: 10,
      bottom: 10,
    },
    title: {
      paddingTop: 14,
      paddingHorizontal: 8,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingTop: 8,
      paddingHorizontal: 8,
    },
    categoryChip: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: color?.('accent_active', 0.12),
    },

    videoYoutubeContainer: {
      position: 'relative',
      height: isTablet ? Math.round(width * 0.45) : Math.round(width * 0.56), // tablet a little shorter, phone 16:9
      overflow: 'hidden',
    },

    // These "hide*" values would be better derived from width/height too, not fixed
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
