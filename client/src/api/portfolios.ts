import _ from 'lodash';

import { Portfolio } from '@/types/portfolio';
import { Transaction } from '@/types/transaction';

import { request } from './util/agent';

const agent = request('/api/v1/portfolios');

export class PortfoliosService {
    static async list(): Promise<Portfolio.Portfolio[]> {
        return agent({
            method: 'GET',
            url: '/',
        });
    }

    static async create(data: Portfolio.Create.Request): Promise<Portfolio.Create.Response> {
        return agent({
            method: 'POST',
            url: '/create',
            data,
        });
    }

    static async update(data: Portfolio.Update.Request): Promise<Portfolio.Update.Response> {
        return agent({
            method: 'PUT',
            url: `/${data.id}`,
            data: _.omit(data, ['id']),
        });
    }

    static async delete(id: number) {
        return agent({
            method: 'DELETE',
            url: `/${id}`,
        });
    }

    static async createTransaction(data: Transaction.Create.Request): Promise<Transaction.Create.Response> {
        return agent({
            method: 'POST',
            url: '/transactions/create',
            data,
        });
    }
}
