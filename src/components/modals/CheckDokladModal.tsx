import React from 'react';
import {
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  Box,
  Text,
  Avatar,
  ScreenSpinner,
  Spacing,
  SimpleCell,
  Card,
} from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';

interface Subordinate {
  vkUserId: number;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  unit?: string;
  podgruppa?: string;
  dokladToday: boolean;
  lastDokladTime?: string;
  status?: string;
}

interface CheckDokladModalProps {
  open: boolean;
  onClose: () => void;
  subordinates: Subordinate[];
  loading: boolean;
  user?: any;
}

export const CheckDokladModal: React.FC<CheckDokladModalProps> = ({
  open,
  onClose,
  subordinates,
  loading,
  user,
}) => {
  return (
    <ModalPage
      id="checkdoklad"
      header={
        <ModalPageHeader
          left={
            <PanelHeaderButton onClick={onClose}>
              <Icon24Cancel />
            </PanelHeaderButton>
          }
        >
          Доклады подчинённых
        </ModalPageHeader>
      }
      open={open}
      onClose={onClose}
      settlingHeight={85}
    >
      <Box>
        {loading ? (
          <Box style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <ScreenSpinner />
          </Box>
        ) : subordinates.length === 0 ? (
          <Box style={{ textAlign: 'center', padding: '60px 16px' }}>
            <Text weight="2" style={{ color: 'var(--vkui--color_text_secondary)' }}>
              Подчинённых не найдено
            </Text>
          </Box>
        ) : (
          <>
            {/* Статистика сверху */}
            <Box style={{ padding: '12px 16px 20px' }}>
              <Text weight="2" style={{ color: 'var(--vkui--color_text_subtle)' }}>
                Сегодня доложили: {' '}
                <Text weight="2" style={{ color: 'var(--vkui--color_positive)' }}>
                  {subordinates.filter(s => s.dokladToday).length}
                </Text>{' '}
                из {subordinates.length}
              </Text>
            </Box>

            {/* Вертикальный список */}
            {subordinates.map((sub) => (
              <Card key={sub.vkUserId} mode="outline" style={{ margin: '0 8px 12px' }}>
                <SimpleCell
                  before={
                    <Avatar 
                      src={sub.photoUrl} 
                      size={48}
                    />
                  }
                  subtitle={
                    (sub.unit || sub.podgruppa) && (
                      <Text style={{ color: 'var(--vkui--color_text_subtle)' }}>
                       {sub.status} {sub.unit} {sub.podgruppa && `• ${sub.podgruppa}`}
                      </Text>
                    )
                  }
                  indicator={
                    <Text 
                      weight="2"
                      style={{ 
                        color: sub.dokladToday 
                          ? 'var(--vkui--color_positive)' 
                          : 'var(--vkui--color_negative)' 
                      }}
                    >
                      {sub.dokladToday ? '✅ Доложил' : '❌ Не доложил'}
                    </Text>
                  }
                >
                  <Text weight="2">
                    {sub.firstName} {sub.lastName} 
                  </Text>
                  {sub.dokladToday && sub.lastDokladTime && (
                    <Text style={{ fontSize: 14, color: 'var(--vkui--color_text_subtle)' }}>
                        Доложил в {sub.lastDokladTime}
                    </Text>
                  )}
                </SimpleCell>

                {sub.dokladToday && sub.lastDokladTime && (
                  <Box style={{ padding: '0 16px 16px' }}>
                    <Text style={{ fontSize: 14, color: 'var(--vkui--color_text_subtle)' }}>
                      Доложил в {sub.lastDokladTime}
                    </Text>
                  </Box>
                )}
              </Card>
            ))}

            <Box style={{ padding: '20px 16px 40px', textAlign: 'center' }}>
              <Text style={{ fontSize: 14, color: 'var(--vkui--color_text_subtle)' }}>
                Список обновляется автоматически при открытии окна
              </Text>
            </Box>
          </>
        )}
      </Box>
    </ModalPage>
  );
};