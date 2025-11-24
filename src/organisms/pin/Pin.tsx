import { localT } from 'localization';
import { PinField } from 'organisms';
import { FC, Fragment, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from 'theme';
import { pinStyles } from './pin-styles';
import { getPinState, isLoggedInSelector, setPinVisible } from 'rtk';
import { usePin, usePinAction, useStatusBarHeight } from 'hooks';
import { Icon, Typography } from 'molecules';
import { useTranslation } from 'react-i18next';

export interface PinProps {
  children?: ReactNode;
}

const Pin: FC<PinProps> = ({children}) => {
  const [code, setCode] = useState<string>('');
  const { t } = useTranslation();

  const {color} = useContext(ThemeContext);
  const isVisible = useSelector(getPinState);
  const dispatch = useDispatch();
  const {startPinAction} = usePinAction();
  const statusBarHeight = useStatusBarHeight();
  const isLoggedIn = useSelector(isLoggedInSelector);


  useEffect(() => {
    if (isVisible) {
      Keyboard.dismiss();
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setCode('');
    }
  }, [isVisible]);

  const {
    onPinCheck,
  } = usePin();

  const onEndEditing = useCallback(
    (pin: string) => {
      onPinCheck(pin);
    },
    [onPinCheck],
  );


  return (
    <Fragment>
      <View style={pinStyles({ isVisible }).appContainer}>{children}</View>

      <View style={pinStyles({ color, isVisible }).container}>
        <View style={pinStyles({ statusBarHeight }).header}>
          <Pressable
            onPress={() => {
              startPinAction(true)
                .then(() => null)
                .catch(() => null);
              dispatch(setPinVisible(false));
            }}
            style={pinStyles({}).goBackBtn}
          >
            <Icon name="ChevronLeft" color="icon_secondary" />
          </Pressable>
        </View>

        {isLoggedIn ? (
          <Typography type={'title1'} textStyles={pinStyles({}).title}>{t('pin_title_login')}</Typography>
        ) : (
          <Typography type={'title1'} textStyles={pinStyles({}).title}>{t('pin_title')}</Typography>
        )}

        {isVisible ? (
          <PinField
            key={'pin'}
            onEndEditing={onEndEditing}
            code={code}
            setCode={setCode}
            title={localT('enter_pin_code')}
            errorMessage={localT('pin_code_mismatch')}
          />
        ) : null}
      </View>
    </Fragment>
  );
};

export default Pin;
