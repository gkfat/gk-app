import axios from 'axios';
import { OperationLogCfg } from 'src/types/operation-log';

import {
    Injectable,
    Logger,
} from '@nestjs/common';

@Injectable()
export class LoggerService {
    private readonly logger = new Logger(LoggerService.name);

    private readonly lokiUrl = process.env.LOKI_URL;
    private readonly lokiId = process.env.LOKI_ID;
    private readonly lokiToken = process.env.LOKI_TOKEN;

    async operationLog(data: OperationLogCfg) {
        const {
            startDate,
            endDate,
            path,
            action,
            resultCode,
            user,
            request,
            result,
            duration,
        
            level = 'info',
        } = data;

        /** Loki 要求奈秒 */
        const timestamp = Date.now() * 1_000_000;

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
                        app: 'gkapp',
                        env: process.env.NODE_ENV || 'development',
                    },
                    values: [[timestamp.toString(), logLine]],
                },
            ],
        };

        try {
            const auth = `${this.lokiId}:${this.lokiToken}`;
            const apiUrl = `${this.lokiUrl}/api/v1/push`;

            await axios.post(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
                },
            });
            
            this.logger.log('push log to loki success');
        } catch (error) {
            this.logger.error('Failed to send log to Loki', error);
        }
    }
}