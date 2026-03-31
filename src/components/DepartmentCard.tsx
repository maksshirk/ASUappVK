// src/components/DepartmentCard.tsx
import React from 'react';
import { Card, Avatar, Title, Text, Button } from '@vkontakte/vkui';
import { Icon28ChevronRightOutline } from '@vkontakte/icons';

type Department = {
  id: number;
  name: string;
  shortName: string;
  description: string;
  badge?: string;
  img: string;           // путь к изображению кафедры
};

interface Props {
  department: Department;
  onClick: () => void;
}

export const DepartmentCard = ({ department, onClick }: Props) => {
  return (
    <Card
      mode="shadow"
      style={{ 
        height: '100%',           // важно для ровной высоты в сетке
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{ padding: '16px', textAlign: 'center' }}>
        
        {/* Изображение кафедры */}
        <div style={{ marginBottom: 16 }}>
          <Avatar
            size={88}
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            <img 
              src={department.img} 
              alt={department.shortName}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
          </Avatar>
        </div>

        {/* Бейджик */}
        {department.badge && (
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: '#FF3B30',
            color: 'white',
            fontSize: '10px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '12px',
            zIndex: 2,
          }}>
            {department.badge}
          </div>
        )}

        {/* Название кафедры */}
        <Title 
          level="3" 
          weight="semibold" 
          style={{ 
            marginBottom: 8, 
            lineHeight: 1.3,
            fontSize: '17px'
          }}
        >
          {department.name}
        </Title>

        {/* Краткое описание */}
        <Text 
          style={{ 
            color: 'var(--vkui--color_text_subtle)', 
            lineHeight: 1.45,
            fontSize: '14.5px',
            marginBottom: 16,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textAlign: 'center'
          }}
        >
          {department.description}
        </Text>

        {/* Кнопка "Подробнее" */}
        <Button 
          mode="outline" 
          size="s" 
          after={<Icon28ChevronRightOutline />}
          stretched
        >
          Подробнее
        </Button>
      </div>
    </Card>
  );
};