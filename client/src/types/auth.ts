import { LoginType } from '@/enums/login-type';

import { Account } from './account';

export namespace Auth {
    export namespace Login {
        export interface Request {
            email: string;
            password: string;
            type: LoginType;
            idToken?: string;
        }

        export interface Response {
            account: Account.Account;
            token: string;
        }
    }
  
    export namespace SignUp {
        export interface Request {
            email: string;
            name: string;
            password: string;
        }

        export interface Response {
            account: Account.Account;
        }
    }
}
