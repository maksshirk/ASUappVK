import React from 'react';
import {
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  FormItem,
  Input,
  Checkbox,
  Button,
  Box,
  Text,
} from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';

interface DokladModalProps {
  open: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSave: () => void;
  saving: boolean;
  captchaNum1: number;
  captchaNum2: number;
  refreshCaptcha: () => void;
}

export const DokladModal: React.FC<DokladModalProps> = ({
  open,
  onClose,
  formData,
  setFormData,
  onSave,
  saving,
  captchaNum1,
  captchaNum2,
  refreshCaptcha,
}) => {
  return (
    <ModalPage
      id="doklad"
      header={
        <ModalPageHeader
          left={
            <PanelHeaderButton onClick={onClose}>
              <Icon24Cancel />
            </PanelHeaderButton>
          }
        >
          Доклад о состоянии дел
        </ModalPageHeader>
      }
      open={open}
      onClose={onClose}
      settlingHeight={85}
    >
      <Box padding="16px 16px 100px">
        <FormItem top="Проверка на человечность 🤖">
          <Box style={{ padding: '12px 0 8px' }}>
            <Text weight="2" style={{ marginBottom: 12, fontSize: 17 }}>
              Сколько будет <b>{captchaNum1} + {captchaNum2}</b> ?
            </Text>

            <Input
              placeholder="Введите ответ"
              value={formData.captchaAnswer}
              onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value.trim() })}
              type="number"
              maxLength={3}
              status={
                formData.captchaAnswer && parseInt(formData.captchaAnswer) !== captchaNum1 + captchaNum2
                  ? 'error'
                  : undefined
              }
            />
          </Box>
        </FormItem>

        <FormItem>
          <Checkbox
            checked={formData.agreeToDataProcessing}
            onChange={(e) => setFormData({ ...formData, agreeToDataProcessing: e.target.checked })}
          >
            Я даю согласие на обработку моих персональных данных в соответствии с{' '}
            <Text weight="2" style={{ color: 'var(--vkui--color_text_link)' }}>
              Федеральным законом № 152-ФЗ «О персональных данных»
            </Text>
          </Checkbox>
        </FormItem>

        <Box
          style={{
            position: 'sticky',
            bottom: 0,
            background: 'var(--vkui--color_background_content)',
            padding: '16px 0 40px',
            marginTop: 24,
          }}
        >
          <Button
            size="l"
            stretched
            onClick={onSave}
            loading={saving}
            disabled={
              !formData.agreeToDataProcessing ||
              !formData.captchaAnswer ||
              parseInt(formData.captchaAnswer) !== captchaNum1 + captchaNum2
            }
            mode="primary"
          >
            Отправить доклад
          </Button>
        </Box>
      </Box>
    </ModalPage>
  );
};