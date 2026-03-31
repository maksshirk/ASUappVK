import React from 'react';
import { Panel, PanelHeader, Placeholder, Group, Card, Text, Button } from '@vkontakte/vkui';
import { Icon28GlobeOutline } from '@vkontakte/icons';

export const Links = () => {
  return (
    <Panel id="links">
      <PanelHeader>Ссылки на материалы</PanelHeader>
      
      <Placeholder 
        icon={<Icon28GlobeOutline width={56} height={56} />}
        stretched
      >
        Учебные материалы, полезные ресурсы и документация
      </Placeholder>

      <Group header="Быстрые ссылки">
        <Card mode="shadow" style={{ margin: 12 }}>
          <Button mode="tertiary" stretched>Google Drive — Лекции</Button>
          <Button mode="tertiary" stretched style={{ marginTop: 8 }}>Moodle — Курсы</Button>
          <Button mode="tertiary" stretched style={{ marginTop: 8 }}>GitHub — Практики</Button>
        </Card>
      </Group>
    </Panel>
  );
};