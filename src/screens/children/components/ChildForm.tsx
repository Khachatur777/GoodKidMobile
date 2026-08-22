import { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  KidAvatar,
  KID_AVATAR_PRESETS,
  PasswordField,
  SegmentedControl,
  Spacing,
  TextField,
  Typography,
} from 'molecules';
import { Pressable } from 'react-native';
import { ThemeContext } from 'theme';

export interface IChildFormValues {
  name: string;
  age: string;
  avatar: string;
  language: string;
  login: string;
  password: string;
  confirmPassword: string;
}

interface ChildFormProps {
  values: IChildFormValues;
  onChange: (patch: Partial<IChildFormValues>) => void;
  // Занятость логина проверяется только по сабмиту: живая проверка отдавала бы
  // список существующих логинов кому угодно.
  loginError?: string;
  showAvatarHint?: boolean;
  showPasswordFields?: boolean;
}

const ChildForm: FC<ChildFormProps> = ({
  values,
  onChange,
  loginError,
  showAvatarHint = true,
  showPasswordFields = true,
}) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        sectionLabel: {
          paddingBottom: 10,
        },
        avatarRow: {
          gap: 12,
          paddingVertical: 4,
        },
        avatarItem: {
          padding: 3,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: 'transparent',
        },
        avatarItemSelected: {
          borderColor: color('accent_active'),
        },
        row: {
          flexDirection: 'row',
          gap: 12,
        },
        nameField: {
          flex: 1.5,
        },
        ageField: {
          flex: 1,
        },
        halfField: {
          flex: 1,
        },
      }),
    [color],
  );

  return (
    <View>
      <View style={styles.sectionLabel}>
        <Typography type="captionBold" textColor="text_secondary">
          {t('child_avatar_label').toUpperCase()}
        </Typography>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.avatarRow}
      >
        {KID_AVATAR_PRESETS.map(preset => (
          <Pressable
            key={preset.id}
            style={[
              styles.avatarItem,
              values.avatar === preset.id ? styles.avatarItemSelected : null,
            ]}
            onPress={() => onChange({ avatar: preset.id })}
          >
            <KidAvatar avatarId={preset.id} size={62} />
          </Pressable>
        ))}
      </ScrollView>

      {showAvatarHint ? (
        <>
          <Spacing size={8} />
          <Typography type="caption" textColor="text_tertiary">
            {t('child_avatar_hint')}
          </Typography>
        </>
      ) : null}

      <Spacing size={20} />

      <View style={styles.row}>
        <View style={styles.nameField}>
          <TextField
            size="large"
            value={values.name}
            onChangeText={name => onChange({ name })}
            label={t('child_name_label')}
          />
        </View>

        <View style={styles.ageField}>
          <TextField
            size="large"
            value={values.age}
            onChangeText={age => onChange({ age: age.replace(/[^0-9]/g, '').slice(0, 2) })}
            keyboardType="number-pad"
            label={t('child_age_label')}
          />
        </View>
      </View>

      <Typography type="captionBold" textColor="text_secondary">
        {t('child_language_label').toUpperCase()}
      </Typography>

      <Spacing size={10} />

      {/* Язык ребёнка задаёт родитель — сам ребёнок его не меняет */}
      <SegmentedControl
        items={[
          { value: 'en', title: 'English' },
          { value: 'ru', title: 'Русский' },
          { value: 'hy', title: 'Հայերեն' },
        ]}
        value={values.language}
        onChange={language => onChange({ language })}
      />

      <Spacing size={20} />

      <TextField
        size="large"
        value={values.login}
        onChangeText={login => onChange({ login: login.replace(/\s/g, '').toLowerCase() })}
        autoCapitalize="none"
        autoCorrect={false}
        label={t('child_login_label')}
        error={!!loginError}
        explanation={loginError || t('child_login_hint')}
      />

      {showPasswordFields ? (
        <View style={styles.row}>
          <View style={styles.halfField}>
            <PasswordField
              size="large"
              value={values.password}
              onChangeText={password => onChange({ password })}
              label={t('child_password_label')}
            />
          </View>

          <View style={styles.halfField}>
            <PasswordField
              size="large"
              value={values.confirmPassword}
              onChangeText={confirmPassword => onChange({ confirmPassword })}
              label={t('child_password_confirm_label')}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default ChildForm;
