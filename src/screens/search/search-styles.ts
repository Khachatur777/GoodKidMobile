import { Dimensions, StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

const {width, height} = Dimensions.get('window');

export const searchStyles = ({ color, playing = false }: { color?: IGetColor, playing?: boolean }) =>
  StyleSheet.create({
    rightHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: color?.('grey_0'),
      borderRadius: 12,
      paddingHorizontal: 8,
    },
    searchInput: {
      height: 36,
      width: width/1.42,
      color: color?.('bg_secondary'),
    },
    searchItemContainer: {
      flexDirection: 'row',
      marginBottom: 3,
      paddingVertical: 6,
      alignItems: 'center',
      borderBottomWidth: 0.5,
      borderBottomColor: color?.('controls_border_default'),
    },
    searchItemImage: {
      width: 36,
      height: 36,
      marginRight: 8,
      borderRadius: 8,
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
