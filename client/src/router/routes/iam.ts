import { RouteRecordRaw } from 'vue-router';

import { Permissions } from '@/enums/permissions';

export const iamRoutes: RouteRecordRaw[] = [
    {
        path: 'iam',
        name: 'IAM',
        redirect: '/iam/privileges',
        meta: {
            requireLoggedIn: true,
            permissions: [Permissions.iam.privileges.get, Permissions.iam.permissions.get],
            permissionsMode: 'oneof',
            hidden: false,
            icon: 'mdi-lock',
            title: 'nav.iam',
        },
        children: [
            {
                path: 'privileges',
                name: 'Privileges',
                meta: {
                    requireLoggedIn: true,
                    permissions: [Permissions.iam.privileges.get],
                    permissionsMode: 'allof',
                    hidden: false,
                    title: 'nav.privileges',
                },
                component: () => import('@/views/iam/privileges/Privileges.vue'),
            }, {
                path: 'permissions',
                name: 'Permissions',
                meta: {
                    requireLoggedIn: true,
                    permissions: [Permissions.iam.permissions.get],
                    permissionsMode: 'allof',
                    hidden: false,
                    title: 'nav.permissions',
                },
                component: () => import('@/views/iam/permissions/Permissions.vue'),
            },
        ],
    },
];
