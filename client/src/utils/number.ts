/**
 * 將輸入值加上千分號
 * @param digits - 小數點保留至第幾位，預設為 0
 */
export const thousands = (value: number | string, digits: number = 0) => {
    const v = typeof value === 'string' ? Number(value) : value;
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(v);
};

export const onInputNumberTypeCheck = (v: any, original: any) => {
    if (Number.isFinite(v)) {
        return v;
    }

    return original === '' ? null : v;
};