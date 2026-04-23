import React, { useEffect } from 'react';
import {
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  Box,
  Text,
  Avatar,
  ScreenSpinner,
  SimpleCell,
  Card,
  Spacing,
} from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';

interface AllUser {
  vkUserId: number;
  name: string;
  last_name: string;
  photoUrl?: string;
  unit?: string;
  user_group?: string;
  fakultet?: string;
}

interface CheckAllUsersModalProps {
  open: boolean;
  onClose: () => void;
  allusers: AllUser[] | undefined | null;
  loading: boolean;
}

export const CheckAllUsersModal: React.FC<CheckAllUsersModalProps> = ({
  open,
  onClose,
  allusers: rawUsers = [],   // ← переименовали для ясности
  loading,
}) => {
  // Надёжная нормализация данных
  const allusers = Array.isArray(rawUsers) ? rawUsers : [];

  // === УЛУЧШЕННАЯ ОТЛАДКА ===
  useEffect(() => {
    console.group('🔍 CheckAllUsersModal Debug');

    console.log('%cProps received:', 'color: #10b981; font-weight: 600', {
      open,
      loading,
      rawUsersType: typeof rawUsers,
      rawUsersIsArray: Array.isArray(rawUsers),
      rawUsersLength: rawUsers?.length ?? 'N/A',
      normalizedLength: allusers.length,
    });

    if (!Array.isArray(rawUsers)) {
      console.error('❌ allusers пришёл НЕ массивом!', {
        type: typeof rawUsers,
        value: rawUsers,
      });
    }

    if (allusers.length > 0) {
      console.log('%cПервый пользователь:', 'color: #3b82f6', allusers[0]);
    }

    console.groupEnd();
  }, [open, loading, rawUsers]);

  // Лог при открытии модалки
  useEffect(() => {
    if (open) {
      console.log('🟢 Модалка "Все пользователи" открыта | Пользователей:', allusers.length);
    }
  }, [open, allusers.length]);

  return (
    <ModalPage
      id="checkallusers"
      header={
        <ModalPageHeader
          left={
            <PanelHeaderButton onClick={onClose}>
              <Icon24Cancel />
            </PanelHeaderButton>
          }
        >
          Все пользователи
        </ModalPageHeader>
      }
      open={open}
      onClose={onClose}
      settlingHeight={90}
    >
      <Box>
        {loading ? (
          <Box style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <ScreenSpinner />
          </Box>
        ) : allusers.length === 0 ? (
          <Box style={{ textAlign: 'center', padding: '80px 16px' }}>
            <Text weight="2" style={{ color: 'var(--vkui--color_text_secondary)' }}>
              Пользователей в базе не найдено
            </Text>
          </Box>
        ) : (
          <>
            <Box style={{ padding: '12px 16px 20px' }}>
              <Text weight="2">
                Всего пользователей в базе: <b>{allusers.length}</b>
              </Text>
            </Box>

            {/* Теперь .map() безопасен */}
            {allusers.map((u) => (
              <Card key={u.vkUserId} mode="outline" style={{ margin: '8px 8px 12px' }}>
                <SimpleCell
                  before={<Avatar src={u.photoUrl} size={48} />}
                  subtitle={
                    <Text style={{ color: 'var(--vkui--color_text_subtle)' }}>
                      {u.unit || '—'}
                      {u.user_group && ` • ${u.user_group}`}
                      {u.fakultet && ` • Факультет ${u.fakultet}`}
                    </Text>
                  }
                >
                  <Text weight="2">
                    {u.name} {u.last_name}
                  </Text>
                </SimpleCell>
              </Card>
            ))}

            <Spacing size={32} />

            <Box style={{ textAlign: 'center', paddingBottom: '40px' }}>
              <Text style={{ fontSize: 14, color: 'var(--vkui--color_text_subtle)' }}>
                Всего найдено: {allusers.length} пользователей
              </Text>
            </Box>
          </>
        )}
      </Box>
    </ModalPage>
  );
};