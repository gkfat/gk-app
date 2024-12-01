import { Role } from './role';

export namespace Account {
    export interface Account {
        id: number;
        email: string;
        name: string;
        enabled: boolean;
        last_login_at: string;
        create_at: string;
        update_at: string | null;
        delete_at: string | null;
        roles: Role.Role[];
        permissions: string[];
    }

    export namespace Me {
        export type Response = Account;
    }
  
}
