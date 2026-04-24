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
  ScreenSpinner,
} from '@vkontakte/vkui';

import { 
  Icon28UserCircleOutline, 
  Icon24Cancel,
  Icon28Users 
} from '@vkontakte/icons';

import bridge from '@vkontakte/vk-bridge';
import { API_BASE_URL } from '../AppConfig';
import { useSnackbar } from '../contexts/SnackbarContext';

import { RegisterModal } from '../components/modals/RegisterModal';
import { DokladModal } from '../components/modals/DokladModal';
import { StatusModal } from '../components/modals/StatusModal';
import { CheckDokladModal } from '../components/modals/CheckDokladModal';
import { CheckAllUsersModal } from '../components/modals/CheckAllUsersModal';

interface UserProfile {
  vkUserId: number;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  photo200?: string;
  category?: string;
  unit?: string;
  year_nabor?: string;
  fakultet?: string;
  kafedra?: string;
  podgruppa?: string;
  status?: string;
  middle_name?: string;
  phone_number?: string;
  kafedra_postupleniya?: string;
  year_postupleniya?: string;
  ref_code?: string;
  agreeToDataProcessing: boolean;
  // другие поля...
}

export const Profile = () => {
  // ==================== Состояния ====================
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [subordinates, setSubordinates] = useState<any[]>([]);
  const [loadingSubordinates, setLoadingSubordinates] = useState(false);

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);

  const [captchaNum1, setCaptchaNum1] = useState(() => Math.floor(Math.random() * 11) + 5);
  const [captchaNum2, setCaptchaNum2] = useState(() => Math.floor(Math.random() * 11) + 5);

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

  const { showSnackbar } = useSnackbar();

  // ==================== Эффекты ====================
  useEffect(() => {
    if (activeModal === 'doklad') {
      refreshCaptcha();
    }
  }, [activeModal]);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const refreshCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 11) + 5);
    setCaptchaNum2(Math.floor(Math.random() * 11) + 5);
    setFormData(prev => ({ ...prev, captchaAnswer: '' }));
  };

  // ==================== Загрузка профиля ====================
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
      }
    } catch (error) {
      console.error('❌ Ошибка при загрузке профиля:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== Открытие модалок ====================
  const openModal_register = () => setActiveModal('register');
  const openModal_doklad = () => setActiveModal('doklad');
  const openModal_status = () => setActiveModal('status');

  const openModal_checkdoklad = async () => {
    setActiveModal('checkdoklad');
    await handleSave_checkdoklad();
  };

  const openModal_checkallusers = async () => {
    setActiveModal('checkallusers');
    await handleSave_checkallusers();
  };

  const closeModal = () => setActiveModal(null);

  // ==================== Обработчики ====================
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
    const getMoscowTime = () => {
      const now = new Date();
      const moscowTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
      
      const hours = moscowTime.getUTCHours();
      const minutes = moscowTime.getUTCMinutes();
      
      return { hours, minutes };
    };
    const { hours, minutes } = getMoscowTime();
    console.log(`Московское время: ${hours}:${minutes}`);
    const currentMinutes = hours * 60 + minutes;
    const targetMinutes = 21 * 60 + 30;
    if (currentMinutes < targetMinutes) {
      showSnackbar('Доклад производится не раньше 21:30!', 'error');
      return;
    }
    
    if (!user?.status || user.status.trim() === '') {
      showSnackbar('Сначала установите свой статус', 'error');
      return;
    }

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

  const handleSave_checkdoklad = async () => {
    setLoadingSubordinates(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/doklad/subordinates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vkUserId: user?.vkUserId  // ← берём из formData, а не из user
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubordinates(data.subordinates || []);
      } else {
        throw new Error('Ошибка загрузки');
      }
    } catch (error) {
      console.error(error);
      showSnackbar('Не удалось загрузить подчинённых', 'error');
      setSubordinates([]);
    } finally {
      setLoadingSubordinates(false);
    }
  };

  const handleSave_checkallusers = async () => {
    setLoadingAllUsers(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/allusers`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // ✅ Правильное извлечение массива пользователей
      let usersArray: AllUser[] = [];

      if (data?.success && Array.isArray(data.allUsers)) {
        usersArray = data.allUsers;
      } 
      else if (Array.isArray(data.allusers)) {
        usersArray = data.allusers;
      } 
      else if (Array.isArray(data.users)) {
        usersArray = data.users;
      } 
      else if (Array.isArray(data)) {
        usersArray = data;
      }

      console.log(`✅ Загружено пользователей: ${usersArray.length}`);
      
      // Дополнительная отладка
      if (usersArray.length > 0) {
        console.log('Первый пользователь:', usersArray[0]);
      }

      setAllUsers(usersArray);

    } catch (error) {
      console.error('❌ Ошибка при загрузке всех пользователей:', error);
      showSnackbar('Не удалось загрузить всех пользователей', 'error');
      setAllUsers([]);
    } finally {
      setLoadingAllUsers(false);
    }
  };

  // ==================== Рендер ====================
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
          <Avatar size={96} src={user?.photo200 || user?.photoUrl} style={{ margin: '0 auto 16px' }}>
            {!user?.photo200 && !user?.photoUrl && <Icon28UserCircleOutline width={48} height={48} />}
          </Avatar>
          <Title level="1" weight="3">
            {user?.firstName} {user?.lastName}
          </Title>
          <Text weight="2" style={{ color: 'var(--vkui--color_text_subtle)', marginTop: 4 }}>
            Мой пригласительный код: {user?.vkUserId}
          </Text>
          <Text weight="2" style={{ color: 'var(--vkui--color_text_subtle)', marginTop: 4 }}>
            Страничка находится в разработке
          </Text>
        </Box>
      </Group>

      {/* Кнопки */}
      <Group>
        <Box padding="0 16px 16px">
          <Button size="l" stretched mode="primary" onClick={openModal_register}>
            {user?.category ? 'Редактировать профиль' : 'Заполнить профиль'}
          </Button>
        </Box>

        {(user?.category === 'Курсант' || user?.unit === 'Курсовой офицер' || user?.unit === 'Начальник курса') && (
          <>
            <Box padding="0 16px 16px">
              <Button size="l" stretched mode="primary" onClick={openModal_doklad}>
                Доклад о состоянии дел
              </Button>
            </Box>
            <Box padding="0 16px 16px">
              <Button size="l" stretched mode="primary" onClick={openModal_status}>
                Изменить статус
              </Button>
            </Box>
          </>
        )}

        {(user?.unit?.includes('Командир') || user?.unit === 'Старшина курса' || user?.unit === 'Курсовой офицер' || user?.unit === 'Начальник курса') && (
          <Box padding="0 16px 16px">
            <Button 
              size="l" 
              stretched 
              mode="secondary" 
              onClick={openModal_checkdoklad}
              before={<Icon28Users />}
            >
              Доклады подчинённых
            </Button>
          </Box>
        )}

        {user?.unit === 'Начальник курса' && (
          <Box padding="0 16px 16px">
            <Button 
              size="l" 
              stretched 
              mode="secondary" 
              onClick={openModal_checkallusers}
              before={<Icon28Users />}
            >
              Показать всех пользователей
            </Button>
          </Box>
        )}
      </Group>

      {/* Модальные окна */}
      <RegisterModal open={activeModal === 'register'} onClose={closeModal} formData={formData} setFormData={setFormData} onSave={handleSave} saving={saving} user={user} />

      <DokladModal open={activeModal === 'doklad'} onClose={closeModal} formData={formData} setFormData={setFormData} onSave={handleSave_doklad} saving={saving} captchaNum1={captchaNum1} captchaNum2={captchaNum2} refreshCaptcha={refreshCaptcha} />

      <StatusModal open={activeModal === 'status'} onClose={closeModal} formData={formData} setFormData={setFormData} onSave={handleSave_status} saving={saving} user={user} />

      <CheckDokladModal
        open={activeModal === 'checkdoklad'}
        onClose={closeModal}
        subordinates={subordinates}
        loading={loadingSubordinates}
        user={user}
      />

      <CheckAllUsersModal
        open={activeModal === 'checkallusers'}
        onClose={closeModal}
        allusers={allUsers}           // ← исправлено имя пропса
        loading={loadingAllUsers}
      />
    </Panel>
  );
};