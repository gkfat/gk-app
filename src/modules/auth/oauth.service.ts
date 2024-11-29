import { OAuth2Client } from 'google-auth-library';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoginOrCreateDto } from './dto/login-or-create.dto';

@Injectable()
export class OAuthService {
    private CLIENT_ID: string;
    private gAuth: OAuth2Client;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.CLIENT_ID = this.configService.getOrThrow('GOOGLE_CLIENT_ID');
        this.gAuth = new OAuth2Client(this.CLIENT_ID);
    }

    async google(reqBody: LoginOrCreateDto) {
        const { idToken } = reqBody;

        try {
            const ticket = await this.gAuth.verifyIdToken({
                idToken,
                audience: this.CLIENT_ID,
            });

            const userInfo = ticket.getPayload();

            if (userInfo) {
                return {
                    email: userInfo.email,
                    name: userInfo.name,
                    identifier: userInfo.sub,
                    credential: null,
                };
            }

        } catch (err) {
            console.error('Google login fail: ', err);
        }

        return null;
    }

}

