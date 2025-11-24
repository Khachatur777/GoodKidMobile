import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pinAsyncFnSelector, setPinVisible } from 'rtk';

const usePin = () => {

  const dispatch = useDispatch();
  const pinAsyncFunction = useSelector(pinAsyncFnSelector);

  const onPinCheck = useCallback(
    (pin: string) => {

      dispatch(setPinVisible(false));

      if (pinAsyncFunction) {
        pinAsyncFunction({
          securityDataType: 1,
          data: pin,
        });
      }
    },
    [pinAsyncFunction],
  );

  return {
    onPinCheck,

  };
};

export default usePin;
