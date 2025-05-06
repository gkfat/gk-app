import { RedactConfig } from './type';

/**
 * 檢查鍵是否符合給定模式及 pattern
 */
function matchPattern(key: string, pattern: string, policy: 'exact'|'fuzzy'): boolean {
    // 精準相符
    if (policy === 'exact') {
        return key === pattern;
    }

    // 模糊相符或 wildcard 相符
    if (pattern.startsWith('*') || pattern.endsWith('*')) {
        const _pattern = pattern.replace(/\*/g, '.*');
        const regex = new RegExp(_pattern);

        return regex.test(key);
    }

    return false;
}

/**
 * 遞迴替換輸入值匹配到的鍵值
 */
function recursiveRedact(
    content: any,
    redactCfg: { matches: string[] } & RedactConfig,
    seen: WeakSet<object> = new WeakSet(),
) {
    const {
        censor,
        caseSensitive,
        matchPolicy,
        matches,
    } = redactCfg;

    if (content === null || typeof content !== 'object') {
        return content;
    }

    if (seen.has(content)) {
        return '[Circular]';
    }

    seen.add(content);

    if (Array.isArray(content)) {
        return content.map((item) => recursiveRedact(item, redactCfg, seen));
    }

    // 處理 obj
    const result: Record<string, any> = {};
    for (const key in content) {
        const _key = caseSensitive ? key : key.toLowerCase();
        const isMatch = matches.some((pattern) => {
            const _pattern = caseSensitive ? pattern : pattern.toLowerCase();
            return matchPattern(_key, _pattern, matchPolicy);
        });

        result[key] = isMatch
            ? censor
            : recursiveRedact(content[key], redactCfg, seen);
    }
    
    return result;
}

function redactValue({
    cfg,
    content,
}: {
    cfg: RedactConfig | boolean;
    content: any;
}) {
    const censor = (typeof cfg !== 'boolean' && cfg.censor) ? cfg.censor : '[REDACTED]';
    const caseSensitive = !!(typeof cfg !== 'boolean' && cfg.caseSensitive);
    const matchPolicy = (typeof cfg !== 'boolean' && cfg.matchPolicy === 'exact') ? 'exact' : 'fuzzy';

    const defaultMatches = [
        'password',
        'token',
        'authorization',
        'idToken',
        'secret',
    ];
    const additionalMatches = (typeof cfg !== 'boolean' && Array.isArray(cfg.additionalMatches))
        ? cfg.additionalMatches
        : [];

    const matches = cfg === false
        ? []
        : [...defaultMatches, ...additionalMatches];

    if (matchPolicy === 'fuzzy') {
        matches.forEach((path) => {
            matches.push(`*${path}`);
            matches.push(`${path}*`);
        });
    }

    const result = recursiveRedact(
        content,
        {
            censor,
            caseSensitive,
            matchPolicy,
            matches,
        },
    );

    return (typeof cfg !== 'boolean' && cfg.serialize === false) ? result : JSON.stringify(result);
}

export const redactHelper = { redactValue };
