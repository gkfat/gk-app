import { RouteRecordRaw } from 'vue-router';

import { Permissions } from '@/enums/permissions';

export const iamRoutes: RouteRecordRaw[] = [
    {
        path: 'iam',
        name: 'IAM',
        redirect: '/iam/accounts',
        meta: {
            requireLoggedIn: true,
            permissions: [
                Permissions.iam.accounts.get,
                Permissions.iam.roles.get,
                Permissions.iam.permissions.get,
            ],
            permissionsMode: 'oneof',
            hidden: false,
            icon: 'mdi-lock',
            title: 'nav.iam',
        },
        children: [
            {
                path: 'accounts',
                name: 'Accounts',
                meta: {
                    requireLoggedIn: true,
                    permissions: [Permissions.iam.accounts.get],
                    permissionsMode: 'allof',
                    hidden: false,
                    icon: 'mdi-account',
                    title: 'nav.accounts',
                },
                component: () => import('@/views/iam/accounts/Accounts.vue'),
            },
        ],
    },
];
