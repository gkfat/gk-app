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
            update: 'account.accounts.update',
            delete: 'account.accounts.delete',
        },
    },

    dashboard: { dashboard: { get: 'dashboard.dashboard.get' } },

    /**
     * 權限相關
     */
    privilege: { roles: { get: 'privilege.roles.get' } },

    /**
     * Portfolio 相關
     */
    portfolio: {
        portfolios: {
            get: 'portfolio.portfolios.get',
            add: 'portfolio.portfolios.add',
            update: 'portfolio.portfolios.update',
            delete: 'portfolio.portfolios.delete',
        },
    },
};
