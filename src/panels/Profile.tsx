import React from 'react';
import { Panel, PanelHeader, Placeholder, Avatar, Text, Group } from '@vkontakte/vkui';
import { Icon28UserCircleOutline } from '@vkontakte/icons';

export const Profile = () => {
  return (
    <Panel id="profile">
      <PanelHeader>Профиль</PanelHeader>
      
      <Group>
        <Placeholder 
          icon={<Icon28UserCircleOutline width={72} height={72} />}
          stretched
        >
          Здесь будет информация о абитуриенте
        </Placeholder>
      </Group>

      <Group>
        <Text style={{ textAlign: 'center', padding: 16 }}>
          Пока здесь ничего нет.<br />
          Скоро добавим информацию об абитуриенте.
        </Text>
      </Group>
    </Panel>
  );
};