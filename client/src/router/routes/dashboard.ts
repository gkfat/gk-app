import { RouteRecordRaw } from 'vue-router';

import { Permissions } from '@/enums/permissions';

export const dashboardRoutes: RouteRecordRaw[] = [
    {
        path: 'dashboard',
        name: 'Dashboard',
        meta: {
            requireLoggedIn: true,
            permissions: [Permissions.dashboard.dashboard.get],
            permissionsMode: 'allof',
            keepAlive: true,
            hidden: false,
            icon: 'mdi-view-dashboard',
            title: 'nav.dashboard',
        },
        component: () => import('@/views/dashboard/Dashboard.vue'),
    },
];
