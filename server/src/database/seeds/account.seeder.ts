import { EnumLoginType } from 'src/enums/login-type.enum';
import { EnumRoles } from 'src/enums/roles.enum';
import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { Account } from 'src/modules/accounts/entities/account.entity';
import { Role } from 'src/modules/privileges/entities/role.entity';
import { hashPassword } from 'src/utils/credential';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class AccountSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ) {
        const roleRepository = dataSource.getRepository(Role);
        const roles = Object.values(EnumRoles);

        for (const role of roles) {
            const newRole = new Role({ role });
            await roleRepository.upsert(newRole, ['role']);
        }

        const accountRepository = dataSource.getRepository(Account);

        const name = 'super';
        const email = process.env.SUPER_EMAIL || 'super@got2do.com';
        const password = process.env.SUPER_PASSWORD
            ? hashPassword(process.env.SUPER_PASSWORD)
            : hashPassword('super');

        const accountRole = await roleRepository.findOneBy({ role: EnumRoles.SUPER });

        const accountAuth = new AccountAuth({
            type: EnumLoginType.PASSWORD,
            identifier: email,
            credential: password,
        });

        const superAccount = new Account({
            name,
            email,
            enabled: true,
            auths: [accountAuth],
            roles: [accountRole],
        });

        const findConflict = await accountRepository.findOneBy({ email });

        if (!findConflict) {
            await accountRepository.save(superAccount);
        } else {
            findConflict.auths = superAccount.auths;
            findConflict.roles = superAccount.roles;

            await accountRepository.save(findConflict);
        }
    }
}