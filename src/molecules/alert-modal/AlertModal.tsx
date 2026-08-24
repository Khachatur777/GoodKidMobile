import {IIcons} from 'assets';
import {
  Button,
  ButtonProps,
  Icon,
  IconProps,
  Modal,
  ModalProps,
  Spacing,
  Typography,
} from 'molecules';
import {FC, ReactNode, useCallback, useContext, useEffect} from 'react';
import {Pressable, View} from 'react-native';
import {ThemeContext} from 'theme';
import {alertMStyles} from './alert-modal-styles';

export interface AlertModalProps extends Omit<ModalProps, 'children'> {
  iconName?: IIcons;
  iconProps?: IconProps;
  title?: string;
  description?: string | ReactNode;
  buttons: ButtonProps[];
  // Destructive dialogs get the red tile, everything else the accent one
  tone?: 'accent' | 'negative';
  showCloseBtn?: boolean;
  renderNestedModal?: () => ReactNode | ReactNode[];
  autoCloseAfterMs?: number;
}

const AlertModal: FC<AlertModalProps> = ({
  iconName,
  title = '',
  description = '',
  buttons = [],
  iconProps,
  tone = 'accent',
  showCloseBtn = false,
  renderNestedModal,
  ...props
}) => {
  const {color} = useContext(ThemeContext);
  const styles = alertMStyles({color, tone});

  const onClose = useCallback(() => {
    props.setIsVisible(false);
  }, [props.setIsVisible]);

  useEffect(() => {
    if (props.isVisible && props.autoCloseAfterMs) {
      const timer = setTimeout(() => {
        onClose();
      }, props.autoCloseAfterMs);

      return () => clearTimeout(timer);
    }
  }, [props.isVisible, props.autoCloseAfterMs, onClose]);

  return (
    <Modal type="center" {...props}>
      {(iconName || iconProps) && (
        <View style={styles.iconContainer}>
          <View style={styles.iconTile}>
            <Icon
              name={iconName!}
              width={34}
              height={34}
              color={tone === 'negative' ? 'accent_negative' : 'accent_active'}
              {...iconProps}
            />
          </View>
          <Spacing size={16} />
        </View>
      )}

      {showCloseBtn && (
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Icon name={'XCloseIcon'} width={20} height={20} />
        </Pressable>
      )}

      {title && (
        <>
          <Typography
            alignment={iconName || iconProps ? 'center' : 'left'}
            type="title3">
            {title}
          </Typography>
          <Spacing size={8} />
        </>
      )}

      {description && (
        <>
          <Typography
            alignment={iconName || iconProps ? 'center' : 'left'}
            type="bodyS"
            textColor="text_secondary">
            {description}
          </Typography>
          <Spacing size={20} />
        </>
      )}

      <View style={styles.buttonsContainer}>
        {buttons.map((button, index) => (
          <Button key={`Item--${button.title}--${index}`} {...button} />
        ))}
      </View>

      {renderNestedModal?.()}
    </Modal>
  );
};

export default AlertModal;
