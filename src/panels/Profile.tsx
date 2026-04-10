import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Title,
  Text,
  Box,
  Button,
  Avatar,
  FormItem,
  Input,
  Select,
  ScreenSpinner,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  Checkbox
} from '@vkontakte/vkui';

import { 
  Icon28UserCircleOutline, 
  Icon24Cancel 
} from '@vkontakte/icons';

import bridge from '@vkontakte/vk-bridge';
import { API_BASE_URL } from '../AppConfig';
import { useSnackbar } from '../contexts/SnackbarContext';

import { RegisterModal } from '../components/modals/RegisterModal';
import { DokladModal } from '../components/modals/DokladModal';
import { StatusModal } from '../components/modals/StatusModal';

interface UserProfile {
  vkUserId: number;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  photo200?: string;
  // Новые поля
  category?: string;
  unit?: string;
  year_nabor?: string;
  fakultet?: string;
  kafedra?: string;
  podgruppa?: string;
  password?: string;
  last_name?: string;
  name?: string;
  status?: string;
  middle_name?: string;
  phone_number?: string;
  kafedra_postupleniya?: string;
  year_postupleniya?: string;
  ref_code?: string;
  agreeToDataProcessing: boolean;
 // Добавляем поле для согласия на обработку данных
}

export const Profile = () => {
    // В начале компонента (состояния)
  const [captchaNum1, setCaptchaNum1] = useState(() => Math.floor(Math.random() * 11) + 5);
  const [captchaNum2, setCaptchaNum2] = useState(() => Math.floor(Math.random() * 11) + 5);

  // Функция обновления капчи

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showSnackbar } = useSnackbar();

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category: '',
    unit: '',
    year_nabor: '',
    fakultet: '',
    kafedra: '',
    podgruppa: '',
    password: '',
    last_name: '',
    name: '',
    middle_name: '',
    phone_number: '',
    kafedra_postupleniya: '',
    year_postupleniya: '',
    ref_code: '',
    status: '',
    captchaAnswer: '',
    agreeToDataProcessing: false,
  });
  useEffect(() => {
    if (activeModal === 'doklad') {
      refreshCaptcha();
    }
  }, [activeModal]);

  const refreshCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 11) + 5);
    setCaptchaNum2(Math.floor(Math.random() * 11) + 5);
    setFormData(prev => ({ ...prev, captchaAnswer: '' }));
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const vkUser = await bridge.send('VKWebAppGetUserInfo');

      const response = await fetch(`${API_BASE_URL}/api/save-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vkUserId: vkUser.id,
          firstName: vkUser.first_name,
          lastName: vkUser.last_name,
          photoUrl: vkUser.photo_100,
          photo200: vkUser.photo_200,
          city: vkUser.city,
          country: vkUser.country,
          sex: vkUser.sex,
          bdate: vkUser.bdate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const profile = data.user || data;

        setUser(profile);

        setFormData({
          category: profile.category || '',
          unit: profile.unit || '',
          year_nabor: profile.year_nabor || '',
          fakultet: profile.fakultet || '',
          kafedra: profile.kafedra || '',
          podgruppa: profile.podgruppa || '',
          password: profile.password || '',
          last_name: profile.last_name || '',
          name: profile.name || '',
          status: profile.status || '',
          middle_name: profile.middle_name || '',
          phone_number: profile.phone_number || '',
          kafedra_postupleniya: profile.kafedra_postupleniya || '',
          year_postupleniya: profile.year_postupleniya || '',
          ref_code: profile.ref_code || '',
          captchaAnswer: '', // Капча не сохраняется, всегда начинается с пустой строки
          agreeToDataProcessing: profile.agreeToDataProcessing || false, // Добавляем поле для согласия на обработку данных
        });
      }
    } catch (error) {
      console.error('❌ Ошибка при загрузке профиля:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal_register = () => setActiveModal('register');
  const openModal_doklad = () => setActiveModal('doklad');
  const openModal_status = () => setActiveModal('status');

  const closeModal = () => setActiveModal(null);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vkUserId: user.vkUserId,
          category: formData.category || null,
          unit: formData.unit || null,
          year_nabor: formData.year_nabor || null,
          fakultet: formData.fakultet || null,
          kafedra: formData.kafedra || null,
          podgruppa: formData.podgruppa || null,
          password: formData.password || null,
          kafedra_postupleniya: formData.kafedra_postupleniya || null,
          year_postupleniya: formData.year_postupleniya || null,
          status: formData.status || null,
          ref_code: formData.ref_code || null,
          last_name: formData.last_name?.trim() || null,
          name: formData.name?.trim() || null,
          middle_name: formData.middle_name?.trim() || null,
          phone_number: formData.phone_number?.trim() || null,
          agreeToDataProcessing: formData.agreeToDataProcessing,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        showSnackbar('Профиль успешно сохранён');
        closeModal();
      } else {
        throw new Error('Ошибка сохранения');
      }
    } catch (err) {
      console.error(err);
      showSnackbar('Не удалось сохранить данные', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSave_doklad = async () => {
    // Проверка капчи
    if (!formData.captchaAnswer || parseInt(formData.captchaAnswer) !== captchaNum1 + captchaNum2) {
      showSnackbar('Неверный ответ на проверку!', 'error');
      refreshCaptcha();
      return;
    }

    // Проверка согласия
    if (!formData.agreeToDataProcessing) {
      showSnackbar('Необходимо дать согласие на обработку данных', 'error');
      return;
    }

    if (!user) return;

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/doklad`, {  // ← поменяй эндпоинт при необходимости
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vkUserId: user.vkUserId,
        }),
      });

      if (response.ok) {
        showSnackbar('Доклад успешно отправлен!', 'success');
        closeModal();
        // Можно сбросить форму
        setFormData(prev => ({ ...prev, captchaAnswer: '', agreeToDataProcessing: false }));
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (err) {
      console.error(err);
      showSnackbar('Не удалось отправить доклад', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSave_status = async () => {
    // Проверка согласия
    if (!formData.agreeToDataProcessing) {
      showSnackbar('Необходимо дать согласие на обработку данных', 'error');
      return;
    }

    // Проверка, что статус действительно выбран и отличается от текущего (по желанию)
    if (!formData.status || formData.status === user?.status) {
      showSnackbar('Выберите новый статус', 'error');
      return;
    }

    if (!user) return;

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vkUserId: user.vkUserId,
          status: formData.status,        // ← берём из formData, а не из user
        }),
      });

      if (response.ok) {
        const result = await response.json();

        showSnackbar('Статус успешно обновлён!', 'success');
        closeModal();

        // Обновляем локальное состояние пользователя
        setUser(prev => prev ? { ...prev, status: formData.status } : null);

        // Сброс формы
        setFormData(prev => ({ 
          ...prev, 
          agreeToDataProcessing: false,
          status: ''   // если нужно сбросить
        }));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка сервера');
      }
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
      showSnackbar('Не удалось обновить статус', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Panel id="profile">
        <PanelHeader>Профиль</PanelHeader>
        <Box style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ScreenSpinner />
        </Box>
      </Panel>
    );
  }

  return (
    <Panel id="profile">
      <PanelHeader>Профиль</PanelHeader>

      {/* Шапка */}
      <Group>
        <Box style={{ textAlign: 'center', padding: '32px 16px 20px' }}>
          <Avatar 
            size={96} 
            src={user?.photo200 || user?.photoUrl} 
            style={{ margin: '0 auto 16px' }}
          >
            {!user?.photo200 && !user?.photoUrl && <Icon28UserCircleOutline width={48} height={48} />}
          </Avatar>

          <Title level="1" weight="3">
            {user?.firstName} {user?.lastName}
          </Title>
          <Text weight="2" style={{ color: 'var(--vkui--color_text_subtle)', marginTop: 4 }}>
            Страничка находится в разработке, скоро появятся дополнительные функции!
          </Text>
        </Box>
      </Group>

      {/* Кнопка открытия формы */}
      <Group>
        <Box padding="0 16px 16px">
          <Button 
            size="l" 
            stretched 
            mode="primary" 
            onClick={openModal_register}
          >
            {user?.category ? 'Редактировать профиль' : 'Заполнить профиль (для связи с Вами)'}
          </Button>
        </Box>

        <Box padding="0 16px 16px">
          {user?.category === 'Курсант' && (
            <Button 
              size="l" 
              stretched 
              mode="primary" 
              onClick={openModal_doklad}
            >
              Доклад о состоянии дел
            </Button>
          )}
        </Box>

        <Box padding="0 16px 16px">
          {user?.category === 'Курсант' && (
            <Button 
              size="l" 
              stretched 
              mode="primary" 
              onClick={openModal_status}
            >
              Изменить статус
            </Button>
          )}
        </Box>
      </Group>

      {/* Модальные окна */}
      <RegisterModal
        open={activeModal === 'register'}
        onClose={closeModal}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        saving={saving}
        user={user}
      />

      <DokladModal
        open={activeModal === 'doklad'}
        onClose={closeModal}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave_doklad}
        saving={saving}
        captchaNum1={captchaNum1}
        captchaNum2={captchaNum2}
        refreshCaptcha={refreshCaptcha}
      />

      <StatusModal
        open={activeModal === 'status'}
        onClose={closeModal}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave_status}
        saving={saving}
        user={user}
      />
    </Panel>
  );
};