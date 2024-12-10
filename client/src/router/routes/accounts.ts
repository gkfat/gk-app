import { RouteRecordRaw } from 'vue-router';

import { Permissions } from '@/enums/permissions';

export const accountsRoutes: RouteRecordRaw[] = [
    {
        path: 'accounts',
        name: 'Accounts',
        meta: {
            requireLoggedIn: true,
            permissions: [Permissions.account.accounts.get],
            permissionsMode: 'allof',
            keepAlive: true,
            hidden: false,
            icon: 'mdi-account',
            title: 'nav.accounts',
        },
        component: () => import('@/views/accounts/Accounts.vue'),
    },
];
