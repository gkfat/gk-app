import { accountsRoutes } from './accounts';
import { dashboardRoutes } from './dashboard';
import { errorsRoutes } from './errors';
import { portfoliosRoutes } from './portfolios';

export const appRoutes = [
    ...dashboardRoutes,
    ...accountsRoutes,
    ...portfoliosRoutes,
    ...errorsRoutes,
];
