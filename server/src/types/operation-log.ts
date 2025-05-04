export interface OperationLogCfg {
    startDate: string;
    endDate: string;
    path: string;
    action: string;
    resultCode: number;
    user: string;
    request: string | null;
    result: string | null;
    duration: number;

    level?: 'info'|'warn'|'error';
}
