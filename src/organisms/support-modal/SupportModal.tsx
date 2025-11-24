import {
  Button,
  Modal,
  Spacing,
  TextField,
  Typography,
} from 'molecules';
import {ScrollView} from 'react-native-gesture-handler';
import React, { Dispatch, FC, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supportStyles } from './support-styles.ts';
import { Formik } from 'formik';
import { supportValidationScheme } from './validations.ts';
import TextArea from '../../molecules/fields/text-area/TextArea.tsx';
import { useSendMessageMutation } from 'rtk';

export interface SupportModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const SupportModal: FC<SupportModalProps> = ({
                                                             isVisible,
                                                             setIsVisible,
                                                           }) => {
  const { t } = useTranslation();
  const [sendMessage] = useSendMessageMutation()

  const initialValues = {
    title: '',
    message: '',
  };

  const onSubmit = useCallback(async (value: typeof initialValues) => {
    try {

      const data = {
        title: value.title,
        message: value.message,
      }
      const response = await sendMessage(data)

      if(response?.data?.success){
        setIsVisible(false)
      }

    }catch (e){}
  }, [])


  return (
    <Modal
      type="bottom-sheet"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      showCloseButton
      keyboardAvoidingView
      contentContainerStyles={supportStyles().container}>
      <Formik
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={supportValidationScheme}
      >
        {({ setFieldValue, touched, handleSubmit, values, errors }) => (
          <ScrollView
            showsVerticalScrollIndicator={false}
          >

            <Typography type="title3">{t('send_message_support_title')}</Typography>

            <Spacing size={8} />

            <TextField
              size="large"
              value={values?.title}
              onChangeText={e => {
                setFieldValue('title', e);
              }}
              label={t('title_chat')}
              explanation={
                errors?.title && touched?.title
                  ? `${errors?.title}`
                  : ''
              }
              error={Boolean(errors.title && touched?.title)}
            />

            <TextArea
              size="large"
              value={values?.message}
              onChangeText={e => {
                setFieldValue('message', e);
              }}
              label={t('message_chat')}
              explanation={
                errors?.message && touched?.message
                  ? `${errors?.message}`
                  : ''
              }
              error={Boolean(errors.message && touched?.message)}
            />

            <Spacing size={8} />

            <Button
              size="large"
              title={t('send_message_chat')}
              onPress={() => handleSubmit()}
            />

            <Spacing size={16} />

          </ScrollView>
        )}
      </Formik>
    </Modal>
  );
};

export default SupportModal;
