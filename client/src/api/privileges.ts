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

    static async listPermissions(): Promise<Privilege.Role[]> {
        return agent({
            method: 'GET',
            url: '/permissions',
        });
    }

    static async updatePermissions(data: Privilege.UpdatePermissions.Request): Promise<Privilege.Role> {
        return agent({
            method: 'PUT',
            url: `${data.roleId}/permissions`,
            data,
        });
    }
}
