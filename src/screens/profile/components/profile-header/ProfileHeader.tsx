import { FC } from 'react';
import { Image, View } from 'react-native';
import { profileStyle } from '../../profile-styles.ts';
import { Ladybug } from 'assets';

export interface ProfileHeaderProps {}

const ProfileHeader: FC<ProfileHeaderProps> = () => {


  return (
    <View
      style={[
        profileStyle({}).header,
      ]}
    >
      <Image source={Ladybug} style={{width: 100, height: 100, resizeMode: 'contain'}}/>

    </View>
  );
};

export default ProfileHeader;
