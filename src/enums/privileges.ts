import { Permissions } from './permissions';
import { Roles } from './roles.enum';

const { account } = Permissions;

const basicPermissions = [account.me.get, account.me.update];

export const Privileges = {
    [Roles.GUEST]: [...basicPermissions],
    [Roles.MEMBER]: [...basicPermissions],
};