import { EnumLoginType } from '@/enums/login-type';

import { Account } from './account';

export namespace Auth {
    export namespace Login {
        export interface LoginType {
            type: EnumLoginType;
        }

        export interface PasswordLoginRequest extends LoginType {
            email: string;
            password: string;
        }

        export interface GoogleLoginRequest extends LoginType {
            /** 使用授權碼來登入 */
            code: string;
        }

        export type Request = PasswordLoginRequest | GoogleLoginRequest;

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
