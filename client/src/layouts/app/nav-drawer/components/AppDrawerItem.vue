<template>
    <v-list nav>
        <template
            v-for="item in menuItems"
            :key="item.path"
        >
            <!-- 單層 -->
            <v-list-item
                v-if="!item.items"
                :to="item.path"
                :prepend-icon="item.icon"
                :title="t(item.title)"
            />

            <!-- 多層 -->
            <v-list-group
                v-else
                :group="`${item.path}`"
                no-action
            >
                <template #activator="{ props }">
                    <v-list-item
                        v-bind="props"
                        :prepend-icon="item.icon"
                        :title="t(item.title)"
                    />
                </template>

                <v-list-item
                    v-for="child in item.items"
                    :key="child.path"
                    :to="child.path"
                    :prepend-icon="child.icon"
                    :title="t(child.title)"
                />
            </v-list-group>
        </template>
    </v-list>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useI18n } from 'vue-i18n';
import {
    RouteRecordRaw,
    useRouter,
} from 'vue-router';

import { checkRoutePermission } from '@/router/util';

const { t } = useI18n();
const router = useRouter();

interface MenuItem {
    title: string;
    icon?: string;
    path: string;
    items?: MenuItem[];
}

const toMenuItem = (routeConfig: RouteRecordRaw, parentPath: string): MenuItem | null => {
    if (!routeConfig?.children?.length) {
        const { meta } = routeConfig;

        // 沒有標題或設定隱藏，不處理
        if (!meta || !meta.title || meta.hidden) return null;

        // 沒有權限，不處理
        if (!checkRoutePermission({ meta })) return null;

        const item = {
            title: meta.title,
            icon: meta.icon,
            to: parentPath + routeConfig.path,
            path: parentPath + routeConfig.path,
        };

        return item;
    }

    const { meta } = routeConfig;

    const children = routeConfig.children
        .map((child) => toMenuItem(child, `${parentPath + routeConfig.path}/`))
        .filter((item) => item !== null);

    // @ts-expect-error force return
    if (meta?.childAsRoot) return children;

    if (!meta || meta.hidden) return null;

    // user 沒有權限, 返回空選單
    if (!checkRoutePermission({ meta })) return null;

    const item: MenuItem = {
        title: meta.title,
        icon: meta.icon,
        path: parentPath + routeConfig.path,
        items: children,
    };

    if (!children.length) {
        return null;
    }

    return item;
};

const menuItems = computed(() => {
    const { routes } = router.options;

    const res = routes
        .filter((v) => v.children && v.children.length)
        .map((v) => toMenuItem(v, ''))
        .filter((v) => v !== null);

    return res.flat();
});
</script>
<style lang="ts" scoped>

</style>
