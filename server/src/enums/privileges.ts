import { Permissions } from './permissions';
import { Roles } from './roles.enum';

const {
    account, dashboard, 
} = Permissions;

const basicPermissions = [
    account.me.get,
    account.me.update,
    dashboard.dashboard.get,
];

export const Privileges = { [Roles.MEMBER]: [...basicPermissions] };