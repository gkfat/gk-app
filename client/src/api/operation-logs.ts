import { OperationLog } from '@/types/operation-log';

import { request } from './util/agent';

const agent = request('/api/v1/operation-logs');

export class OperationLogsService {
    static async search(data: OperationLog.Search.Request): Promise<OperationLog.OperationLog[]> {
        return agent({
            method: 'POST',
            url: '/search',
            data,
        });
    }
}
