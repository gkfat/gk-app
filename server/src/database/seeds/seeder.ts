import {
    EnumLoginType,
    EnumRole,
    Privileges,
} from 'src/enums';
import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { Account } from 'src/modules/accounts/entities/account.entity';
import { Permission } from 'src/modules/privileges/entities/permission.entity';
import { Role } from 'src/modules/privileges/entities/role.entity';
import { hashPassword } from 'src/utils/credential';
import { flattenPermissions } from 'src/utils/permissions';
import {
    DataSource,
    Repository,
} from 'typeorm';
import { Seeder } from 'typeorm-extension';

// 寫入角色與權限
const seedRoles = async (roleRepository: Repository<Role>, permissionRepository: Repository<Permission>) => {
    const roles = Object.values(EnumRole);

    for (const role of roles) {
        const rolePermissions: string[] = role !== EnumRole.SUPER ? Privileges[role] : [];
        
        const findPermissions = await permissionRepository.find({ where: rolePermissions.map((p) => ({ permission: p })) });
    
        const existingRole = await roleRepository.findOne({
            where: { role },
            relations: { permissions: true }, 
        });

        if (!existingRole) {
            const newRole = new Role({
                role,
                permissions: findPermissions,
            });
    
            await roleRepository.save(newRole);
        }

        // 若已存在的角色但沒有權限則更新權限(排除 Super)
        if (!existingRole.permissions?.length && role !== EnumRole.SUPER) {
            existingRole.permissions = findPermissions;
            await roleRepository.save(existingRole);
        }
    }
};

// 寫入所有權限
const seedPermissions = async (permissionRepository: Repository<Permission>) => {
    const allPermissions = flattenPermissions();

    const existing = await permissionRepository.find();
    const existingSet = new Set(existing.map((p) => p.permission));

    const toInsert = allPermissions
        .filter((p) => !existingSet.has(p))
        .map((permission) => new Permission({ permission }));
    
    if (toInsert.length > 0) {
        await permissionRepository.save(toInsert);
    }

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
        const permissionRepository = dataSource.getRepository(Permission);
        const accountRepository = dataSource.getRepository(Account);

        await seedPermissions(permissionRepository);
        
        await seedRoles(roleRepository, permissionRepository);

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