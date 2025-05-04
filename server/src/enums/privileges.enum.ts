import { Permissions } from './permissions.enum';
import { EnumRole } from './role.enum';

const {
    iam, dashboard,  portfolio, marketData,
} = Permissions;

const basicPermissions = [
    iam.me.get,
    iam.me.update,
    dashboard.dashboard.get,
];

export const Privileges = {
    [EnumRole.MEMBER]: [
        ...basicPermissions,

        // Portfolio
        portfolio.portfolios.get,
        portfolio.portfolios.add,
        portfolio.portfolios.update,
        portfolio.portfolios.delete,

        // Market
        marketData.intraday.get,
    ], 
};