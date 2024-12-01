import { RouteMeta } from 'vue-router';

import { useAuthStore } from '@/store/auth';

/**
 * 依照 Route meta 檢查權限
 */
export function checkRoutePermission({ meta }: { meta: RouteMeta }) {
    const authStore = useAuthStore();

    if (!meta.permissions) {
        return true;
    }

    if (!meta.permissionsMode) {
        meta.permissionsMode = 'allof';
    }


    return authStore.havePermission(
        meta.permissions,
        {
            strategy: meta.permissionsMode,
        },
    );
}
