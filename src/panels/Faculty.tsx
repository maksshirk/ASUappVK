import React from 'react';
import { Panel, PanelHeader, Placeholder, Group, Card, Text, Title } from '@vkontakte/vkui';
import { Separator, Spacing } from '@vkontakte/vkui';
import {
  Icon28BookSpreadOutline,
} from '@vkontakte/icons';

export const Faculty = () => {
  return (
    <Panel id="faculty">
      <PanelHeader>О факультете</PanelHeader>
      
      <Group>
        <Placeholder>
          <iframe 
            src="https://vkvideo.ru/video_ext.php?oid=-237198280&id=456239017&hash=ea5f28efd55b7705&hd=3&autoplay=1" 
            width="100%" 
            height="360" 
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
            frameBorder="0"
            allowFullScreen
            style={{ borderRadius: '10px' }}
          />
          Добро пожаловать на официальную страницу факультета!
        </Placeholder>
      </Group>

      <Group header={<Title level="2">О нас</Title>}>
        <Card mode="shadow" style={{ margin: '12px' }}>
        <Group>
            {/* Заголовок */}
            <div style={{ padding: '16px 16px 8px' }}>
            <Title level="2" weight="semibold" style={{ color: 'var(--vkui--color_text_accent)' }}>
                Факультет № 9
            </Title>
            <Text weight="medium" style={{ color: '#888', marginTop: 4 }}>
                (до 2011 г. — факультет № 6)
            </Text>
            </div>

            <Separator />

            {/* Девиз */}
            <div style={{ padding: '16px' }}>
            <Text weight="semibold" style={{ fontSize: '15px', lineHeight: '20px' }}>
                «ИЗМЕРЯЕМ. ВЫЧИСЛЯЕМ. АНАЛИЗИРУЕМ. УПРАВЛЯЕМ»
            </Text>
            </div>

            <Separator />

            {/* Основная информация */}
            <div style={{ padding: '16px' }}>
            <Text style={{ lineHeight: '1.6' }}>
                Сфера деятельности факультета — <b>компьютерные и информационно-измерительные технологии</b> 
                в автоматизированных системах космической сферы.
            </Text>

            <Spacing size={16} />

            <Text style={{ lineHeight: '1.6' }}>
                Подготовка обучающихся и научные исследования ведутся на{' '}
                <b>5 кафедрах</b>:<br />
                • 4 кафедры по специальности «Применение и эксплуатация автоматизированных систем специального назначения»<br />
                • 1 кафедра по специальности «Метрологическое обеспечение вооружения и военной техники»
            </Text>

            <Spacing size={16} />

            <Text style={{ lineHeight: '1.6' }}>
                Обучение проходит с использованием современных образцов вычислительной техники. 
                На факультете работают <b>10 докторов наук</b> и <b>50 кандидатов наук</b>, 
                среди которых 7 человек отмечены почётными званиями и наградами Министерства образования и науки РФ.
            </Text>
            </div>

            <Separator />

            {/* Статистика внизу */}
            <div style={{ padding: '12px 16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div>
                <Text weight="semibold" style={{ color: 'var(--vkui--color_text_accent)' }}>6</Text>
                <Text style={{ fontSize: '13px', color: '#888' }}>профессоров</Text>
            </div>
            <div>
                <Text weight="semibold" style={{ color: 'var(--vkui--color_text_accent)' }}>27</Text>
                <Text style={{ fontSize: '13px', color: '#888' }}>доцентов</Text>
            </div>
            </div>
        </Group>
        </Card>
      </Group>
    </Panel>
  );
};