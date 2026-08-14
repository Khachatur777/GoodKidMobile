import { Dimensions, StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

const {width, height} = Dimensions.get('window');

export const searchStyles = ({ color, playing = false }: { color?: IGetColor, playing?: boolean }) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 12,
    },
    backButton: {
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
    searchFieldContainer: {
      flex: 1,
      height: 46,
      borderRadius: 16,
      backgroundColor: color?.('surface_primary'),
      borderWidth: 1.5,
      borderColor: color?.('accent_active'),
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
    },
    searchInput: {
      flex: 1,
      height: 44,
      fontSize: 16,
      color: color?.('text_primary'),
      padding: 0,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 4,
      paddingBottom: 120,
    },
    spinnerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeIndicatorContainer: {
      paddingVertical: 20,
      alignItems: 'center',
    },


    //VideItem
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

    //PlayVideoListModal
    modalContainer: {
      flex: 1,
      padding: 0,
    },

    //PlayerYoutuber
    videoYoutubeContainer: {
      position: 'relative',
      height: 230,
    },
    hideYoutubeContainer: {
      position: 'absolute',
      width: playing ? width/2 :width/1.7 ,
      zIndex: 9999,
      height: playing ? height/14 :height/15,
      bottom: 8,
      right: 0,
    },
    videoInfoContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
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
