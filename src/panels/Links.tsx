import React from 'react';
import bridge from '@vkontakte/vk-bridge';
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
          <Button onClick={() => window.open('https://vka.mil.ru/Ucheba/Fakultety/Fakultet-avtomatizirovannyh-sistem-uprav','')} mode="tertiary" stretched>🚀Страница факультета на сайте Министерства обороны РФ</Button>
          <Button onClick={() => window.open('https://disk.yandex.ru/d/KSFWYr0PeN_mfA','')} mode="tertiary" stretched>📌Общая информация (порядок зачисления и т.д.)</Button>
          <Button onClick={() => window.open('https://disk.yandex.ru/d/Tx2_lfVOM3NrSA', '')} mode="tertiary" stretched>🎥Фильмы об академии и факультете</Button>
          <Button onClick={() => window.open('https://disk.yandex.ru/d/U3zvtvnGGPYw9A','')} mode="tertiary" stretched>📺Презентация в школу и др.заведения</Button>
        </Card>
      </Group>
    </Panel>
  );
};