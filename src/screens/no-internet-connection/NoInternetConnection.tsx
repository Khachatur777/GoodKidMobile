import {localT} from 'localization';
import {BackgroundWrapper, Button, Icon, Spacing, Typography} from 'molecules';
import RNRestart from 'react-native-restart';
import {View} from "react-native";

const NoInternetConnection = () => {
  return (
    <BackgroundWrapper
      backgroundColor="bg_primary"
      containerStyles={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
      }}>
      <Icon name="NetInfo" width={200} height={200}/>

      <Spacing size={38}/>

      <Typography type="title2" alignment="center">
        {localT('net_info_title')}
      </Typography>

      <Spacing size={8}/>

      <Typography alignment="center" textColor="text_secondary">
        {localT('net_info_description')}
      </Typography>

      <Spacing size={32}/>

      <View style={{
        marginTop: 12,
        width: '100%',
      }}>
        <Button
          size="large"
          title={localT('refetch_net_info')}
          onPress={() => RNRestart.restart()}
        />
      </View>
    </BackgroundWrapper>
  );
};

export default NoInternetConnection;
