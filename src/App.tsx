import React, { useState } from 'react';
import { useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  SplitLayout,
  SplitCol,
  Epic,
  Tabbar,
  TabbarItem,
  View,
  Panel,
  PanelHeader,
  Placeholder,
} from '@vkontakte/vkui';

import {
  Icon28BookSpreadOutline,
  Icon28BrainOutline,
  Icon28GlobeOutline,
  Icon28UserCircleOutline,
} from '@vkontakte/icons';

import { Faculty } from './panels/Faculty.tsx';
import { Departments } from './panels/Departments.tsx';
import { Links } from './panels/Links.tsx';
import { Profile } from './panels/Profile.tsx';
export const API_BASE_URL = 'https://924dc534-27b1-40ce-861d-a1234dae151d.tunnel4.com';
export const App = () => {
  const [activeStory, setActiveStory] = useState('faculty');

  useEffect(() => {
    const saveUserToDB = async () => {
      try {
        // Получаем информацию о пользователе
        const userInfo = await bridge.send('VKWebAppGetUserInfo');

        const userData = {
          vkUserId: userInfo.id,
          firstName: userInfo.first_name,
          lastName: userInfo.last_name,
          photoUrl: userInfo.photo_100 || userInfo.photo_50,
          photo200: userInfo.photo_200,
          city: userInfo.city,
          country: userInfo.country,
          sex: userInfo.sex,
          bdate: userInfo.bdate,
        };

        // Отправляем на backend
        const response = await fetch(`${API_BASE_URL}/api/save-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });

        const result = await response.json();
        console.log('Пользователь сохранён в MongoDB:', result);
      } catch (error) {
        console.error('Ошибка при сохранении пользователя:', error);
      }
    };

    saveUserToDB();
  }, []);

  const onStoryChange = (e: React.MouseEvent<HTMLElement>) => {
    const story = e.currentTarget.dataset.story as string;
    setActiveStory(story);
  };

  return (
    
    <SplitLayout>
      <SplitCol>
        <Epic
          activeStory={activeStory}
          tabbar={
            <Tabbar>
              <TabbarItem
                data-story="faculty"
                onClick={onStoryChange}
                selected={activeStory === 'feed'}
                label="Факультет"
              >
                <Icon28BookSpreadOutline />
              </TabbarItem>

              <TabbarItem
                data-story="departments"
                onClick={onStoryChange}
                selected={activeStory === 'departments'}
                label="Кафедры"
              >
                <Icon28BrainOutline />
              </TabbarItem>

              <TabbarItem
                data-story="links"
                onClick={onStoryChange}
                selected={activeStory === 'links'}
                label="Ссылки"
              >
                <Icon28GlobeOutline />
              </TabbarItem>

              <TabbarItem
                data-story="profile"
                onClick={onStoryChange}
                selected={activeStory === 'profile'}
                label="Профиль"
              >
                <Icon28UserCircleOutline />
              </TabbarItem>
            </Tabbar>
          }
        >
          {/* Вкладка "Факультет" */}
          <View id="faculty" activePanel="faculty">
            <Panel id="faculty">
              <Faculty />
            </Panel>
          </View>
          
          {/* Вкладка "Кафедры" */}
          <View id="departments" activePanel="departments">
            <Panel id="departments">
              <Departments />
            </Panel>
          </View>

          {/* Вкладка "Ссылки" */}
          <View id="links" activePanel="links">
            <Panel id="links">
              <Links />
            </Panel>
          </View>

          {/* Вкладка "Профиль" */}
          <View id="profile" activePanel="profile">
            <Panel id="profile">
              <Profile />
            </Panel>
          </View>
        </Epic>
      </SplitCol>
    </SplitLayout>
  );
};