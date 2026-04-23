import React, { useState } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Title,
  SimpleGrid,
  Box,
  Text,
  Spacing,
  Button,
} from '@vkontakte/vkui';

import { DepartmentCard } from '../components/DepartmentCard';

// Импорт изображений
import Kafedra_91 from '../assets/Kafedra_91.gif';
import Kafedra_93 from '../assets/Kafedra_93.png';
import Kafedra_94 from '../assets/Kafedra_94.png';
import Kafedra_95 from '../assets/Kafedra_95.png';
import Kafedra_96 from '../assets/Kafedra_96.jpg';

import Info_Kafedra_91 from '../assets/Info_Kafedra_91.jpg';
import Info_Kafedra_93_1 from '../assets/Info_Kafedra_93_1.jpg';
import Info_Kafedra_93_2 from '../assets/Info_Kafedra_93_2.jpg';
import Info_Kafedra_93_3 from '../assets/Info_Kafedra_93_3.jpg';
import Info_Kafedra_94_1 from '../assets/Info_Kafedra_94_1.jpg';
import Info_Kafedra_94_2 from '../assets/Info_Kafedra_94_2.jpg';
import Info_Kafedra_95_1 from '../assets/Info_Kafedra_95_1.jpg';
import Info_Kafedra_95_2 from '../assets/Info_Kafedra_95_2.jpg';
import Info_Kafedra_96 from '../assets/Info_Kafedra_96.jpg';


import SpecialistTelemetryAI from '../assets/Kafedra_93';

const departments = [
  {
    id: 1,
    name: "Кафедра Автоматизированных систем управления Космических войск",
    shortName: "91",
    img: Kafedra_91,
    infoImages: [Info_Kafedra_91],
    description: "Технологии администрирования автоматизированных систем",
  },
  {
    id: 2,
    name: "Кафедра Автоматизации обработки и анализа информации космических средств",
    shortName: "93",
    img: Kafedra_93,
    infoImages: [Info_Kafedra_93_1, Info_Kafedra_93_2, Info_Kafedra_93_3],
    description: "Компьютерные технологии анализа информации ракет-носителей и космических аппаратов",
    full_description: <SpecialistTelemetryAI />
  },
  {
    id: 3,
    name: "Кафедра Автоматизированных систем управления космических комплексов",
    shortName: "94",
    img: Kafedra_94,
    infoImages: [Info_Kafedra_94_1, Info_Kafedra_94_2],
    description: "Системный анализ и управление космическими аппаратами",
  },
  {
    id: 4,
    name: "Кафедра Автоматизированных систем ракетно-космической обороны",
    shortName: "95",
    img: Kafedra_95,
    infoImages: [Info_Kafedra_95_1, Info_Kafedra_95_2],
    description: "Вычислительные комплексы и сети ракетно-космической обороны",
    badge: "Две специализации",
  },
  {
    id: 5,
    name: "Кафедра Метрологического обеспечения вооружения, военной и специальной техники",
    shortName: "96",
    img: Kafedra_96,
    infoImages: [Info_Kafedra_96],
    description: "Контроль точности работы измерительных систем",
  },
];

export const Departments = () => {
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);

  const selectedDept = departments.find(d => d.id === selectedDeptId);

  return (
    <Panel id="search">
      <PanelHeader>Кафедры факультета</PanelHeader>

      {/* === Список кафедр (сетка) === */}
      {!selectedDept && (
        <Group header={<Title level="2" style={{ margin: '16px 16px 8px' }}>Наши кафедры</Title>}>
          <SimpleGrid 
            columns={2}           // 2 столбца на мобильных
            gap="12px"
            style={{ padding: '0 8px 16px' }}
          >
            {departments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                department={dept}
                onClick={() => setSelectedDeptId(dept.id)}
              />
            ))}
          </SimpleGrid>
        </Group>
      )}

      {/* === Детальная информация о кафедре === */}
      {selectedDept && (
        <>
          <PanelHeader 
            before={
              <Button 
                mode="tertiary" 
                size="s"
                onClick={() => setSelectedDeptId(null)}
              >
                ← Назад
              </Button>
            }
          >
            {selectedDept.shortName} кафедра
          </PanelHeader>

          <Box>
            <Title level="2" weight="3" style={{ marginBottom: 12 }}>
              {selectedDept.name}
            </Title>

            <Text style={{ lineHeight: 1.6, marginBottom: 24 }}>
              {selectedDept.description}
            </Text>
            {selectedDept.full_description}
            {/* Галерея изображений */}
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedDept.infoImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Фото кафедры ${index + 1}`}
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
                  }}
                />
              ))}
            </Box>

            <Spacing size={32} />

            <Button 
              size="l" 
              mode="primary" 
              stretched 
              onClick={() => setSelectedDeptId(null)}
            >
              Вернуться к списку кафедр
            </Button>
          </Box>
        </>
      )}
    </Panel>
  );
};