import { lazy, type ComponentType } from 'react';

const Home = lazy(() => import('./pages/Home'));
const MyProduct = lazy(() => import('./pages/MyProduct'));
const AdminGolaMart = lazy(() => import('./pages/AdminGolaMart'));

interface RouteConfig {
  name: string;
  path: string;
  component: ComponentType;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    component: Home,
    visible: true,
  },
  {
    name: 'My Product',
    path: '/my-product',
    component: MyProduct,
    visible: true,
  },
  {
    name: 'Admin GolaMart',
    path: '/admin/golamart',
    component: AdminGolaMart,
  },
];

export default routes;
