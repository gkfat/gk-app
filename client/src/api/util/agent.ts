import axios, {
    AxiosError,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
} from 'axios';

import { context } from '../index';

const beforeRequestInterceptor = async (config: InternalAxiosRequestConfig) => {
    const authStore = context.get('authStore');

    if (authStore) {
        config.headers.Authorization = `Bearer ${authStore.state.token}`;
    }

    return config;
};

const errorHandler = async (error: AxiosError) => {
    const authStore = context.get('authStore');

    if (error?.response?.status) {
        if (error.response.status === 403) {
            await authStore.logout();
            authStore.router.push('/login');
        }
    }

    throw error;
};

axios.interceptors.request.use(beforeRequestInterceptor, (error) => Promise.reject(error));
axios.interceptors.response.use((response) => response, errorHandler);

export const request = (apiBase: string) => {
    const requestAsync = async (args: {
        method: 'GET'|'POST'|'DELETE'|'PUT',
        url: string,
        params?: URLSearchParams,
        data?: object
        customHeaders?: { [key: string]: string }
    }) => {

        const appStore = context.get('appStore');
        const baseURL: string = `${appStore.state.environmentVariables.apiUrl}${apiBase}`
        || `${import.meta.env.VITE_API_URL}${apiBase}`;

        const req: AxiosRequestConfig = {
            baseURL,
            method: args.method,
            url: args.url,
            params: args.params,
            data: args.data,
            timeout: 60000,
        };

        const res = await axios(req);
        return res.data;
    };

    return requestAsync;
};
