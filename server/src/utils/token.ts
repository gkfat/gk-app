import { ExecutionContext } from '@nestjs/common';

function extractTokenFromHeader(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();

    const [type, token] = request.headers['x-auth-token']?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
}

export { extractTokenFromHeader };