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
  Card,
  Spacing,
  FormItem,
  Input,
  Select,
  ScreenSpinner,
  Banner,
  Snackbar,
} from '@vkontakte/vkui';
import { 
  Icon28UserCircleOutline, 
  Icon28CheckCircleOutline, 
  Icon28EditOutline 
} from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import { API_BASE_URL } from '../AppConfig';

/**
 * Интерфейс данных пользователя (соответствует модели в MongoDB)
 */
interface UserProfile {
  vkUserId: number;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  photo200?: string;
  group?: string;
  course?: string;
  specialty?: string;
}

/**
 * Главный компонент вкладки "Профиль"
 */
export const Profile = () => {

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<React.ReactNode>(null);

  const [formData, setFormData] = useState({
    group: '',
    course: '',
    specialty: '',
  });

  // Загрузка профиля при монтировании компонента
  useEffect(() => {
    loadUserProfile();
  }, []);

  /**
   * Загружает данные пользователя с backend
   */
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
        const data: UserProfile = await response.json();
        
        console.log('📥 Данные от сервера:', data.user);   // ← Очень важно для отладки!

        setUser(data.user);   // ← Здесь должно происходить сохранение
        // Заполняем форму
        setFormData({
          group: data.user.group || '',
          course: data.user.course || '',
          specialty: data.user.specialty || '',
        });
      } else {
        console.warn('Сервер вернул ошибку:', response.status);
      }
    } catch (error) {
      console.error('❌ Ошибка при загрузке профиля:', error);
    } finally {
      
      setIsLoading(false);
    }
  };

  /**
   * Сохраняет изменения профиля
   */
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vkUserId: user.vkUserId,           // ← Важно: используем vkUserId
          group: formData.group.trim(),
          course: formData.course,
          specialty: formData.specialty.trim(),
        }),
      });

      if (response.ok) {
        const updatedUser: UserProfile = await response.json();
        setUser(updatedUser);
        setIsEditing(false);

        setSnackbar(
          <Snackbar
            onClose={() => setSnackbar(null)}
            before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
            duration={2000}
          >
            Профиль успешно сохранён
          </Snackbar>
        );
      } else {
        throw new Error('Ошибка сохранения');
      }
    } catch (err) {
      console.error(err);
      setSnackbar(
        <Snackbar onClose={() => setSnackbar(null)} duration={3000}>
          Не удалось сохранить данные
        </Snackbar>
      );
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
            src={user?.photoUrl || user?.photo200} 
            style={{ margin: '0 auto 16px' }}
          >
            {!user?.photoUrl && !user?.photo200 && <Icon28UserCircleOutline width={48} height={48} />}
          </Avatar>

          <Title level="1" weight="3">
            {user?.firstName} {user?.lastName}
          </Title>
          <Text weight="2" style={{ color: 'var(--vkui--color_text_subtle)', marginTop: 4 }}>
            Студент факультета № 9
          </Text>
        </Box>
      </Group>

      {/* Баннер */}
      {!user?.group && !isEditing && (
        <Group>
          <Banner mode="tint" style={{ margin: 12 }}>
            <Box style={{ padding: '4px 0' }}>
              <Title level="2" weight="3" style={{ marginBottom: 8 }}>
                Заполните профиль
              </Title>
              <Text weight="2" style={{ color: 'var(--vkui--color_text_subtle)' }}>
                Чтобы пользоваться всеми возможностями приложения, 
                укажите группу, курс и направление
              </Text>
            </Box>

            <Button 
              stretched 
              size="l" 
              mode="primary"
              onClick={() => setIsEditing(true)}
              style={{ marginTop: 16 }}
            >
              Заполнить данные
            </Button>
          </Banner>
        </Group>
      )}

      {/* Заполненный профиль */}
      {user?.group && !isEditing && (
        <Group header={<Title level="2">Информация о студенте</Title>}>
          <Card mode="shadow" style={{ margin: '12px' }}>
            <Box>
              <Text weight="2">Группа: <b>{user.group}</b></Text>
              <Spacing size={10} />
              <Text weight="2">Курс: <b>{user.course} курс</b></Text>
              <Spacing size={10} />
              <Text weight="2">Направление подготовки:</Text>
              <Text style={{ marginTop: 4 }}>{user.specialty || 'Не указано'}</Text>
            </Box>
          </Card>

          <Box>
            <Button 
              before={<Icon28EditOutline />} 
              mode="secondary" 
              stretched 
              size="l"
              onClick={() => setIsEditing(true)}
            >
              Редактировать профиль
            </Button>
          </Box>
        </Group>
      )}

      {/* Форма редактирования */}
      {isEditing && (
        <Group header={<Title level="2">Редактирование профиля</Title>}>
          <FormItem top="Группа *" topMultiline>
            <Input
              placeholder="ИК-21-1"
              value={formData.group}
              onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              status={formData.group.trim() ? 'valid' : 'error'}
            />
          </FormItem>

          <FormItem top="Курс *">
            <Select
              placeholder="Выберите курс"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              options={[
                { value: '1', label: '1 курс' },
                { value: '2', label: '2 курс' },
                { value: '3', label: '3 курс' },
                { value: '4', label: '4 курс' },
                { value: '5', label: '5 курс' },
              ]}
            />
          </FormItem>

          <FormItem top="Направление / Специальность">
            <Input
              placeholder="Применение и эксплуатация автоматизированных систем"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            />
          </FormItem>

          <Box style={{ marginTop: 24 }}>
            <Button 
              size="l" 
              mode="primary" 
              stretched 
              onClick={handleSave}
              loading={saving}
              disabled={!formData.group.trim() || !formData.course}
            >
              {saving ? 'Сохраняем...' : 'Сохранить изменения'}
            </Button>

            <Spacing size={8} />

            <Button 
              size="l" 
              mode="tertiary" 
              stretched 
              onClick={() => setIsEditing(false)}
            >
              Отмена
            </Button>
          </Box>
        </Group>
      )}

      {snackbar}
    </Panel>
  );
};