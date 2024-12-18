/** 產生隨機 16 位字元 */
export const randomId = (): string => {
    const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
};

export const checkNull = (value: string | null | undefined) => {
    if (!value || String(value).length === 0) {
        return '-';
    }

    return value;
};

export const equals = (any1: any, any2: any) => {
    try {
        return JSON.stringify(any1) === JSON.stringify(any2);
    } catch (e) {
        console.error('equals error: ', e);
    }

    return false;
};

export const sleepSeconds = (seconds: number) => new Promise(
    (resolve) => {
        setTimeout(() => resolve(null), seconds * 1000);
    },
);

export const updownClass = (value: string | number) => {
    const num = Number(value);

    if (!Number.isFinite(num) || num === 0) {
        return '';
    }

    return num > 0 ? 'error' : 'success';
};