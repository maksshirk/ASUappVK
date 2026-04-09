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
} from '@vkontakte/vkui';

import { 
  Icon28UserCircleOutline, 
  Icon24Cancel 
} from '@vkontakte/icons';

import bridge from '@vkontakte/vk-bridge';
import { API_BASE_URL } from '../AppConfig';
import { useSnackbar } from '../contexts/SnackbarContext';

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
  middle_name?: string;
  phone_number?: string;
  group?: string;
  course?: string;
  specialty?: string;
}

export const Profile = () => {
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
  });

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
          middle_name: profile.middle_name || '',
          phone_number: profile.phone_number || '',
        });
      }
    } catch (error) {
      console.error('❌ Ошибка при загрузке профиля:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => setActiveModal('register');
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
          last_name: formData.last_name?.trim() || null,
          name: formData.name?.trim() || null,
          middle_name: formData.middle_name?.trim() || null,
          phone_number: formData.phone_number?.trim() || null,
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
            onClick={openModal}
          >
            {user?.category ? 'Редактировать профиль' : 'Зарегистрироваться'}
          </Button>
        </Box>
      </Group>

      {/* Модальное окно */}
      <ModalPage
        id="register"
        header={
          <ModalPageHeader
            left={
              <PanelHeaderButton onClick={closeModal}>
                <Icon24Cancel />
              </PanelHeaderButton>
            }
          >
            Заполнение профиля
          </ModalPageHeader>
        }
        open={activeModal === 'register'}
        onClose={closeModal}
        settlingHeight={85}
      >
        <Box padding="16px 16px 100px">   {/* ← увеличенный отступ снизу */}
          {/* Все FormItem остаются без изменений */}
          <FormItem top="Категория">
            <Select
              placeholder="Выберите категорию"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Представитель кафедры', label: 'Представитель кафедры' },
                { value: 'Курсант', label: 'Курсант' },
                { value: 'Представитель факультета', label: 'Представитель факультета' },
                { value: 'Абитуриент (поступающий)', label: 'Абитуриент (поступающий)' }
                // Добавь свои группы
              ]}
            />
          </FormItem>

          {formData.category === 'Курсант' && (
            <FormItem top="Должность курсанта">
              <Select
                placeholder="Выберите должность"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                options={[
                  { value: 'Курсант', label: 'Курсант' },
                  { value: 'Командир отделения', label: 'Командир отделения' },
                  { value: 'Командир учебной группы', label: 'Командир учебной группы' },
                  { value: 'Старшина курса', label: 'Старшина курса' }
                  // Добавь свои группы
                ]}
              />
            </FormItem>
          )}
          
          {formData.category === 'Курсант' && (
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
                  { value: '2026', label: '2026' }
                  // Добавь свои группы
                ]}
              />
            </FormItem>
          )}

          {(formData.category === 'Курсант' || formData.category === 'Представитель кафедры' || formData.category === 'Представитель факультета') && (
            <FormItem top="Факультет">
              <Select
                placeholder="Выберите факультет"
                value={formData.fakultet}
                onChange={(e) => setFormData({ ...formData, fakultet: e.target.value })}
                                options={[
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' },
                  { value: '5', label: '5' },
                  { value: '6', label: '6' },
                  { value: '7', label: '7' },
                  { value: '8', label: '8' },
                  { value: '9', label: '9' }
                  // Добавь свои группы
                ]}
              />
            </FormItem>
          )}

          {(formData.category === 'Курсант' || formData.category === 'Представитель кафедры') && (
            <FormItem top="Кафедра">
              <Select
                placeholder="Выберите кафедру"
                value={formData.kafedra}
                onChange={(e) => setFormData({ ...formData, kafedra: e.target.value })}
                                options={[
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' },
                  { value: '5', label: '5' },
                  { value: '6', label: '6' },
                  { value: '7', label: '7' }
                  // Добавь свои группы
                ]}
              />
            </FormItem>
          )}

          {(formData.category === 'Курсант' || formData.category === 'Представитель кафедры') && (
            <FormItem top="Подгруппа">
              <Select
                placeholder="Выберите подгруппу (специализацию)"
                value={formData.podgruppa}
                onChange={(e) => setFormData({ ...formData, podgruppa: e.target.value })}
                                options={[
                  { value: '1', label: '/1' },
                  { value: '2', label: '/2' },
                  { value: '3', label: '/3' },
                  { value: 'Подгруппы нет (одна специализация)', label: 'Подгруппы нет (одна специализация)' }
                  // Добавь свои группы
                ]}
              />
            </FormItem>
          )}

          {(formData.category === 'Курсант' || formData.category === 'Представитель кафедры' || formData.category === 'Представитель факультета') && (
            <FormItem top="Пароль">
              <Input
                placeholder="Введите пароль"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                maxLength={10}
                  // Добавь свои группы
              />
            </FormItem>
          )}

          <FormItem top="Фамилия">
            <Input
              placeholder="Введите фамилию"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                // Добавь свои группы
            />
          </FormItem>
          <FormItem top="Имя">
            <Input
              placeholder="Введите имя"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                // Добавь свои группы
            />
          </FormItem>

          <FormItem top="Отчество">
            <Input
              placeholder="Введите отчество"
              value={formData.middle_name}
              onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                // Добавь свои группы
            />
          </FormItem>

          <FormItem top="Номер телефона">
            <Input
              placeholder="Введите номер телефона"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                // Добавь свои группы
            />
          </FormItem>

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
              onClick={handleSave} 
              loading={saving}
              mode="primary"
            >
              Сохранить данные
            </Button>
          </Box>
        </Box>
      </ModalPage>
    </Panel>
  );
};