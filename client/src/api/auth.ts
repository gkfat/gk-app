import { Auth } from '@/types/auth';

import { request } from './util/agent';

const agent = request('/api/v1/auth');

export class AuthService {
    static async login(
        data: Auth.Login.Request,
    ): Promise<Auth.Login.Response> {
        return agent({
            method: 'POST',
            url: '/login',
            data,
        });
    }

    static async signUp(
        data: Auth.SignUp.Request,
    ): Promise<Auth.SignUp.Response> {
        return agent({
            method: 'POST',
            url: '/sign-up',
            data,
        });
    }

    static async sendVerificationCode(
        data: Auth.SendVerificationCode.Request,
    ): Promise<void> {
        return agent({
            method: 'POST',
            url: '/send-verification-code',
            data,
        });
    }

    static async verifyCode(
        data: Auth.VerifyCode.Request,
    ): Promise<void> {
        return agent({
            method: 'POST',
            url: '/verify-code',
            data,
        });
    }
}
