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
import { Icon28UserCircleOutline, Icon28CheckCircleOutline, Icon28EditOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import { API_BASE_URL } from '../AppConfig';

/**
 * Интерфейс данных пользователя, которые хранятся в MongoDB
 */
interface UserProfile {
  vkId: number;           // Уникальный ID пользователя из ВКонтакте
  firstName: string;      // Имя
  lastName: string;       // Фамилия
  photoUrl?: string;      // Ссылка на аватар пользователя
  group?: string;         // Номер учебной группы
  course?: string;        // Текущий курс обучения
  specialty?: string;     // Специальность / направление подготовки
}

/**
 * Главный компонент вкладки "Профиль"
 */
export const Profile = () => {

  // ==================== СОСТОЯНИЯ (useState) ====================

  /**
   * Хранит полные данные пользователя, полученные из MongoDB
   * null = данные ещё не загружены или произошла ошибка
   */
  const [user, setUser] = useState<UserProfile | null>(null);

  /**
   * Показывает, загружаются ли сейчас данные с сервера
   * true → показываем крутящийся спиннер (ScreenSpinner)
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Режим редактирования профиля
   * true  → показываем форму для изменения данных
   * false → показываем обычный вид профиля (или баннер для заполнения)
   */
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Состояние процесса сохранения данных
   * Нужно, чтобы отключать кнопку и показывать текст "Сохраняем..." во время запроса
   */
  const [saving, setSaving] = useState(false);

  /**
   * Snackbar (всплывающее уведомление внизу экрана)
   * Используется для показа сообщений об успехе или ошибке
   */
  const [snackbar, setSnackbar] = useState<React.ReactNode>(null);

  /**
   * Данные формы редактирования
   * Хранит то, что пользователь вводит в поля
   */
  const [formData, setFormData] = useState({
    group: '',
    course: '',
    specialty: '',
  });

  // ==================== ЭФФЕКТЫ ====================

  /**
   * Этот эффект выполняется один раз при первом открытии вкладки "Профиль"
   * Аналогично componentDidMount в классовых компонентах
   */
  useEffect(() => {
    loadUserProfile();
  }, []);   // Пустой массив зависимостей = выполняется только при монтировании

  // ==================== ОСНОВНЫЕ ФУНКЦИИ ====================

  /**
   * Основная функция загрузки профиля пользователя
   * Выполняет два важных действия:
   * 1. Получает данные из VK (имя, фамилия, фото)
   * 2. Отправляет их на backend для проверки/создания записи в MongoDB
   */
  const loadUserProfile = async () => {
    setIsLoading(true);                    // Включаем индикатор загрузки

    try {
      // Получаем информацию о текущем пользователе из VK
      const vkUser = await bridge.send('VKWebAppGetUserInfo');

      // Отправляем данные на наш сервер
      const res = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vkId: vkUser.id,
          firstName: vkUser.first_name,
          lastName: vkUser.last_name,
          photoUrl: vkUser.photo_200,
        }),
      });

      if (res.ok) {
        const data: UserProfile = await res.json();
        setUser(data);                     // Сохраняем полученные данные

        // Заполняем форму текущими значениями из базы данных
        setFormData({
          group: data.group || '',
          course: data.course || '',
          specialty: data.specialty || '',
        });
      }
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
    } finally {
      setIsLoading(false);                 // В любом случае выключаем загрузку
    }
  };

  /**
   * Сохраняет изменения профиля на сервере (в MongoDB)
   * Вызывается при нажатии кнопки "Сохранить изменения"
   */
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);                       // Показываем, что идёт сохранение

    try {
      const res = await fetch(`${API_BASE_URL}/user/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vkId: user.vkId,
          group: formData.group.trim(),
          course: formData.course,
          specialty: formData.specialty.trim(),
        }),
      });

      if (res.ok) {
        const updatedUser: UserProfile = await res.json();
        
        setUser(updatedUser);              // Обновляем данные в интерфейсе
        setIsEditing(false);               // Выходим из режима редактирования

        // Показываем уведомление об успешном сохранении
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
        throw new Error('Ошибка при сохранении на сервере');
      }
    } catch (err) {
      console.error(err);
      setSnackbar(
        <Snackbar onClose={() => setSnackbar(null)} duration={3000}>
          Не удалось сохранить данные. Попробуйте позже.
        </Snackbar>
      );
    } finally {
      setSaving(false);                    // Снимаем состояние сохранения
    }
  };

  // ==================== УСЛОВНЫЙ РЕНДЕР (что показывать) ====================

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

      {/* Шапка с аватаром и именем */}
      <Group>
        <Box style={{ textAlign: 'center', padding: '32px 16px 20px' }}>
          <Avatar 
            size={96} 
            src={user?.photoUrl} 
            style={{ margin: '0 auto 16px' }}
          >
            {!user?.photoUrl && <Icon28UserCircleOutline width={48} height={48} />}
          </Avatar>

          <Title level="1" weight="3">
            {user?.firstName} {user?.lastName}
          </Title>
          <Text style={{ color: 'var(--vkui--color_text_subtle)', marginTop: 4 }}>
            Студент факультета № 9
          </Text>
        </Box>
      </Group>

      {/* Баннер для новых пользователей */}
      {!user?.group && !isEditing && (
        <Group>
          <Banner
            mode="tint"
            style={{ margin: '12px' }}
          >
            <Box style={{ padding: '4px 0' }}>
              <Title level="2" weight="3" style={{ marginBottom: 8 }}>
                Заполните профиль
              </Title>
              <Text style={{ color: 'var(--vkui--color_text_subtle)' }}>
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

      {/* Показываем заполненный профиль */}
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

      {/* Форма редактирования профиля */}
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

      {/* Всплывающее уведомление */}
      {snackbar}
    </Panel>
  );
};