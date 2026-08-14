import { FC } from 'react';
import { View } from 'react-native';
import { profileStyle } from '../../profile-styles.ts';
import { GoodKidLogo } from 'molecules';

export interface ProfileHeaderProps {}

const ProfileHeader: FC<ProfileHeaderProps> = () => {


  return (
    <View
      style={[
        profileStyle({}).header,
      ]}
    >
      <GoodKidLogo size={92} />

    </View>
  );
};

export default ProfileHeader;
