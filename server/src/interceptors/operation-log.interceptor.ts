import {
    Observable,
    tap,
} from 'rxjs';
import { OPERATION_LOG_KEY } from 'src/decorators/operation-log.decorators';
import { ITokenPayload } from 'src/decorators/token-payload.decorators';
import { LoggerService } from 'src/middlewares/logger.service';
import { redactHelper } from 'src/utils/redact-helper';

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
        const request = ctx.getRequest<Request & { $tokenPayload?: ITokenPayload }>();
        const response = ctx.getResponse();

        const startTime = new Date();

        const userPayload = request.$tokenPayload?.scope;
        const user = userPayload
            ? `(${userPayload.sub}} ${userPayload.email}`
            : null;
            
        const requestBody = request.body
            ? redactHelper.redactValue({
                cfg: { serialize: true }, content: request.body, 
            })
            : null;

        return next.handle().pipe(
            tap({
                next: async (responseBody: any) => {
                    const endTime = new Date();
                    const duration = endTime.getTime() - startTime.getTime();
                        
                    const responseBodyStr = redactHelper.redactValue({
                        cfg: { serialize: true }, content: responseBody, 
                    });

                    try {
                        await this.loggerService.operationLog({
                            startDate: startTime.toISOString(),
                            endDate: endTime.toISOString(),
                            path: request.url,
                            action: request.method,
                            resultCode: response.statusCode || 200,
                            user,
                            request: requestBody,
                            result: responseBodyStr,
                            duration,
                            level: 'info',
                        });
                    } catch (err) {
                        console.error('[OperationLogInterceptor] Logging failed', err);
                    }
                },
            }),
         
        );
    }
}