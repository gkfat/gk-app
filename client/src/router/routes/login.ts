import { RouteRecordRaw } from 'vue-router';

export const loginRoutes: RouteRecordRaw[] = [
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
];
