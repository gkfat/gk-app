import * as bcrypt from 'bcrypt';
import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { LoginOrCreateDto } from 'src/modules/auth/dto/login-or-create.dto';

function hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
}

function verifyPassword(input: string, hashedPassword: string) {
    return bcrypt.compareSync(input, hashedPassword);
}

function verifyPasswordLogin(inputAuth: LoginOrCreateDto, dbAuth: AccountAuth) {
    if (!dbAuth.identifier || !inputAuth.email || !inputAuth.password) {
        return false;
    }

    const validIdentifier = dbAuth.identifier === inputAuth.email;
    const validCredential = verifyPassword(inputAuth.password, dbAuth.credential);

    return validIdentifier && validCredential;
}

export {
    hashPassword,
    verifyPassword,
    verifyPasswordLogin,
};