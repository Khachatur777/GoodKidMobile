import i18n from 'localization/localization';
import * as yup from 'yup';

export const supportValidationScheme = () =>
  yup.object({

    title: yup
      .string()
      .required(i18n.t('filed_is_required'))
      .min(3, i18n.t('title_length_is_invalid')),

    message: yup
      .string()
      .required(i18n.t('filed_is_required'))
      .min(7, i18n.t('title_length_is_invalid')),

  });
