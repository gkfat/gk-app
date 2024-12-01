import { Roles } from '@/enums/auth';
import { useAuthStore } from '@/store/auth';

/** 檢查 user 是否為 guest */
function isGuest() {
    const authStore = useAuthStore();

    if (!authStore.state.account) {
        return true;
    }

    const {roles} = authStore.state.account;

    return roles.length === 1 && roles[0].role === Roles.GUEST
}

export const permissionChecker = {
    isGuest,
};
