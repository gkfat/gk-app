import { OperationLog } from '@/types/operation-log';

import { request } from './util/agent';

const agent = request('/api/v1/auditing');

export class AuditingService {
    static async searchOperationLog(data: OperationLog.Search.Request): Promise<OperationLog.OperationLog[]> {
        return agent({
            method: 'POST',
            url: '/operation-log/search',
            data,
        });
    }
}
