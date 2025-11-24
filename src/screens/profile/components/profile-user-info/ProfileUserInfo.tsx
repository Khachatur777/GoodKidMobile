import { FC } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { CardWrapper } from 'molecules';
import { Cell } from 'organisms';
import { profileStyle } from '../../profile-styles.ts';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getUserState } from 'rtk';

interface ProfileSettingsProps {
  navigation: NavigationProp<any>;
}

const ProfileUserInfo: FC<ProfileSettingsProps> = ({navigation}) => {
  const {t} = useTranslation();
  const user = useSelector(getUserState);

  return (
    <CardWrapper
      titleProps={{
        type: 'bodyM',
        textColor: 'text_secondary',
      }}
      showArrowBtn={false}
      title={t('profile_user_info')}
      containerStyles={profileStyle({}).profileWrapper}>

      <Cell
        type="icon"
        iconName="User02Icon"
        title={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
        showArrowIcon={false}
      />

      <Cell
        type="icon"
        iconName="EmailIcon"
        title={user?.email}
        showArrowIcon={false}
      />

    </CardWrapper>
  );
};

export default ProfileUserInfo;
