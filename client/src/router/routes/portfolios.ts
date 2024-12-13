import { RouteRecordRaw } from 'vue-router';

import { Permissions } from '@/enums/permissions';

export const portfoliosRoutes: RouteRecordRaw[] = [
    {
        path: 'portfolios',
        name: 'Portfolios',
        meta: {
            requireLoggedIn: true,
            permissions: [Permissions.portfolio.portfolios.get],
            permissionsMode: 'allof',
            keepAlive: true,
            hidden: false,
            icon: 'mdi-finance',
            title: 'nav.portfolios',
        },
        component: () => import('@/views/portfolios/Portfolios.vue'),
    },
];
