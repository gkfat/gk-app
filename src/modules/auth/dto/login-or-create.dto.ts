import { LoginType } from 'src/enums/login-type.enum';

export class LoginOrCreateDto {
    type: typeof LoginType[keyof typeof LoginType];
    email: string;
    password: string;
    idToken?: string;
}