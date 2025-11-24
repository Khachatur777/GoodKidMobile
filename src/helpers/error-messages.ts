import i18n from 'localization/localization';
import {isEmpty} from 'lodash';

// Return Translated Message
const convertWrongResponse = (
  t: any,
  message: any,
  firstAllDefaults: boolean,
) => {
  const newMessage = message?.match?.(/<body>(.*?)<br>/g);

  if (newMessage?.length > 0) {
    return firstAllDefaults
      ? [newMessage?.[0]?.replace?.(/<\/?[^>]+(>|$)/g, '')][0]
      : [newMessage?.[0]?.replace?.(/<\/?[^>]+(>|$)/g, '')];
  }

  return t(`${message}`.replace?.(/[^\w\s.]/g, ''));
};
// Return Translated Message
export function errorMessages(
  response: any,
  firstAllDefaults = true,
  errorMessage = '',
) {
  const t = i18n.t;

  if (!response) return;

  if (errorMessage) {
    return errorMessage;
  }

  if (!response?.data?.success || !response?.success || response?.data) {
    const {errors} =
      typeof response?.data === 'object' && !isEmpty(response?.data)
        ? response?.data
        : response;

    if (errors && typeof errors === 'object') {
      const message = Object.keys(errors).map(k => {
        const a = errors[k].map((v: any) => v.key).join('');

        return t(`${[k, a].join('.')}`?.replace(/[^\w\s.]/g, ''));
      });

      return firstAllDefaults ? message[0] : message;
    }

    return convertWrongResponse(t, response.data, firstAllDefaults);
  }

  return '';
}

const convertWrongResponseKeys = (message: any, firstAllDefaults: boolean) => {
  const newMessage = message?.match?.(/<body>(.*?)<br>/g);

  if (newMessage?.length > 0) {
    return firstAllDefaults
      ? [newMessage?.[0]?.replace?.(/<\/?[^>]+(>|$)/g, '')][0]
      : [newMessage?.[0]?.replace?.(/<\/?[^>]+(>|$)/g, '')];
  }

  return `${message}`;
};


export function errorMessageKeys(
  response: any,
  firstAllDefaults = true,
  errorMessage = '',
) {
  if (errorMessage) {
    return errorMessage;
  }

  if (!response?.data?.success || !response?.success || response?.data) {
    const {errors} =
      typeof response?.data === 'object' && !isEmpty(response?.data)
        ? response?.data
        : response;

    if (errors && typeof errors === 'object') {
      const message = Object.keys(errors).map(k => {
        const a = errors[k].map((v: any) => v.key).join('');

        return `${[k, a].join('.')}`;
      });

      return firstAllDefaults ? message[0] : message;
    }

    return convertWrongResponseKeys(response.data, firstAllDefaults);
  }

  return '';
}
