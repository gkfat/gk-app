import { Account } from '@/types/account';

import { request } from './util/agent';

const agent = request('/api/v1/accounts');

export class AccountsService {
    static async me(): Promise<Account.Me.Response> {
        return agent({
            method: 'GET',
            url: '/me',
        });
    }

    static async list(): Promise<Account.List.Response> {
        return agent({
            method: 'GET',
            url: '',
        });
    }

    static async enable(id: number) {
        return agent({
            method: 'PUT',
            url: `/${id}/enable`,
        });
    }

    static async updateRoles(id: number, roleIds: number[]) {
        return agent({
            method: 'PUT',
            url: `/${id}/roles`,
            data: {
                roleIds
            }
        });
    }

    static async delete(id: number) {
        return agent({
            method: 'DELETE',
            url: `/${id}`,
        });
    }
}
