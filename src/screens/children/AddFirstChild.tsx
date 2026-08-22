import { NavigationProp } from '@react-navigation/native';
import { BackgroundWrapper, Button, KidAvatar, Spacing, Typography } from 'molecules';
import { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ThemeContext } from 'theme';
import { childrenStyles } from './children-styles';

export interface AddFirstChildProps {
  navigation: NavigationProp<any>;
}

// Показывается сразу после регистрации родителя: без ребёнка ни фильтр,
// ни история смысла не имеют, а пустой экран фильтра ничего не объясняет.
const AddFirstChild: FC<AddFirstChildProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => childrenStyles(color), [color]);

  return (
    <BackgroundWrapper>
      <View style={styles.centered}>
        <View style={styles.emptyCircle}>
          <KidAvatar size={110} />
        </View>

        <Typography type="title2" alignment="center">
          {t('add_child_first_title')}
        </Typography>

        <Typography type="bodyM" textColor="text_secondary" alignment="center">
          {t('add_child_first_description')}
        </Typography>

        <Spacing size={16} />

        <Button
          title={t('children_add')}
          onPress={() => navigation.navigate('AddChildScreen')}
        />

        <Button
          variant="ghost"
          title={t('add_child_maybe_later')}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{name: 'TabScreens', params: {screen: 'HomeTab'}}],
            })
          }
        />
      </View>
    </BackgroundWrapper>
  );
};

export default AddFirstChild;
