import { accountsRoutes } from './accounts';
import { dashboardRoutes } from './dashboard';
import { errorsRoutes } from './errors';

export const appRoutes = [
    ...dashboardRoutes,
    ...accountsRoutes,
    ...errorsRoutes,
];
