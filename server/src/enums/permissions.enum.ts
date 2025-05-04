export const Permissions = {
    /**
     * 存取與權限相關
     */
    iam: {
        me: {
            get: 'iam.me.get',
            update: 'iam.me.update',
        },
        accounts: {
            get: 'iam.accounts.get',
            add: 'iam.accounts.add',
            update: 'iam.accounts.update',
            delete: 'iam.accounts.delete',
        },
        roles: {
            get: 'iam.roles.get',
            add: 'iam.roles.add',
            update: 'iam.roles.update',
            delete: 'iam.roles.delete',
        },
        permissions: { get: 'iam.permissions.get' },
        operationLogs: { get: 'iam.operation_logs.get' },
    },

    dashboard: { dashboard: { get: 'dashboard.dashboard.get' } },

    /**
     * 權限相關
     */
    privilege: {
        roles: { get: 'privilege.roles.get' },
        permissions: { get: 'privilege.permissions.get' }, 
    },

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

    /**
     * 市場相關
     */
    marketData: { intraday: { get: 'market_data.intraday.get' } },
};
