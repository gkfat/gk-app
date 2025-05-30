export const Permissions = {
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
    privilege: {
        roles: { get: 'privilege.roles.get' },
        permissions: {
            get: 'privilege.permissions.get',
            update: 'privilege.permissions.update', 
        },
        privileges: {
            get: 'privilege.privileges.get',
            update: 'privilege.privileges.update',
        },
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

    /**
     * 存取與權限相關
     */
    iam: {
        roles: { get: 'iam.roles.get' },
        permissions: {
            get: 'privilege.permissions.get',
            update: 'privilege.permissions.update', 
        },
        privileges: {
            get: 'privilege.privileges.get',
            update: 'privilege.privileges.update',
        },
    },

    /**
     * 審計相關
     */
    auditing: {
        /** 操作紀錄 */
        operationLogs: { get: 'auditing.operation_logs.get' },
    },
};
