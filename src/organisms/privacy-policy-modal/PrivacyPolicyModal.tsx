import { Modal, Spacing, Typography } from 'molecules';
import { Dispatch, FC, SetStateAction } from 'react';
import { privacyPolicyModalStyles } from './privacy-policy-modal-styles.ts';
import {usePrivacyQuery, useTermsQuery} from 'rtk';
import { ScrollView } from 'react-native';

export interface PrivacyPolicyModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const PrivacyPolicyModal: FC<PrivacyPolicyModalProps> = ({
                                                             isVisible,
                                                             setIsVisible,
                                                           }) => {
  const {data} = usePrivacyQuery({})

  return (
    <Modal
      showCloseButton={true}
      type='modal'
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      contentContainerStyles={privacyPolicyModalStyles().container}>

      <Spacing size={16} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Typography type="title3">
          {data?.text}
        </Typography>
      </ScrollView>

      <Spacing size={24} />
    </Modal>
  );
};

export default PrivacyPolicyModal;
