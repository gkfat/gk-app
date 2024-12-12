import { Permissions } from './permissions';
import { EnumRoles } from './roles.enum';

const {
    account, dashboard, privilege, portfolio,
} = Permissions;

const basicPermissions = [
    account.me.get,
    account.me.update,
    dashboard.dashboard.get,
];

export const Privileges = {
    [EnumRoles.MEMBER]: [
        ...basicPermissions,

        // Portfolio
        portfolio.portfolios.get,
        portfolio.portfolios.add,
        portfolio.portfolios.update,
        portfolio.portfolios.delete,
    ], 
};