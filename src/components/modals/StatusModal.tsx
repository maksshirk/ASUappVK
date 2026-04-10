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
  Select
} from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';

interface StatusModalProps {
  open: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSave: () => void;
  saving: boolean;
  user: any;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  open,
  onClose,
  formData,
  setFormData,
  onSave,
  saving,
  user: any
}) => {
  return (
    <ModalPage
      id="status"
      header={
        <ModalPageHeader
          left={
            <PanelHeaderButton onClick={onClose}>
              <Icon24Cancel />
            </PanelHeaderButton>
          }
        >
          Статус
        </ModalPageHeader>
      }
      open={open}
      onClose={onClose}
      settlingHeight={85}
    >
      <Box padding="16px 16px 100px">
        <FormItem top="Статус">
            <Select
            placeholder="Выберите статус"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
                { value: 'На лицо', label: 'На лицо' },
                { value: 'В наряде', label: 'В наряде' },
                { value: 'В казарме', label: 'В казарме' },
                { value: 'В отпуске', label: 'В отпуске' },
                { value: 'В госпитале', label: 'В госпитале' },
                { value: 'В увольнении', label: 'В увольнении' },
                { value: 'В командировке', label: 'В командировке' },
                { value: 'В лазарете', label: 'В лазарете' },
            ]}
            />
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
              !formData.agreeToDataProcessing 
            }
            mode="primary"
          >
            Изменить статус
          </Button>
        </Box>
      </Box>
    </ModalPage>
  );
};