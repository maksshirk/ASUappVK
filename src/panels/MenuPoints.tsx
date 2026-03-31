import { FC } from 'react';
import { PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
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
  Card
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

export default function MenuPoints({ title, img, url }) {
    const routeNavigator = useRouteNavigator();
    return (
    <Card mode="shadow" padding="m" style={{ 
    height: '100%',
    transition: 'transform 0.2s, box-shadow 0.2s' 
    }}>
      <Button 
        size="l" 
        stretched
        before={img}
        mode="outline"
        appearance="accent"
        onClick={() => routeNavigator.push(url)}
      >
        {title}
      </Button>
    </Card>
    )
}