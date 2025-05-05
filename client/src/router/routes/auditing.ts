import { RouteRecordRaw } from 'vue-router';

import { Permissions } from '@/enums/permissions';

export const auditingRoutes: RouteRecordRaw[] = [
    {
        path: 'auditing',
        name: 'Auditing',
        redirect: '/auditing/operation-log',
        meta: {
            requireLoggedIn: true,
            permissions: [Permissions.auditing.operationLogs.get],
            permissionsMode: 'oneof',
            hidden: false,
            icon: 'mdi-chart-bar',
            title: 'nav.auditing',
        },
        children: [
            {
                path: 'operation-log',
                name: 'OperationLog',
                meta: {
                    requireLoggedIn: true,
                    permissions: [Permissions.auditing.operationLogs.get],
                    permissionsMode: 'allof',
                    hidden: false,
                    title: 'nav.operation_log',
                },
                component: () => import('@/views/auditing/operation-log/OperationLog.vue'),
            },
        ],
    },
];
