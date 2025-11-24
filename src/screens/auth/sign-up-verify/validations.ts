import i18n from 'localization/localization';
import * as yup from 'yup';

export const signUnVerifyValidationScheme = () =>
  yup.object({
    code: yup
      .string()
      .required(i18n.t('filed_is_required'))
      .min(6, i18n.t('verify_code_length_is_invalid')),
  });
