import i18n from 'localization/localization';
import { Modal, Spacing, Typography } from 'molecules';
import { Dispatch, FC, SetStateAction } from 'react';
import { privacyPolicyModalStyles } from './privacy-policy-modal-styles.ts';
import {usePrivacyQuery} from 'rtk';
import { ScrollView } from 'react-native';

export interface PrivacyPolicyModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const PrivacyPolicyModal: FC<PrivacyPolicyModalProps> = ({
                                                             isVisible,
                                                             setIsVisible,
                                                           }) => {
  const {data} = usePrivacyQuery({languageId: i18n.language})

  // Документ приходит обычным текстом: первая строка — заголовок,
  // остальное набираем читаемым размером, а не заголовочным
  const [title, ...rest] = (data?.text || '').split('\n');
  const body = rest.join('\n').trim();

  return (
    <Modal
      showCloseButton={true}
      type='modal'
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      contentContainerStyles={privacyPolicyModalStyles().container}>

      <Spacing size={16} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Typography type="title3">{title}</Typography>

        <Spacing size={12} />

        <Typography type="bodyS" textColor="text_secondary">
          {body}
        </Typography>
      </ScrollView>

      <Spacing size={24} />
    </Modal>
  );
};

export default PrivacyPolicyModal;
