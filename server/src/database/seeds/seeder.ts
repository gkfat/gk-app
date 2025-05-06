import {
    EnumLoginType,
    EnumRole,
} from 'src/enums';
import { Privileges } from 'src/enums/privileges.enum';
import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { Account } from 'src/modules/accounts/entities/account.entity';
import { RolePermission } from 'src/modules/privileges/entities/role-permission.entity';
import { Role } from 'src/modules/privileges/entities/role.entity';
import { hashPassword } from 'src/utils/credential';
import {
    DataSource,
    Repository,
} from 'typeorm';
import { Seeder } from 'typeorm-extension';

const seedRoles = async (roleRepository: Repository<Role>) => {
    const roles = Object.values(EnumRole);

    for (const role of roles) {
        const newRole = new Role({ role });
        await roleRepository.upsert(newRole, ['role']);
    }
};

const seedPermissions = async (roleRepository: Repository<Role>) => {
    const findMemberRole = await roleRepository.findOne({
        where: { role: EnumRole.MEMBER },
        relations: { permissions: true }, 
    });

    // 若已有權限就跳過以避免重置覆蓋
    if (findMemberRole.permissions.length) {
        return;
    }

    const memberPermissions = Privileges[EnumRole.MEMBER].map((permission) => new RolePermission({ permission }));

    findMemberRole.permissions = memberPermissions;

    await roleRepository.save(findMemberRole);
};

interface SeedAccountOptions {
    name: string;
    email: string;
    password: string;
    role: EnumRole;
}

const seedAccount = async (
    accountRepository: Repository<Account>,
    roleRepository: Repository<Role>,
    options: SeedAccountOptions,
) => {
    const {
        name, email, password, role, 
    } = options;
 
    const findRole = await roleRepository.findOneBy({ role });

    if (!findRole) {
        throw new Error(`Role ${role} not found`);
    }

    const findExistingAccount = await accountRepository.findOne({
        where: { email },
        relations: {
            auths: true,
            roles: true, 
        },
        withDeleted: false,
    });

    if (findExistingAccount) {
        return;
    }

    const accountAuth = new AccountAuth({
        type: EnumLoginType.PASSWORD,
        identifier: email,
        credential: hashPassword(password),
    });

    const newAccount = new Account({
        name,
        email,
        enabled: true,
        email_verified: true,
        auths: [accountAuth],
        roles: [findRole],
    });

    await accountRepository.save(newAccount);
};

export class AppSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ) {
        const roleRepository = dataSource.getRepository(Role);
        const accountRepository = dataSource.getRepository(Account);

        await seedRoles(roleRepository);
        await seedPermissions(roleRepository);

        const accountsData: SeedAccountOptions[] = [
            {
                name: 'super',
                email: process.env.SUPER_EMAIL || 'super@gkapp.com',
                password: process.env.SUPER_PASSWORD ?? 'super123',
                role: EnumRole.SUPER,
            }, {
                name: 'demo',
                email: 'demo@gkapp.com',
                password: 'demo123',
                role: EnumRole.MEMBER,
            },
        ];

        await Promise.allSettled(accountsData.map((options) => seedAccount(accountRepository, roleRepository, options)));
    }
}