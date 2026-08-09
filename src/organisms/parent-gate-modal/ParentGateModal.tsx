import React, { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { Button, Modal, Spacing, TextField, Typography } from 'molecules';

interface ParentGateModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}

const ParentGateModal: FC<ParentGateModalProps> = ({
  isVisible,
  setIsVisible,
  onSuccess,
}) => {
  const [value, setValue] = useState('');

  const numbers = useMemo(() => {
    const first = Math.floor(Math.random() * 8) + 1;
    const second = Math.floor(Math.random() * 8) + 1;

    return {
      first,
      second,
      result: first + second,
    };
  }, [isVisible]);

  const onSubmit = () => {
    if (Number(value) === numbers.result) {
      setIsVisible(false);
      setValue('');
      onSuccess?.();
    }
  };

  return (
    <Modal
      type="modal"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      showCloseButton
    >
      <Typography type="title3">For parents only</Typography>

      <Spacing size={16} />

      <Typography type="bodyM">
        What is {numbers.first} + {numbers.second} ?
      </Typography>

      <Spacing size={16} />

      <TextField
        keyboardType="number-pad"
        value={value}
        onChangeText={setValue}
        label="Answer"
      />

      <Spacing size={24} />

      <Button title="Continue" onPress={onSubmit} />

      <Spacing size={16} />
    </Modal>
  );
};

export default ParentGateModal;
