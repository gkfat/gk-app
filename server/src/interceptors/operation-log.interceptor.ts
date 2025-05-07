import {
    Request,
    Response,
} from 'express';
import {
    Observable,
    tap,
} from 'rxjs';
import { OPERATION_LOG_KEY } from 'src/decorators/operation-log.decorators';
import { ITokenPayload } from 'src/decorators/token-payload.decorators';
import { AuditingService } from 'src/modules/auditing/auditing.service';
import { OperationLogSetup } from 'src/types/operation-log';
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
        private readonly auditingService: AuditingService,
        private readonly reflector: Reflector,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const setup = this.reflector.get<OperationLogSetup>(OPERATION_LOG_KEY, context.getHandler());

        if (setup?.ignoreLog) {
            return next.handle();
        }
    
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request & { headers: { $tokenPayload?: ITokenPayload } }>();
        const response = ctx.getResponse<Response>();

        const startTime = new Date();

        const userPayload = request.headers.$tokenPayload?.scope ?? (request as any).$tokenPayload?.scope;
        const user = userPayload
            ? `(${userPayload.sub}) ${userPayload.email}`
            : null;

        const requestBody = !setup?.ignoreRequestBody && request.body
            ?
            (
                setup?.redact === false
                    ? request.body
                    : redactHelper.redactValue({
                        cfg: {
                            serialize: true,
                            ...(setup?.redact || {}), 
                        },
                        content: request.body,
                    })
            )
            : null;

        return next.handle().pipe(
            tap({
                next: async (responseBody: any) => {
                    const endTime = new Date();
                    const duration = endTime.getTime() - startTime.getTime();
                        
                    const responseBodyStr = !setup?.ignoreResponseBody
                        ? 
                        (
                            setup?.redact === false
                                ? responseBody
                                : redactHelper.redactValue({
                                    cfg: {
                                        serialize: true,
                                        ...(setup?.redact || {}), 
                                    },
                                    content: responseBody,
                                })
                        )
                        : null;

                    try {
                        await this.auditingService.writeOperationLog({
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
                            logTime: Date.now() * 1_000_000,
                        });
                    } catch (err) {
                        console.error('[OperationLogInterceptor] Logging failed', err);
                    }
                },
            }),
         
        );
    }
}