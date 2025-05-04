import { SetMetadata } from '@nestjs/common';

export const OPERATION_LOG_KEY = 'operationLog';
export const OperationLog = () => SetMetadata(OPERATION_LOG_KEY, true);