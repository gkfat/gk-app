import { Privilege } from '@/types/privilege';

import { request } from './util/agent';

const agent = request('/api/v1/privileges');

export class PrivilegesService {
    static async listRoles(): Promise<Privilege.Role[]> {
        return agent({
            method: 'GET',
            url: '/roles',
        });
    }

    static async listPermissions(): Promise<Privilege.Permission[]> {
        return agent({
            method: 'GET',
            url: '/permissions',
        });
    }

    static async updatePermission(data: Privilege.UpdatePermission.Request): Promise<Privilege.Permission> {
        return agent({
            method: 'PUT',
            url: `${data.permissionId}/permission`,
            data,
        });
    }

    static async listPrivileges(): Promise<Privilege.Role[]> {
        return agent({
            method: 'GET',
            url: '',
        });
    }

    static async updatePrivileges(data: Privilege.UpdatePrivileges.Request): Promise<Privilege.Role> {
        return agent({
            method: 'PUT',
            url: `${data.roleId}/privileges`,
            data,
        });
    }
}
