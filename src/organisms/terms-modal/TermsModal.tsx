import { Modal, Spacing, Typography } from 'molecules';
import { Dispatch, FC, SetStateAction } from 'react';
import { termsModalStyles } from './terms-modal-styles.ts';
import { useTermsQuery } from 'rtk';
import { ScrollView } from 'react-native';

export interface TermsModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const TermsModal: FC<TermsModalProps> = ({
                                                             isVisible,
                                                             setIsVisible,
                                                           }) => {
  const {data} = useTermsQuery({})

  return (
    <Modal
      showCloseButton={true}
      type='modal'
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      contentContainerStyles={termsModalStyles().container}>

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

export default TermsModal;
