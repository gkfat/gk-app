export namespace Privilege {
    export interface Role {
        id: number;
        role: string;
        permissions: string[];
    }

    export namespace UpdatePermissions {
        export interface Request {
            roleId: number;
            permissions: string[];
        }
    }
}
