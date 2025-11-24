import i18n from 'localization/localization';
import * as yup from 'yup';

export const signUpValidationScheme = () =>
  yup.object({

    lastName: yup
      .string()
      .required(i18n.t('filed_is_required'))
      .max(30, i18n.t('last_name_length_is_invalid'))
      .min(5, i18n.t('last_name_length_is_invalid')),

    firstName: yup
      .string()
      .required(i18n.t('filed_is_required'))
      .max(30, i18n.t('first_name_length_is_invalid'))
      .min(5, i18n.t('first_name_length_is_invalid')),

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

    confirmPassword: yup
      .string()
      .required(i18n.t('filed_is_required'))
      .max(30, i18n.t('confirm_password_length_is_invalid'))
      .min(7, i18n.t('confirm_password_length_is_invalid'))
      .test('custom-validation', function (value) {

        const {password} = this.parent;

        if (password !== value) {
          return this.createError({
            message: `${i18n.t(
              'confirm_password_not-missing',
            )}`,
          });
        }

        return true;
      }),

  });
