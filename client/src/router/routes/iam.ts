import { RouteRecordRaw } from 'vue-router';

import { Permissions } from '@/enums/permissions';

export const iamRoutes: RouteRecordRaw[] = [
    {
        path: 'iam',
        name: 'IAM',
        redirect: '/iam',
        meta: {
            requireLoggedIn: true,
            permissions: [Permissions.iam.roles.get, Permissions.iam.permissions.get],
            permissionsMode: 'oneof',
            hidden: false,
            icon: 'mdi-lock',
            title: 'nav.iam',
        },
        children: [],
    },
];
