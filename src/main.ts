import { ConfigService } from '@nestjs/config';

import bootApp from './boot';

async function startServer() {
  const app = await bootApp();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT');

  await app.listen(port);
  console.log(`server running on http://localhost:${port}`);
}

startServer();
