import { EnumLoginType } from 'src/enums/login-type.enum';

export class CreateAccountAuthDto {
    type: EnumLoginType;

    /** account email / oauth sub */
    identifier: string;

    /** account hashed password / null */
    credential: string;
}