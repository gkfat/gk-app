import {
    createRouter,
    createWebHistory,
    RouteRecordRaw,
} from 'vue-router';

import { installGuard } from './guard';
import { accountsRoutes } from './routes/accounts';
import { auditingRoutes } from './routes/auditing';
import { dashboardRoutes } from './routes/dashboard';
import { errorsRoutes } from './routes/errors';
import { iamRoutes } from './routes/iam';
import { portfoliosRoutes } from './routes/portfolios';

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        meta: {
            requireLoggedIn: false,
            hidden: true,
            title: '',
        },
        component: () => import('@/views/login/Login.vue'),
    },
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
        children: [
            ...dashboardRoutes,
            ...accountsRoutes,
            ...portfoliosRoutes,
            ...auditingRoutes,
            ...iamRoutes,
            ...errorsRoutes,
        ],
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
