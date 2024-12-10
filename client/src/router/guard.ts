import { Router } from 'vue-router';

import { useAuthStore } from '@/store/auth';
import { useNotifierStore } from '@/store/notifier';
import { Account } from '@/types/account';
import { permissionChecker } from '@/utils/permission';

import { checkRoutePermission } from './util';

export const installGuard = (router: Router) => {
    router.beforeEach(async (to, from, next) => {
        const authStore = useAuthStore();

        if (to.name === '404') {
            return next();
        }

        let account: Account.Account | null = null;

        // 無 token
        if (!authStore.state.token) {
            // 若要前往登入頁, 直接放行
            if (to.name === 'Login' || !to.meta.requireLoggedIn) {
                return next();
            }

            // 若頁面需求登入, 設定登入後轉導要前往的頁面
            if (to.meta.requireLoggedIn) {
                return next({
                    name: 'Login',
                    query: { redirect: to.fullPath },
                });
            }
        }

        // 若有 token, 驗證 token 是否合法
        try {
            account = await authStore.me();
        } catch (err) {
            await authStore.logout();

            if (to.name !== 'Login') {
                const notifierStore = useNotifierStore();

                notifierStore.error({ content: 'Token 驗證失敗，請重新登入。' });

                return next({
                    name: 'Login',
                    query: { redirect: to.fullPath },
                });
            }
        }

        // 已登入但試圖進入登入頁
        if (to.name === 'Login') {
            return next({ path: from.fullPath });
        }

        // 若帳號的狀態為初次啟用則導去個人資料頁
        if (account && permissionChecker.isGuest() && to.name !== 'Profile') {
            return next({ name: 'Profile' });
        }

        // 若進入頁面需要權限, 需驗證權限
        if (to.meta.permissions) {
            const hasPermission = checkRoutePermission({ meta: to.meta });

            console.log({ hasPermission });

            // 無權限, 轉導 401 頁面
            if (!hasPermission) {
                return next({ name: '401' });
            }
        }

        return next();
    });
};
