import {ReactNode, createContext, useContext, useRef} from 'react';
import {TextInput} from 'react-native';

const FormContext = createContext({});

export const FormContextProvider = ({children}: {children: ReactNode}) => {
  const inputRefs = useRef([]);
  const indexCounter = useRef(0);

  const register = (ref: TextInput & {index: number}) => {
    if (ref && !inputRefs.current.includes(ref as never)) {
      ref.index = indexCounter.current++;
      inputRefs.current.push(ref as never);
      inputRefs.current.sort((a: any, b: any) => a.index - b.index); // Ensure the refs are in the order of registration
    }
  };

  const unregister = (ref: any) => {
    inputRefs.current = inputRefs.current.filter(inputRef => inputRef !== ref);
  };

  const focusNext = (currentRef: any) => {
    const currentIndex = inputRefs.current.indexOf(currentRef as never);
    if (currentIndex >= 0 && currentIndex < inputRefs.current.length - 1) {
      /* @ts-expect-error */
      inputRefs.current[currentIndex + 1].focus();
    }
  };

  return (
    <FormContext.Provider value={{register, unregister, focusNext}}>
      {children}
    </FormContext.Provider>
  );
};

export const useFocus = () => {
  return useContext(FormContext);
};
