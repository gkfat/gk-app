import axios from 'axios';
import { OperationLogCfg } from 'src/types/operation-log';

import {
    Injectable,
    Logger,
} from '@nestjs/common';

import { SearchLogsRequestDto } from './dto/search-logs.dto';

function formatter(data: [string, string]): OperationLogCfg {
    const [logTime, log] = data;

    const parsed = JSON.parse(log) as OperationLogCfg;

    return {
        ...parsed,

        logTime: Number(logTime) / (1000 * 1000),
    };
   
}

@Injectable()
export class AuditingService {
    private readonly logger = new Logger(AuditingService.name);

    private readonly lokiAppName = process.env.LOKI_APP || 'gkapp-local';
    private readonly lokiUrl = process.env.LOKI_URL;
    private readonly lokiId = process.env.LOKI_ID;
    private readonly lokiToken = process.env.LOKI_TOKEN;
    private readonly env = process.env.NODE_ENV || 'development';

    getAuthorization() {
        const auth = `${this.lokiId}:${this.lokiToken}`;

        return {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
        };
    }

    get getApiUrl() {
        return {
            push: `${this.lokiUrl}/api/v1/push`,
            queryRange: `${this.lokiUrl}/api/v1/query_range`,
        };
    }
    
    async writeOperationLog(data: OperationLogCfg) {
        const {
            startDate,
            endDate,
            path,
            action,
            resultCode,
            user,
            duration,
            request,
            result,
            logTime,
            
            level = 'info',
        } = data;

        const logLine = JSON.stringify({
            startDate,
            endDate,
            path,
            action,
            resultCode,
            user,
            request,
            result,
            duration,
            level,
        });

        const payload = {
            streams: [
                {
                    stream: {
                        job: 'api-server',
                        level,
                        app: this.lokiAppName,
                        env: this.env,
                    },
                    values: [[logTime.toString(), logLine]],
                },
            ],
        };

        try {

            await axios.post(
                this.getApiUrl.push,
                payload,
                { headers: this.getAuthorization() },
            );
            
            this.logger.log('push log to loki success');
        } catch (error) {
            this.logger.error('Failed to send log to Loki', error);
        }
    }

    async searchOperationLog(reqBody: SearchLogsRequestDto) {
        const labelPairs = {
            app: this.lokiAppName,
            ...(reqBody.labels || {}),
        };

        const labelSelector = Object.entries(labelPairs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(',');

        const filter = reqBody.keyword ? `|~ "${reqBody.keyword}"` : '';

        const params: any = {
            query: `{${labelSelector}} ${filter}`,
            direction: 'backward',
            start: new Date(reqBody.startDate).getTime() * 1_000_000,
            end: new Date(reqBody.endDate).getTime() * 1_000_000,
        };

        try {
            const { data: { data: { result } } } = await axios.get(
                this.getApiUrl.queryRange,
                {
                    headers: this.getAuthorization(),
                    params,
                },
            );

            const rawLogs = (result[0]?.values ?? []) as [string, string][];

            return rawLogs.map(formatter);
        } catch (error) {
            console.error('Failed to query Loki logs:', error.response?.data || error.message);
            throw error;
        }
    }

}
