import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { Portfolio } from 'src/modules/portfolios/entities/portfolio.entity';
import {
    CashTradeRecord,
    FXTradeRecord,
    StockTradeRecord,
} from 'src/modules/portfolios/entities/trade-record.entity';
import { RolePermission } from 'src/modules/privileges/entities/role-permission.entity';
import { Role } from 'src/modules/privileges/entities/role.entity';

import { Account } from '../modules/accounts/entities/account.entity';

export const entities = [
    Account,
    AccountAuth,
    Role,
    RolePermission,
    Portfolio,
    StockTradeRecord,
    FXTradeRecord,
    CashTradeRecord,
];