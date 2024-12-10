import 'vue-router';

declare module 'vue-router' {
    export interface RouteMeta {
        /** route nav i18n text */
        title: string;

        /** 需求權限 */
        permissions?: string[];

        /** 需求權限策略 */
        permissionsMode?: 'allof' | 'oneof';

        /** 是否需要登入 */
        requireLoggedIn: boolean;

        icon?: string;

        /** 是否在 nav 中顯示 */
        hidden?: boolean;

        /** 子路由作為根路由 */
        childAsRoot?: boolean;
    }
}
