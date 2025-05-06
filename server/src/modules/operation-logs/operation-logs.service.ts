import axios from 'axios';
import { OperationLogCfg } from 'src/types/operation-log';

import { Injectable } from '@nestjs/common';

import { SearchLogsRequestDto } from './dto/search-logs.dto';

@Injectable()
export class OperationLogsService {
    private readonly lokiUrl = process.env.LOKI_URL;
    private readonly lokiId = process.env.LOKI_ID;
    private readonly lokiToken = process.env.LOKI_TOKEN;

    formatter(data: [string, string][]): OperationLogCfg[] {
        return data.map(([ , log]) => {
            return JSON.parse(log) as OperationLogCfg;
        });
    }

    async searchLogs(reqBody: SearchLogsRequestDto) {
        const apiUrl = `${this.lokiUrl}/api/v1/query_range`;
        const headers = { Authorization: `Basic ${Buffer.from(`${this.lokiId}:${this.lokiToken}`).toString('base64')}` };

        const params: any = {
            query: '{app="gkapp"}',
            direction: 'backward',
            start: reqBody.startDate,
            end: reqBody.endDate,
        };

        try {
            const { data: { data: { result } } } = await axios.get(apiUrl, {
                headers,
                params,
            });

            const rawLogs = result[0]?.values ?? [];

            return this.formatter(rawLogs);
        } catch (error) {
            console.error('Failed to query Loki logs:', error.response?.data || error.message);
            throw error;
        }
    }

}
