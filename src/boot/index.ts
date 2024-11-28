import bootNest from './nest';
import initRbac from './rbac';

async function bootApp() {
    await initRbac();
    
    return bootNest()
}

export default bootApp;