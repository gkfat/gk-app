export interface RedactConfig {
    /**
     * 遮罩字樣
     * @default '[REDACTED]'
     */
    censor?: string;
    /**
     * keywords or patterns to redacted
     *
     * - *wildcard supported
     * @default "['password', 'token', 'authorization', 'secret']"
     * @example
     * ["*password"] - match cases: "['any_password', 'password']"
     * ["passwor*"] - match cases: "['passwora', 'passworb', 'password_some', 'passwords', 'password']"
     */
    additionalMatches?: string[];
    /**
     * - 'exact' - 完全匹配
     * - 'fuzzy' - 模糊匹配
     * @default 'fuzzy'
     * @example
     * matches: "['*password*']"
     * content: "{'password':'abc123','password_new':'abc223','newPassword':'abc333','notpasswor':'aaa111'}"
     * @example 'exact'
     * "{'password':'[REDACTED]','password_new':'abc223','newPassword':'abc333','notpasswor': aaa111'}"
     * @example 'fuzzy'
     * "{'password':'[REDACTED]','password_new':'[REDACTED]','newPassword':'[REDACTED]','notpasswor':'aaa111'}"
     */
    matchPolicy?: 'exact' | 'fuzzy';
    /**
     * 是否區分大小寫?
     * @default false
     */
    caseSensitive?: boolean;
    /**
     * 是否序列化結果?
     * @default true
     */
    serialize?: boolean;
}
