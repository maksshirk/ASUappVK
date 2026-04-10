import React from 'react';
import { useState, useEffect } from 'react';
import {
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  FormItem,
  Select,
  Input,
  Checkbox,
  Button,
  Box,
  Text,
} from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSave: () => void;
  saving: boolean;
  user: any;
}

// ==================== ПАРОЛИ ДЛЯ КАЖДОЙ ДОЛЖНОСТИ ====================
const PASSWORD_MAP: Record<string, string> = {
  'Командир 1 отделения': 'Dasha27082018!',
  'Командир 2 отделения': 'Kom2Otd2026!',
  'Командир 3 отделения': 'Kom3Otd2026!',
  'Командир учебной группы': 'KomUchebGr2026',
  'Старшина курса': 'Starshina2026!',
  'Курсовой офицер': 'KursOfficer2026',
  'Начальник курса': 'NachKurs2026!',
  'Заместитель начальника факультета': 'ZamFak2026!',
  'Начальник факультета': 'Fakultet2026!',
  // Добавляй новые должности и пароли сюда
} as const;

export const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  onClose,
  formData,
  setFormData,
  onSave,
  saving,
  user,
}) => {
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'correct' | 'error'>('idle');

  // Получаем правильный пароль для выбранной должности
  const correctPassword = formData.unit ? PASSWORD_MAP[formData.unit] : undefined;
  const shouldShowPasswordField = !!correctPassword;

  // Проверка пароля в реальном времени
  useEffect(() => {
    if (!formData.password || !correctPassword) {
      setPasswordStatus('idle');
      return;
    }

    if (formData.password === correctPassword) {
      setPasswordStatus('correct');
    } else if (formData.password.length >= 6) {
      setPasswordStatus('error');
    } else {
      setPasswordStatus('idle');
    }
  }, [formData.password, correctPassword]);

  // Можно ли сохранить форму
  const canSubmit = 
    formData.agreeToDataProcessing && 
    passwordStatus === 'correct';
  return (
    
    
    <ModalPage
      id="register"
      header={
        <ModalPageHeader
          left={
            <PanelHeaderButton onClick={onClose}>
              <Icon24Cancel />
            </PanelHeaderButton>
          }
        >
          Заполнение профиля
        </ModalPageHeader>
      }
      open={open}
      onClose={onClose}
      settlingHeight={85}
    >
      <Box padding="16px 16px 100px">
        {/* Категория */}
        <FormItem top="Категория">
          <Select
            placeholder="Выберите категорию"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value, password: '' })}
            options={[
              { value: 'Представитель кафедры', label: 'Представитель кафедры' },
              { value: 'Курсант', label: 'Курсант' },
              { value: 'Представитель факультета', label: 'Представитель факультета' },
              { value: 'Абитуриент (поступающий)', label: 'Абитуриент (поступающий)' },
            ]}
          />
        </FormItem>

        {/* Условные поля для Курсанта */}
        {formData.category === 'Курсант' && (
          <>
            <FormItem top="Должность курсанта">
              <Select
                placeholder="Выберите должность"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value, password: '' })}
                options={[
                  { value: 'Курсант', label: 'Курсант' },
                  { value: 'Командир 1 отделения', label: 'Командир 1 отделения' },
                  { value: 'Командир 2 отделения', label: 'Командир 2 отделения' },
                  { value: 'Командир 3 отделения', label: 'Командир 3 отделения' },
                  { value: 'Командир учебной группы', label: 'Командир учебной группы' },
                  { value: 'Старшина курса', label: 'Старшина курса' },
                ]}
              />
            </FormItem>

            <FormItem top="Год набора">
              <Select
                placeholder="Выберите год набора"
                value={formData.year_nabor}
                onChange={(e) => setFormData({ ...formData, year_nabor: e.target.value })}
                options={[
                  { value: '2021', label: '2021' },
                  { value: '2022', label: '2022' },
                  { value: '2023', label: '2023' },
                  { value: '2024', label: '2024' },
                  { value: '2025', label: '2025' },
                  { value: '2026', label: '2026' },
                ]}
              />
            </FormItem>
          </>
        )}

        {formData.category === 'Представитель факультета' && (
          <>
            <FormItem top="Должность представителя факультета">
              <Select
                placeholder="Выберите должность"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value, password: '' })}
                options={[
                  { value: 'Курсовой офицер', label: 'Курсовой офицер' },
                  { value: 'Начальник курса', label: 'Начальник курса' },
                  { value: 'Заместитель начальника факультета', label: 'Заместитель начальника факультета' },
                  { value: 'Начальник факультета', label: 'Начальник факультета' }
                ]}
              />
            </FormItem>

            <FormItem top="Год набора">
              <Select
                placeholder="Выберите год набора курсантов"
                value={formData.year_nabor}
                onChange={(e) => setFormData({ ...formData, year_nabor: e.target.value })}
                options={[
                  { value: '2021', label: '2021' },
                  { value: '2022', label: '2022' },
                  { value: '2023', label: '2023' },
                  { value: '2024', label: '2024' },
                  { value: '2025', label: '2025' },
                  { value: '2026', label: '2026' },
                ]}
              />
            </FormItem>
          </>
        )}



        {/* Факультет */}
        {(formData.category === 'Курсант' || 
          formData.category === 'Представитель кафедры' || 
          formData.category === 'Представитель факультета') && (
          <FormItem top="Факультет">
            <Select
              placeholder="Выберите факультет"
              value={formData.fakultet}
              onChange={(e) => setFormData({ ...formData, fakultet: e.target.value })}
              options={Array.from({ length: 9 }, (_, i) => ({
                value: String(i + 1),
                label: String(i + 1),
              }))}
            />
          </FormItem>
        )}

        {/* Кафедра и Подгруппа */}
        {(formData.category === 'Курсант' || formData.category === 'Представитель кафедры') && (
          <>
            <FormItem top="Кафедра">
              <Select
                placeholder="Выберите кафедру"
                value={formData.kafedra}
                onChange={(e) => setFormData({ ...formData, kafedra: e.target.value })}
                options={Array.from({ length: 7 }, (_, i) => ({
                  value: String(i + 1),
                  label: String(i + 1),
                }))}
              />
            </FormItem>

            <FormItem top="Подгруппа">
              <Select
                placeholder="Выберите подгруппу"
                value={formData.podgruppa}
                onChange={(e) => setFormData({ ...formData, podgruppa: e.target.value })}
                options={[
                  { value: '1', label: '/1' },
                  { value: '2', label: '/2' },
                  { value: '3', label: '/3' },
                  { value: 'Подгруппы нет (одна специализация)', label: 'Подгруппы нет (одна специализация)' },
                ]}
              />
            </FormItem>
          </>
        )}

        {/* Персональные данные */}
        <FormItem top="Фамилия">
          <Input
            placeholder="Введите фамилию"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
        </FormItem>

        <FormItem top="Имя">
          <Input
            placeholder="Введите имя"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </FormItem>

        <FormItem top="Отчество">
          <Input
            placeholder="Введите отчество"
            value={formData.middle_name}
            onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
          />
        </FormItem>

        <FormItem top="Номер телефона">
          <Input
            placeholder="Введите номер телефона"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          />
        </FormItem>

        {/* Поля для Абитуриента */}
        {formData.category === 'Абитуриент (поступающий)' && (
          <>
            <FormItem top="Год поступления">
              <Select
                placeholder="Выберите год поступления"
                value={formData.year_postupleniya}
                onChange={(e) => setFormData({ ...formData, year_postupleniya: e.target.value })}
                options={[
                  { value: '2026', label: '2026' },
                  { value: '2027', label: '2027' },
                  { value: '2028', label: '2028' },
                  { value: '2029', label: '2029' },
                  { value: '2030', label: '2030' },
                  { value: 'Пока неизвестно', label: 'Пока неизвестно' },
                ]}
              />
            </FormItem>

            <FormItem top="Кафедра поступления">
              <Select
                placeholder="Выберите кафедру"
                value={formData.kafedra_postupleniya}
                onChange={(e) => setFormData({ ...formData, kafedra_postupleniya: e.target.value })}
                options={[
                  { value: '1', label: 'Автоматизированных систем управления Космических войск' },
                  { value: '3', label: 'Автоматизации обработки и анализа информации космических средств' },
                  { value: '4', label: 'Автоматизированных систем управления космических комплексов' },
                  { value: '5', label: 'Автоматизированных систем ракетно-космической обороны' },
                  { value: '6', label: 'Метрологического обеспечения вооружения, военной и специальной техники' },
                  { value: 'Пока неизвестно', label: 'Пока неизвестно' },
                ]}
              />
            </FormItem>

            <FormItem top="Реферальный код (если есть)">
              <Input
                placeholder="Введите реферальный код..."
                value={formData.ref_code}
                onChange={(e) => setFormData({ ...formData, ref_code: e.target.value })}
                maxLength={10}
              />
            </FormItem>
          </>
        )}

        {shouldShowPasswordField && (
          <FormItem 
            top="Пароль для подтверждения"
            status={passwordStatus === 'correct' ? 'valid' : passwordStatus === 'error' ? 'error' : undefined}
            bottom={passwordStatus === 'error' ? 'Неверный пароль' : undefined}
          >
            <Input
              type="password"
              placeholder="Введите пароль для вашей должности"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {passwordStatus === 'correct' && (
              <Text style={{ color: 'var(--vkui--color_text_positive)', marginTop: 4 }}>
                ✓ Пароль верный
              </Text>
            )}
          </FormItem>
        )}

        {/* Согласие на обработку данных */}
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

        {/* Кнопка сохранения */}
        <Box
          style={{
            position: 'sticky',
            bottom: 0,
            background: 'var(--vkui--color_background_content)',
            padding: '16px 0 40px',
            marginTop: 32,
          }}
        >
          <Button
            size="l"
            stretched
            onClick={onSave}
            loading={saving}
            disabled={!canSubmit}
            mode="primary"
          >
            Сохранить данные
          </Button>
        </Box>
      </Box>
    </ModalPage>
  );
};