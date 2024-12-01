export const Permissions = {
    /**
     * 帳號相關
     */
    account: {
        me: {
            get: 'account.me.get',
            update: 'account.me.update',
        },
        accounts: {
            get: 'account.accounts.get',
            add: 'account.accounts.add',
            updateRoles: 'account.accounts.update_roles',
            enable: 'account.accounts.enable',
            delete: 'account.accounts.delete',
        },
    },

    dashboard: {
        dashboard: {
            get: 'dashboard.dashboard.get'
        }
    },

    /**
     * 權限相關
     */
    privilege: { roles: { get: 'privilege.roles.get' } },
};
