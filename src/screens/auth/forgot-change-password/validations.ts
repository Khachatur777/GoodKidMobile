import i18n from 'localization/localization';
import * as yup from 'yup';

export const forgotChangePasswordValidationScheme = () =>
  yup.object({
    code: yup
      .string()
      .required(i18n.t('filed_is_required'))
      .max(30, i18n.t('code_length_is_invalid'))
      .min(5, i18n.t('code_length_is_invalid')),

    newPassword: yup
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

        const {newPassword} = this.parent;

        if (newPassword !== value) {
          return this.createError({
            message: `${i18n.t(
              'confirm_password_not-missing',
            )}`,
          });
        }

        return true;
      }),
  });
