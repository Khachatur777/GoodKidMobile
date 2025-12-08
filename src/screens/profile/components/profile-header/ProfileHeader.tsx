import {Avatar} from 'molecules';
import {FC} from 'react';
import {View} from 'react-native';
import {profileStyle} from '../../profile-styles.ts';

export interface ProfileHeaderProps {
}

const ProfileHeader: FC<ProfileHeaderProps> = () => {


  return (
    <View
      style={[
        profileStyle({}).header,
      ]}
    >
      <Avatar
        size="xl"
        backgroundColor="blue_450"
        iconName="User02Icon"
      />

    </View>
  );
};

export default ProfileHeader;
