import {DependencyList, useEffect} from 'react';

const useEffectAsync = (
  operation: () => Promise<void>,
  deps?: DependencyList,
) => {
  useEffect(() => {
    operation().then();
  }, deps);
};

export default useEffectAsync;
