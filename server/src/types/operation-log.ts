import { RedactConfig } from 'src/utils/redact-helper/type';

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

    /** Loki 要求奈秒 */
    logTime: number;

    level?: 'info'|'warn'|'error';
}

export interface OperationLogSetup {
    /**
     * 忽略操作紀錄?
     * 預設會記錄
     * @example
     * - true - 不會紀錄 operationLog
    */
    ignoreLog?: boolean;

    /**
     * - false - 不遮罩
     * - 未設定 - 預設遮罩
     */
    redact?: RedactConfig | false;

    /**
     * 忽略 reqBody?
     * @default false
     */
    ignoreRequestBody?: boolean;

    /**
     * 忽略 resBody?
     * @default false
     */
    ignoreResponseBody?: boolean;
}