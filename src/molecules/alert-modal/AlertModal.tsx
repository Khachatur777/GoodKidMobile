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
import {FC, ReactNode, useCallback, useEffect} from 'react';
import {Pressable, View} from 'react-native';
import {alertMStyles} from './alert-modal-styles';

export interface AlertModalProps extends Omit<ModalProps, 'children'> {
  iconName?: IIcons;
  iconProps?: IconProps;
  title?: string;
  description?: string | ReactNode;
  buttons: ButtonProps[];
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
  showCloseBtn = true,
  renderNestedModal,
  ...props
}) => {
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
    <Modal {...props}>
      {(iconName || iconProps) && (
        <View style={alertMStyles().iconContainer}>
          <Icon name={iconName!} width={48} height={48} {...iconProps} />
          <Spacing size={16} />
        </View>
      )}

      {showCloseBtn && (
        <Pressable onPress={onClose} style={alertMStyles().closeBtn}>
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

      <View style={alertMStyles().buttonsContainer}>
        {buttons.map((button, index) => (
          <Button key={`Item--${button.title}--${index}`} {...button} />
        ))}
      </View>

      {renderNestedModal?.()}
    </Modal>
  );
};

export default AlertModal;
