import { FC } from 'react';
import {
  Icon28ArticleOutline,
  Icon28Users,
  Icon28Settings,
  Icon28InfoCircle
} from '@vkontakte/icons';
import {
  Panel,
  PanelHeader,
  Header,
  Button,
  Group,
  Cell,
  Div,
  Avatar,
  NavIdProps,
  SimpleGrid,
  Card,
  Box,
  Image,
  Gradient
} from '@vkontakte/vkui';
import { UserInfo } from '@vkontakte/vk-bridge';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import MenuPoints from './MenuPoints.tsx';
import Fakultet9 from '../assets/9fakultet.png';
export interface HomeProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = ({ id, fetchedUser }) => {

  const routeNavigator = useRouteNavigator();

  return (
    <div style={{ position: 'relative'}}>
      <Gradient />
      <Panel id={id}>

        <Box 
          padding="m" 
          style={{
            background: 'linear-gradient(90deg, #e6e7e9 0%, #272bdd 100%)', // красивый градиент
            color: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
  
        <Box style={{ padding: 0 }}>

        </Box>        
        <SimpleGrid columns={2} gap="l" align='stretch'>
          { menu_points.map((c) => <MenuPoints key={c.url} title={c.title} img={c.img} url={c.url}/>)}
        </SimpleGrid>
              </Box>
      </Panel>
    </div>
  );
};

const menu_points = [
  {
    title: "Страница факультета на сайте Министерства обороны Российской Федерации",
    img: <Icon28Settings />,
    url: "persik"
  },
    {
    title: "Информация о факультете",
    img: <Icon28Settings />,
    url: "persik"
  },
    {
    title: "Информация о кафедрах факультета",
    img: <Icon28Settings />,
    url: "persik"
  },
    {
    title: "Общая информация (порядок зачисления и т.д.)",
    img: <Icon28Settings />,
    url: "persik"
  },
    {
    title: "Фильмы об академии и факультете",
    img: <Icon28Settings />,
    url: "persik"
  },
    {
    title: "Презентация в школу и другие заведения",
    img: <Icon28Settings />,
    url: "persik"
  },
    {
    title: "Реферальный код. Пригласительная ссылка.",
    img: <Icon28Settings />,
    url: "persik"
  },
    {
    title: "Список приглашенных",
    img: <Icon28Settings />,
    url: "persik"
  },
    {
    title: "Изменить/добавить пригласительный код",
    img: <Icon28Settings />,
    url: "persik"
  },
      {
    title: "Изменить/добавить пригласительный код",
    img: <Icon28Settings />,
    url: "persik"
  },
]