import i18n from 'localization/localization';
import * as yup from 'yup';

export const signInValidationScheme = () =>
  yup.object({

    email: yup
      .string()
      .required(i18n.t('filed_is_required'))
      .max(30, i18n.t('email_length_is_invalid'))
      .min(5, i18n.t('email_length_is_invalid')),

    password: yup
      .string()
      .required(i18n.t('filed_is_required'))
      .max(30, i18n.t('password_length_is_invalid'))
      .min(7, i18n.t('password_length_is_invalid')),

  });
