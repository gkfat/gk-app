import { OperationLogSetup } from 'src/types/operation-log';

import { SetMetadata } from '@nestjs/common';

export const OPERATION_LOG_KEY = 'operationLog';

export function OperationLog(setup: OperationLogSetup = {}) {
    return SetMetadata(OPERATION_LOG_KEY, setup);
}