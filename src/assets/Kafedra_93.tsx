import React from 'react';
import {
  Group,
  Card,
  Header,
  Title,
  Text,
  Box,
  SimpleGrid,
  Separator,
  Spacing,
  Subhead,
  Cell,
  Banner,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const SpecialistTelemetryAI = () => {
  return (
    <Box
      className="vkui-page"
      style={{
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '16px',
        backgroundColor: '#f8fbff',
      }}
    >
      {/* HERO */}
      <Group>
        <Box style={{ textAlign: 'center', padding: '40px 16px 32px' }}>
          <Title
            level="1"
            weight="2"
            style={{
              color: '#0066ff',
              fontSize: 'clamp(32px, 5vw, 42px)',
              lineHeight: '1.1',
              marginBottom: '16px',
            }}
          >
            Специалист по интеллектуальному анализу телеметрической информации космических средств
          </Title>
          <Text
            weight="2"
            style={{
              fontSize: 'clamp(18px, 3.5vw, 22px)',
              color: '#555',
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            Основной элемент в интеллектуальной системе управления испытаниями и применением космической техники
          </Text>
        </Box>
      </Group>

      <Spacing size={24} />

      {/* ОПИСАНИЕ СЛУЖБЫ */}
      <Group header={<Header>Специалисты проходят службу в воинских частях Министерства обороны</Header>}>
        <Text style={{ fontSize: '17px', lineHeight: '24px', marginBottom: '24px', padding: '0 8px' }}>
          Применяют интеллектуальные системы подготовки к запуску орбитальных космических средств, пуска ракет-носителей и управления космическими аппаратами.
        </Text>

        <SimpleGrid columns={{ mobile: 1, tablet: 3 }} gap="16px">
          <Card mode="shadow">
            <Box style={{ padding: '20px' }}>
              <Header mode="secondary">При испытаниях и подготовке</Header>
              <Text style={{ fontSize: '15px', lineHeight: '22px' }}>
                • Управление контрольно-измерительной аппаратурой через голосовые и текстовые интерфейсы на базе LLM<br />
                • Автоматизированное тестирование бортовых систем с ИИ-предиктивной аналитикой
              </Text>
            </Box>
          </Card>

          <Card mode="shadow">
            <Box style={{ padding: '20px' }}>
              <Header mode="secondary">При пуске ракет-носителей</Header>
              <Text style={{ fontSize: '15px', lineHeight: '22px' }}>
                • Интеллектуальная обработка телеметрии в реальном времени<br />
                • Выявление скрытых нештатных ситуаций и выдача решений с вероятностной оценкой
              </Text>
            </Box>
          </Card>

          <Card mode="shadow">
            <Box style={{ padding: '20px' }}>
              <Header mode="secondary">При управлении КА</Header>
              <Text style={{ fontSize: '15px', lineHeight: '22px' }}>
                • Семантический анализ телеметрии через LLM-агентов<br />
                • Формирование оптимальных сценариев устранения дефектов естественным языком
              </Text>
            </Box>
          </Card>
        </SimpleGrid>
      </Group>

      <Spacing size={32} />

      {/* ПРОФЕССИОНАЛЬНЫЕ КОМПЕТЕНЦИИ */}
      <Group header={<Header mode="tertiary">Основные профессиональные компетенции</Header>}>
        <SimpleGrid columns={{ mobile: 1, tablet: 2 }} gap="16px">
          <Card mode="shadow">
            <Box style={{ padding: '20px' }}>
              <Text weight="2" style={{ color: '#0066ff', fontSize: '22px' }}>01</Text>
              <Text style={{ marginTop: '12px', fontSize: '15px', lineHeight: '22px' }}>
                Разработка и применение автономных ИИ-комплексов сбора и обработки телеметрии, способных самообучаться
              </Text>
            </Box>
          </Card>

          <Card mode="shadow">
            <Box style={{ padding: '20px' }}>
              <Text weight="2" style={{ color: '#0066ff', fontSize: '22px' }}>02</Text>
              <Text style={{ marginTop: '12px', fontSize: '15px', lineHeight: '22px' }}>
                Создание систем информационной поддержки принятия решений на базе больших языковых моделей
              </Text>
              <Subhead style={{ color: '#666', marginTop: '8px' }}>
                Вы просто задаёте вопрос на русском — LLM отвечает с графиками и выводами
              </Subhead>
            </Box>
          </Card>

          <Card mode="shadow">
            <Box style={{ padding: '20px' }}>
              <Text weight="2" style={{ color: '#0066ff', fontSize: '22px' }}>03</Text>
              <Text style={{ marginTop: '12px', fontSize: '15px', lineHeight: '22px' }}>
                Проектирование гибридных аппаратно-программных средств с ИИ-советником для нештатных ситуаций
              </Text>
            </Box>
          </Card>

          <Card mode="shadow">
            <Box style={{ padding: '20px' }}>
              <Text weight="2" style={{ color: '#0066ff', fontSize: '22px' }}>04</Text>
              <Text style={{ marginTop: '12px', fontSize: '15px', lineHeight: '22px' }}>
                Применение систем обучения боевых расчётов с генеративным ИИ и адаптивными виртуальными тренажёрами
              </Text>
            </Box>
          </Card>
        </SimpleGrid>
      </Group>

      <Spacing size={40} />

      {/* НАДПРОФЕССИОНАЛЬНЫЕ НАВЫКИ */}
      <Group header={<Header>НАДПРОФЕССИОНАЛЬНЫЕ НАВЫКИ И УМЕНИЯ</Header>}>
        <SimpleGrid columns={{ mobile: 2, tablet: 3 }} gap="12px">
          {[
            'Самодисциплина',
            'Применение ВВСТ',
            'Системное мышление',
            'Программирование / Робототехника / ИИ',
            'Работа с людьми',
            'Работа в условиях неопределённости',
            'Межличностная коммуникация',
            'Глобальность взглядов',
            'Многоязычность',
          ].map((skill) => (
            <Card key={skill} mode="outline" style={{ padding: '18px 16px', textAlign: 'center' }}>
              <Text weight="2" style={{ fontSize: '15px' }}>
                {skill}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Group>

      <Spacing size={40} />

      {/* ОСНОВНАЯ ИНФОРМАЦИЯ */}
      <SimpleGrid columns={{ mobile: 1, tablet: 2 }} gap="24px">
        <Group>
          <Box style={{ padding: '0 8px' }}>
            <Subhead style={{ color: '#0066ff' }}>Домен деятельности</Subhead>
            <Title level="2" weight="2" style={{ marginTop: '6px' }}>управление / эксплуатация</Title>

            <Spacing size={28} />

            <Subhead style={{ color: '#0066ff' }}>Первичная должность</Subhead>
            <Title level="2" weight="2" style={{ marginTop: '6px' }}>инженер отделения (старший лейтенант)</Title>

            <Spacing size={32} />

            <Header mode="tertiary">Ключевые задачи</Header>
            <ul style={{ paddingLeft: '20px', margin: '16px 0', lineHeight: '1.6', fontSize: '15px' }}>
              <li>Разработка и эксплуатация аппаратно-программных средств с ИИ</li>
              <li>Интеллектуальный анализ телеметрии в реальном времени</li>
              <li>Автоматизированный контроль состояния ВВТ с ИИ</li>
              <li>Прогнозирование отказов на основе самообучающихся моделей</li>
              <li>Принятие решений в условиях неполной информации</li>
            </ul>
          </Box>
        </Group>

        <Group>
          {/* Блок со сценариями применения */}
          <Card mode="outline">
            <Box style={{ padding: '20px' }}>
              <Banner
                header="«Повседневная деятельность»"
                subheader="Автоматизированное поддержание готовности с предиктивной аналитикой"
                mode="image"
              />
              <Spacing size={16} />
              <Banner
                header="«Боевая работа»"
                subheader="Глубинный анализ телеметрии и автоматическая выработка решений"
                mode="image"
              />
            </Box>
          </Card>

          <Spacing size={16} />

          <Box style={{ padding: '0 8px' }}>
            <Subhead style={{ color: '#0066ff' }}>Место в системе</Subhead>
            <Text style={{ marginTop: '6px' }}>Инженерные должности командно-измерительных комплексов и космодромов</Text>

            <Spacing size={24} />

            <Subhead style={{ color: '#0066ff' }}>Технологический стек</Subhead>
            <Text style={{ marginTop: '8px', whiteSpace: 'pre-line', fontSize: '15px' }}>
              • Персональные ЭВМ и мобильные средства с ускорителями ИИ<br />
              • Автоматизированные цифровые платформы<br />
              • Нейросетевые комплексы анализа телеметрии<br />
              • ИИ-ассистенты с естественно-языковым интерфейсом
            </Text>
          </Box>
        </Group>
      </SimpleGrid>

      <Spacing size={40} />

      {/* УРОВЕНЬ АВТОНОМНОСТИ */}
      <Group>
        <Card mode="shadow" style={{ background: '#0a2540', color: '#fff', borderRadius: '16px' }}>
          <Box style={{ padding: '28px' }}>
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
              <Box
                style={{
                  fontSize: 'clamp(48px, 8vw, 64px)',
                  fontWeight: '900',
                  color: '#0066ff',
                  lineHeight: '1',
                }}
              >
                человек + AI
              </Box>
              <Text style={{ color: '#fff', fontSize: '17px', lineHeight: '24px' }}>
                Человек сохраняет статус главного действующего лица. ИИ — когнитивный усилитель: анализ телеметрии в реальном времени, прогнозирование отказов, автоматизация рутины.
              </Text>
            </Box>
          </Box>
        </Card>
      </Group>

      <Spacing size={40} />

      {/* ЖЁСТКИЕ И МЯГКИЕ НАВЫКИ */}
      <SimpleGrid columns={{ mobile: 1, tablet: 2 }} gap="24px">867967
        <Group header={<Header>Жёсткие навыки</Header>}>
          <Cell style={{ padding: '16px 20px' }}>
            <Text weight="2">Техническое мышление на уровне «эксперт»</Text>
            <Text style={{ color: '#666', fontSize: '15px' }}>Диагностика совместно с ИИ-ассистентом</Text>
          </Cell>
          <Separator />
          <Cell style={{ padding: '16px 20px' }}>
            <Text weight="2">Техническая грамотность (высокий уровень)</Text>
            <Text style={{ color: '#666', fontSize: '15px' }}>Бортовые системы, радиоэлектроника, кибербезопасность и принципы ИИ</Text>
          </Cell>
        </Group>

        <Group header={<Header>Мягкие навыки</Header>}>
          <Cell style={{ padding: '16px 20px' }}>
            <Text weight="2">Критическое мышление и адаптивность</Text>
            <Text style={{ color: '#666', fontSize: '15px' }}>Принятие решений при конфликте своей оценки и рекомендации ИИ</Text>
          </Cell>
          <Separator />
          <Cell style={{ padding: '16px 20px' }}>
            <Text weight="2">Когнитивная выносливость и многозадачность</Text>
          </Cell>
          <Separator />
          <Cell style={{ padding: '16px 20px' }}>
            <Text weight="2">Быстрая обучаемость новым ИИ-моделям</Text>
          </Cell>
        </Group>
      </SimpleGrid>

      <Spacing size={40} />

      {/* КАРЬЕРНОЕ РАЗВИТИЕ */}
      <Group header={<Header>Карьерное развитие</Header>}>
        <SimpleGrid columns={{ mobile: 1, tablet: 2 }} gap="16px">
          <Card mode="shadow">
            <Box style={{ padding: '24px' }}>
              <Title level="3" weight="2">Вертикальный трек</Title>
              <Text style={{ marginTop: '16px', fontSize: '16px' }}>• Начальник отделения (капитан)</Text>
              <Text style={{ fontSize: '16px' }}>• Начальник отдела (майор)</Text>
            </Box>
          </Card>
          <Card mode="shadow">
            <Box style={{ padding: '24px' }}>
              <Title level="3" weight="2">Горизонтальный трек</Title>
              <Text style={{ marginTop: '16px', fontSize: '16px' }}>• Части запуска космических аппаратов</Text>
              <Text style={{ fontSize: '16px' }}>• Части управления космических аппаратов</Text>
            </Box>
          </Card>
        </SimpleGrid>
      </Group>

      <Spacing size={40} />

      {/* ДЕФИЦИТНОСТЬ */}
      <Group>
        <Card mode="outline" style={{ background: '#e6f0ff', borderColor: '#99ccff' }}>
          <Box style={{ padding: '28px' }}>
            <Title level="2" weight="2" style={{ color: '#0066ff' }}>Дефицитность / критичность</Title>
            <Text style={{ marginTop: '14px', fontSize: '17px', lineHeight: '24px' }}>
              <strong>Высокая</strong>. Внедрение ИИ не снижает, а повышает дефицитность специалиста. Без инженера-верификатора ИИ-гипотез система становится либо бесполезной, либо опасной.
            </Text>

            <Spacing size={28} />

            <Title level="2" weight="2" style={{ color: '#0066ff' }}>Организационный контур</Title>
            <Text style={{ marginTop: '14px', fontSize: '17px', lineHeight: '24px' }}>
              Служба в штатных подразделениях Космических войск. Офицер занимается обслуживанием аппаратно-программных комплексов и анализом телеметрической информации.
            </Text>
          </Box>
        </Card>
      </Group>

      <Spacing size={48} />

      {/* FOOTER */}
      <Box style={{ textAlign: 'center', color: '#777', fontSize: '13px' }}>
        Атлас военных профессий • Проект № 93 кафедры на 2030 год
      </Box>
    </Box>
  );
};

export default SpecialistTelemetryAI;