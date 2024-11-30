import { Permissions } from 'src/enums/permissions';
import { Privileges } from 'src/enums/privileges';
import { Roles } from 'src/enums/roles.enum';
import { Role } from 'src/modules/roles/entities/role.entity';

import { flattenValues } from './object';

function getPermissionsByRoles(roles: Role[]) {
    const permissionsSet = new Set<string>();

    roles.forEach((role) => {
        if (role.role === Roles.SUPER) {
            const permissions = flattenValues(Permissions);
            permissions.forEach((p) => permissionsSet.add(p));
        }

        if (!Privileges[role.role]) {
            return;
        }

        Privileges[role.role].forEach((p) => permissionsSet.add(p));
    });

    return Array.from(permissionsSet).sort((a, b) => a.localeCompare(b));
}

export { getPermissionsByRoles };