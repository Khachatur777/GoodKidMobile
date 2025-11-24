import AsyncStorage from '@react-native-async-storage/async-storage';


export const getItem = async (name: string) => {
  return JSON.parse((await AsyncStorage.getItem(name)) as string);
};

export const setItem = async (name: string, data: any = []) => {
  await AsyncStorage.setItem(name, JSON.stringify(data));
};

export const removeItem = async (name: string) => {
  await AsyncStorage.removeItem(name);
};

