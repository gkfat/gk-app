import { ConfigService } from '@nestjs/config';

import bootApp from './boot';

async function startServer() {
    console.log(`start app in ${process.env.NODE_ENV} mode`);
    
    const app = await bootApp();

    const configService = app.get(ConfigService);
    const port = configService.get('APP_PORT');

    await app.listen(+port);
    console.log(`server running on http://localhost:${port}`);
    console.log(`api documentation on http://localhost:${port}/documentation`);
}

startServer();
