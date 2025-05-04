export namespace OperationLog {
    export interface OperationLog {
        startDate: string;
        endDate: string;
        path: string;
        action: string;
        resultCode: number;
        user: string;
        request: string | null;
        result: string | null;
        duration: number;
        level: 'info'|'warn'|'error';
    }
    
    export namespace Search {
        export interface Request {
            startDate: string;
            endDate: string;
        }

    }

}