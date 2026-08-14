import { NavigationProp } from '@react-navigation/native';
import { BackgroundWrapper, CardWrapper } from 'molecules';
import { FC, useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { ThemeContext } from 'theme';
import { ProfileInformation, ProfileLogOut, ProfileSettings, ProfileDeleteAccount, ProfileUserInfo } from './components';
import { profileStyle } from './profile-styles.ts';
import { NoSignIn } from 'organisms';
import { useSelector } from 'react-redux';
import { isLoggedInSelector } from 'rtk';

export interface ProfileProps {
  navigation: NavigationProp<any>;
}

const Profile: FC<ProfileProps> = ({ navigation }) => {
  const { color } = useContext(ThemeContext);
  const isLoggedIn = useSelector(isLoggedInSelector);


  return (
    <BackgroundWrapper>
      {isLoggedIn ?
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={profileStyle({ color }).scroll}
            contentContainerStyle={profileStyle({}).scrollContainer}
          >

            <View style={profileStyle({}).componentsWrapper}>

              <ProfileUserInfo navigation={navigation} />

              <ProfileSettings navigation={navigation} />

              <ProfileInformation navigation={navigation} />

              <CardWrapper containerStyles={profileStyle({}).personalManager}>
                <ProfileLogOut />

                <ProfileDeleteAccount />
              </CardWrapper>
            </View>
          </ScrollView>
        </>

        :
        <NoSignIn
          typeDescription={'profile'}
        />
      }
    </BackgroundWrapper>
  );
};

export default Profile;
