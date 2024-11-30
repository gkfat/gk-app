import { LoginType } from 'src/enums/login-type.enum';

export class CreateAccountAuthDto {
    type: typeof LoginType[keyof typeof LoginType];

    /** account email / oauth sub */
    identifier: string;

    /** account hashed password / null */
    credential: string;
}