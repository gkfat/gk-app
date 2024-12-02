import { LoginType } from 'src/enums/login-type.enum';
import { Roles } from 'src/enums/roles.enum';
import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { Account } from 'src/modules/accounts/entities/account.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { hashPassword } from 'src/utils/credential';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class AccountSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ) {
        const roleRepository = dataSource.getRepository(Role);
        const roles = Object.values(Roles);

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

        const accountRole = await roleRepository.findOneBy({ role: Roles.SUPER });

        const accountAuth = new AccountAuth({
            type: LoginType.PASSWORD,
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

        await accountRepository.upsert(superAccount, ['email']);
    }
}