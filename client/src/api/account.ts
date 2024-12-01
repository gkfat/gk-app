import { Account } from '@/types/account';

import { request } from './util/agent';

const agent = request('/api/v1/accounts');

export class AccountService {
    static async me(): Promise<Account.Me.Response> {
        return agent({
            method: 'GET',
            url: '/me',
        });
    }
}
