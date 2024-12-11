import { Role } from '@/types/role';

import { request } from './util/agent';

const agent = request('/api/v1/privileges');

export class PrivilegesService {
    static async listRoles(): Promise<Role.Role[]> {
        return agent({
            method: 'GET',
            url: '/roles',
        });
    }
}
