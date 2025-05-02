import bootNest from './nest';
import initSwagger from './swagger';

async function bootApp() {
    const app = await bootNest();

    initSwagger(app);

    return app;
}

export default bootApp;