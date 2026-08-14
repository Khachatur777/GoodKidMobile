import { FC, useContext } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { GoodKidLogo, Typography } from 'molecules';
import { useSelector } from 'react-redux';
import { getUserState } from 'rtk';
import { IGetColor, ThemeContext } from 'theme';

interface ProfileSettingsProps {
  navigation: NavigationProp<any>;
}

const userInfoStyles = (color?: IGetColor, isDark?: boolean) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      backgroundColor: color?.('surface_primary'),
      borderRadius: 28,
      padding: 18,
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 4},
      elevation: 3,
    },
    avatarTile: {
      width: 58,
      height: 58,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(242, 84, 45, 0.14)' : '#FBE9E3',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      flex: 1,
      gap: 3,
    },
  });

const ProfileUserInfo: FC<ProfileSettingsProps> = () => {
  const user = useSelector(getUserState);
  const {color, theme} = useContext(ThemeContext);
  const styles = userInfoStyles(color, theme === 'dark');

  return (
    <View style={styles.card}>
      <View style={styles.avatarTile}>
        <GoodKidLogo size={34} />
      </View>

      <View style={styles.textContainer}>
        <Typography type="bodyLBold" numberOfLines={1}>
          {`${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim()}
        </Typography>

        <Typography type="bodyM" textColor="text_secondary" numberOfLines={1}>
          {user?.email}
        </Typography>
      </View>
    </View>
  );
};

export default ProfileUserInfo;
