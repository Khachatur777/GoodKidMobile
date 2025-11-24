import { Avatar, Spacing } from 'molecules';
import { FC, useContext, useState } from 'react';
import { View } from 'react-native';
import { profileStyle } from '../../profile-styles.ts';
import { ThemeContext } from 'theme';

export interface ProfileHeaderProps {
}

const ProfileHeader: FC<ProfileHeaderProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { color } = useContext(ThemeContext);


  return (
    <View
      style={[
        profileStyle({}).header,
      ]}
    >

      <View style={profileStyle({}).headerTop}>
        <View style={profileStyle({}).headerAvatarWrapper}>
          <Avatar
            size="xl"
            backgroundColor="blue_450"
            source={{ uri: '' }}
            disabled={false}
            iconName="User02Icon"
            onPress={() => setIsVisible(true)}
            iconWrapperStyle={profileStyle({}).profileAvatar}
          />
          {/*<Pressable*/}
          {/*  onPress={() => setIsVisible(true)}*/}
          {/*  style={profileStyle({ color }).iconWrapper}>*/}
          {/*  <Icon*/}
          {/*    name={'Edit02Icon'}*/}
          {/*    width={16}*/}
          {/*    height={16}*/}
          {/*  />*/}
          {/*</Pressable>*/}
        </View>

        <Spacing size={12} />

        <Spacing size={4} />
      </View>

      <Spacing size={16} />

    </View>
  );
};

export default ProfileHeader;
