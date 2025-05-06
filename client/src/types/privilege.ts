export namespace Privilege {
    export interface Role {
        id: number;
        role: string;
        permissions: Permission[];
    }

    export interface Permission {
        id: number;
        permission: string;
        description: string | null;
    }

    export namespace UpdatePrivileges {
        export interface Request {
            roleId: number;
            permissions: string[];
        }
    }

    export namespace UpdatePermission {
        export interface Request {
            permissionId: number;
            description: string | null;
        }
    }
}
