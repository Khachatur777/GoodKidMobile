import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';

export const profileStyle = ({color}: {color?: IGetColor}) => {
  return StyleSheet.create({
    scroll: {
      marginTop: -37,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor: color?.('bg_secondary'),
    },
    scrollContainer: {
      paddingBottom: 100,
      flexGrow: 1,
    },
    header: {
      width: '100%',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      paddingBottom: 48,
    },
    headerTop: {
      alignItems: 'center',
    },
    headerAvatarWrapper: {
      position: 'relative',
      marginTop: 20,
    },
    profileAvatar: {
      position: 'absolute',
      zIndex: -1,
    },
    headerPackageSkeleton: {
      alignItems: 'center',
    },
    iconWrapper: {
      position: 'absolute',
      right: -4,
      bottom: -1,
      width: 30,
      height: 30,
      backgroundColor: color?.('surface_primary'),
      borderWidth: 3,
      borderRadius: 100,
      borderColor: color?.('bg_secondary'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerArrowBtn: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      left: 8,
    },
    profileWrapper: {
      paddingVertical: 12,
      gap: 4,
    },
    skeletonWrapper: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    personalManager: {
      paddingVertical: 8,
    },
    componentsWrapper: {
      gap: 16,
    },
    limitedWrapper: {
      marginBottom: 13,
    },

    // pension register email
    buttonWrapper: {
      width: '100%',
      position: 'absolute',
      bottom: 45,
      paddingHorizontal: 16,
    },
    pensionScroll: {
      flex: 1,
    },
    registerEmailCardWrapper: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 4,
      marginTop: 8,
    },

    // pension statement
    profileStatementWrapper: {
      paddingHorizontal: 16,
      marginTop: 16,
    },
    linkItem: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    linkItemText: {
      width: '90%',
    },
    moreInformation: {
      paddingVertical: 16,
      paddingHorizontal: 16,
    },

    // profile details
    copyBtn: {
      width: '100%',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 60,
    },
    detailsWrapper: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginTop: 16,
    },
    button: {
      width: '100%',
      paddingHorizontal: 16,
      position: 'absolute',
      bottom: 60,
    },
    profileDescriptionItem: {
      paddingVertical: 10,
    },

    // Image picker modal
    imagePickerModalContainer: {
      padding: 0,
      backgroundColor: 'transparent',
    },
    imagePickerOptions: {
      backgroundColor: color?.('surface_primary'),
      borderRadius: 14,
    },
    imagePickerText: {
      paddingVertical: 17,
      borderBottomWidth: 1,
      borderBottomColor: color?.('grey_600', 0.1),
    },
    imagePickerButtonContainer: {
      backgroundColor: color?.('surface_primary'),
      marginTop: 8,
    },

    // Theme
    themeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 32,
      paddingVertical: 24,
      marginTop: 10,
    },
    themeItem: {
      alignItems: 'center',
    },

    // Referral link send
    referralLinkChoose: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: color?.('surface_tertiary'),
      borderRadius: 12,
      padding: 14,
    },
    referralLinkSendCardWrapper: {
      padding: 16,
    },
    referralLinkSendButton: {
      flex: 1,
      justifyContent: 'flex-end',
      marginHorizontal: 16,
    },
    referralLinkProductName: {
      borderColor: color?.('surface_tertiary'),
      paddingTop: 8,
    },
    referralLinkSendContainer: {
      paddingTop: 20,
    },
    referralLinkScroll: {
      flexGrow: 1,
      paddingBottom: 30,
    },
    // referral link
    referralLinkContainer: {
      flexGrow: 1,
      paddingBottom: 15,
    },
    referralLinkCardWrapper: {
      paddingVertical: 12,
    },
    referralLinkDate: {
      paddingLeft: 16,
    },
    referralLinkButtonWrapper: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      paddingTop: 10,
    },

    // choose product modal
    chooseProductModal: {
      padding: 0,
      paddingBottom: 40,
      minHeight: 200,
    },
    chooseProductRadioRow: {
      paddingHorizontal: 16,
    },
    chooseProductRadioRowActive: {
      backgroundColor: color?.('surface_footer'),
    },
    chooseProductModalTitle: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },

    // personal agent modal
    personalAgentImageWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 24,
      marginBottom: 16,
    },
    personalAgentModalContainer: {
      padding: 0,
    },

    // support chat
    supportChat: {
      flex: 1,
    },
    webView: {
      flex: 1,
    },
    avoidingView: {
      flex: 1,
    },

    // Security And Privacy
    securityAndPrivacyWrapper: {
      marginTop: 8,
      gap: 4,
    },

    // password change
    passwordSection: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },

    // About bank
    aboutBankBottom: {
      alignItems: 'center',
      paddingTop: 20,
    },
    aboutBankCardWrapper: {
      paddingHorizontal: 16,
      marginTop: 16,
      paddingTop: 10,
    },
    aboutBankAboutCardWrapper: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 10,
    },
    aboutBankImage: {
      paddingTop: 35,
      alignItems: 'center',
      height: 252,
      width: '100%',
      backgroundColor: color?.('blue_450'),
    },
    aboutBankContainerWrapper: {
      marginTop: -25,
      flexGrow: 1,
    },
    aboutBankScrollContainer: {
      paddingBottom: 30,
    },

    // Pin Change
    changePinScrollContainer: {
      flex: 1,
      justifyContent: 'space-between',
      paddingBottom: 34,
      paddingHorizontal: 16,
    },
    pinChangeContainer: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    pinChangeBackBtn: {
      position: 'absolute',
      top: 60,
      left: 16,
    },
    pinChangeTitle: {
      width: '100%',
    },
    changePinContainer: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },

    //terms

    termsWrapper: {
      paddingTop: 12,
      marginTop: 12,
    },
    termsNoData: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },

    //Arca Pay Registration
    arcaPayRegistrationContainer: {
      paddingTop: 32,
    },
    arcaPayRegistrationScrollContainer: {
      paddingHorizontal: 16,
      flexGrow: 1,
    },
    selectAccountAndCardContainer: {
      marginTop: 32,
      paddingVertical: 10,
    },
    arcaPayButtonWrapper: {
      gap: 8,
      paddingHorizontal: 16,
      marginBottom: 32,
    },
    arcaIconWrapper: {
      alignItems: 'center',
      marginBottom: 24,
    },

    // Tickets
    ticketsCardWrapper: {
      paddingTop: 16,
      paddingHorizontal: 16,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
    },
    ticketsScrollContainer: {
      marginTop: 16,
      paddingBottom: 50,
    },
    ticketsCell: {
      paddingHorizontal: 0,
    },

    //   QR Modal
    qrModalContainer: {
      paddingVertical: 24,
      paddingHorizontal: 50,
      paddingBottom: 40,
    },
    qrWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    qrImage: {
      width: 260,
      height: 260,
      resizeMode: 'contain',
    },
  });
};
