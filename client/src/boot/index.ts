import { injectVueContext } from '@/api';
import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';

export const boot = () => {
    const appStore = useAppStore();
    const authStore = useAuthStore();

    injectVueContext(authStore, appStore);
};
