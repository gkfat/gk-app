import {
    Observable,
    tap,
} from 'rxjs';
import { OPERATION_LOG_KEY } from 'src/decorators/operation-log.decorators';
import { LoggerService } from 'src/middlewares/logger.service';

import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OperationLogInterceptor implements NestInterceptor {
    constructor(
        private readonly loggerService: LoggerService,
        private readonly reflector: Reflector,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const shouldLog = this.reflector.get<boolean>(
            OPERATION_LOG_KEY,
            context.getHandler(),
        );

        if (!shouldLog) return next.handle();
    
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const startTime = new Date();
        const startTimestamp = startTime.getTime();

        let user: string | null = null;
    
        if (request?.$tokenPayload) {
            user = `(${request.$tokenPayload.account.id}) ${request.$tokenPayload.account.email}`;
        }

        // 攔截 response.send
        let responseBody: any = null;
        const originalSend = response.send.bind(response);
        response.send = (body: any): any => {
            responseBody = body;
            return originalSend(body);
        };
    
        return next.handle().pipe(
            tap(async () => {
                const endTime = new Date();
                const duration = endTime.getTime() - startTimestamp;

                await this.loggerService.operationLog({
                    startDate: startTime.toISOString(),
                    endDate: endTime.toISOString(),
                    path: request.url,
                    action: request.method,
                    resultCode: context.getArgs()[1]?.statusCode || 200,
                    user,
                    request: request.body ? JSON.stringify(request.body) : null,
                    result: typeof responseBody === 'object'
                        ? JSON.stringify(responseBody)
                        : String(responseBody),
                    duration,
                
                    level: 'info',
                });
            }),
        );
    }
}