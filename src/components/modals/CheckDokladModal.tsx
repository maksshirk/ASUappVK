import React from 'react';
import { useState } from 'react';
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
  Checkbox,
  Input
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
  const [showOnlyNotReported, setShowOnlyNotReported] = useState(false);
  const [showOnlyOnFace, setShowOnlyOnFace] = useState(false);
  const [showOnlyOnService, setShowOnlyOnService] = useState(false);
  const [showOnlyBarak, setShowOnlyBarak] = useState(false);
  const [showOnlyOtpusk, setShowOnlyOtpusk] = useState(false);
  const [showOnlyHospital, setShowOnlyHospital] = useState(false);
  const [showOnlyYval, setShowOnlyYval] = useState(false);
  const [showOnlyKomandirovka, setShowOnlyKomandirovka] = useState(false);
  const [showOnlyLazaret, setShowOnlyLazaret] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const filteredSubordinates = subordinates
  .filter(sub => {
    // Фильтр по статусу доклада
    if (showOnlyNotReported && sub.dokladToday) return false;
    if (showOnlyOnFace && sub.status === "На лицо") return false;
    if (showOnlyOnService && sub.status === "В наряде") return false;
    if (showOnlyBarak && sub.status === "В казарме") return false;
    if (showOnlyOtpusk && sub.status === "В отпуске") return false;
    if (showOnlyHospital && sub.status === "В госпитале") return false;
    if (showOnlyYval && sub.status === "В увольнении") return false;
    if (showOnlyKomandirovka && sub.status === "В командировке") return false;
    if (showOnlyLazaret && sub.status === "В лазарете") return false;
    // Поиск по ФИО
    if (searchQuery) {
      const fullName = `${sub.firstName} ${sub.lastName}`.toLowerCase();
      if (!fullName.includes(searchQuery.toLowerCase())) return false;
    }
    
    return true;
  })
  .map(sub => ({
    ...sub,
    displayStatus: sub.dokladToday ? 'Доложил' : 'Не доложил'
  }));

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
            <Input 
              placeholder="Поиск по имени..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Checkbox onChange={() => setShowOnlyNotReported(!showOnlyNotReported)}>
              Показать только не доложивших
            </Checkbox>
            <Checkbox onChange={() => setShowOnlyOnFace(!showOnlyOnFace)}>
              Скрыть тех, кто на лицо
            </Checkbox>
            <Checkbox onChange={() => setShowOnlyOnService(!showOnlyOnService)}>
              Скрыть тех, кто в наряде
            </Checkbox>
            <Checkbox onChange={() => setShowOnlyBarak(!showOnlyBarak)}>
              Скрыть тех, кто в казарме
            </Checkbox>
            <Checkbox onChange={() => setShowOnlyOtpusk(!showOnlyOtpusk)}>
              Скрыть тех, кто в отпуске
            </Checkbox>
            <Checkbox onChange={() => setShowOnlyHospital(!showOnlyHospital)}>
              Скрыть тех, кто в госпитале
            </Checkbox>
            <Checkbox onChange={() => setShowOnlyYval(!showOnlyYval)}>
              Скрыть тех, кто в увольнении
            </Checkbox>
            <Checkbox onChange={() => setShowOnlyKomandirovka(!showOnlyKomandirovka)}>
              Скрыть тех, кто в командировке
            </Checkbox>
            <Checkbox onChange={() => setShowOnlyLazaret(!showOnlyLazaret)}>
              Скрыть тех, кто в лазарете
            </Checkbox>
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
            {filteredSubordinates.map((sub) => (
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