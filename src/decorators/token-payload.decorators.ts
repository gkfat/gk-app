import { Role } from 'src/modules/roles/entities/role.entity';

import {
    createParamDecorator,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';

export interface ITokenPayload {
    scope: {
        sub: number;
        email: string;
        name: string;
        roles: Role[];
    }
}

export const $TokenPayload = createParamDecorator<string|undefined>(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const payload = request.headers['$tokenPayload'];

        if (!payload) {
            throw new ForbiddenException('token expired, please re-login');
        }
        
        return payload as ITokenPayload;
    },
);