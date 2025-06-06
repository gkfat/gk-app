import { RouteRecordRaw } from 'vue-router';

export const errorsRoutes: RouteRecordRaw[] = [
    {
        path: '',
        meta: {
            requireLoggedIn: true,
            hidden: true,
            title: '',
        },
        children: [
            {
                path: '401',
                name: '401',
                meta: {
                    requireLoggedIn: true,
                    hidden: true,
                    title: '',
                },
                component: () => import('@/views/error/401.vue'),
            },
        ],
    },
];
