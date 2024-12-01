import {
    createRouter,
    createWebHistory,
    RouteRecordRaw,
} from 'vue-router';

import { installGuard } from './guard';
import { appRoutes } from './routes';
import { loginRoutes } from './routes/login';

const routes: RouteRecordRaw[] = [
    ...loginRoutes,
    {
        path: '',
        redirect: '/dashboard',
        component: () => import('@/layouts/app/AppLayout.vue'),
        meta: {
            childAsRoot: true,
            requireLoggedIn: true,
            title: '',
            hidden: false,
        },
        children: appRoutes,
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: () => import('@/views/error/404.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

installGuard(router);

export default router;
