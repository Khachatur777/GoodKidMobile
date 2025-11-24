import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {setPinAsyncFn, setPinVisible} from 'rtk';

const usePinAction = () => {
  const [securityData, setSecurityData] = useState<  null>(null);

  const dispatch = useDispatch();

  const startPinAction = useCallback(async (toReject?: boolean) => {
    dispatch(setPinVisible(true));

    const response: any = await new Promise((resolve, reject) => {
      if (toReject) {
        dispatch(setPinAsyncFn(reject));
      } else {
        dispatch(setPinAsyncFn(resolve));
      }
    });

    setSecurityData(response);

    return response;
  }, []);

  return {
    securityData,
    startPinAction,
  };
};

export default usePinAction;
