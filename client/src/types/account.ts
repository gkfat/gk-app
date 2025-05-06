import { Privilege } from './privilege';

export namespace Account {
    export interface Account {
        id: number;
        email: string;
        name: string;
        avatar: string;
        enabled: boolean;
        last_login_at: string;
        create_at: string;
        update_at: string | null;
        roles: Privilege.Role[];
        permissions: string[];
        email_verified: boolean;
    }

    export namespace Me {
        export type Response = Account;
    }

    export namespace List {
        export type Response = Account[];
    }

    export namespace Create {
        export interface Request {
            email: string;
            name: string;
            password: string;
        }

        export type Response = Account;
    }
  
}
