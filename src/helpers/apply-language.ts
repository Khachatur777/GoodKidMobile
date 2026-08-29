import i18n from 'i18next';
import { getItem, setItem } from 'configs';
import { IUser } from 'models';

// Свой ключ для родителя. Общий 'language' для этого не годится: i18next
// перезаписывает его сам при каждой смене языка, в том числе когда мы
// переключаемся на язык ребёнка. Родительский выбор нужно хранить там, куда
// эта запись не дотягивается.
export const PARENT_LANGUAGE_KEY = 'parentLanguage';

export const rememberParentLanguage = (code: string) =>
  setItem(PARENT_LANGUAGE_KEY, code);

// Кто чей язык выбирает:
//   родитель — свой, сам, через настройки; он и лежит в 'language';
//   ребёнок — не выбирает, за него это сделал родитель в карточке ребёнка.
//
// Поэтому язык ребёнка применяется только к текущему сеансу и в 'language' не
// пишется. Иначе вход ребёнка навсегда стирал бы выбор родителя: родитель с
// армянским, зайдя после ребёнка с русским, получал русский и вернуть свой мог
// только руками.
export const applyLanguageForUser = async (user?: IUser | null) => {
  if (user?.role === 'child' && user?.language) {
    const childLanguage = String(user.language).toLowerCase();
    if (childLanguage !== i18n.language) {
      await i18n.changeLanguage(childLanguage);
    }
    return childLanguage;
  }

  // Родителю — то, что он выбирал сам. Общий ключ остаётся запасным для тех,
  // кто выбирал язык до появления отдельного.
  const language = (await getItem(PARENT_LANGUAGE_KEY))
    || (await getItem('language'))
    || 'en';

  if (language !== i18n.language) {
    await i18n.changeLanguage(language);
  }

  return language;
};
