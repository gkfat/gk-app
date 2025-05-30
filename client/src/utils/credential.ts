/** 密碼組成規則: 6~10 位英數字 */
export const REGEX_PASSWORD = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/;

export const Regex = {
    email: /\S+@\S+\.\S+/,
    /** 密碼組成規則: 6~10 位英數字 */
    password: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/,
};