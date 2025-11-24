import i18n from 'localization/localization';
import * as yup from 'yup';

export const forgotSendCodeValidationScheme = () =>
  yup.object({
    email: yup
      .string()
      .required(i18n.t('filed_is_required'))
      .max(30, i18n.t('email_length_is_invalid'))
      .min(5, i18n.t('email_length_is_invalid')),
  });
