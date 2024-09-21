export interface RugcheckResponse {
    mint: string;
    tokenProgram: string;
    creator: null;
    token: Token;
    token_extensions: null;
    tokenMeta: TokenMeta;
    topHolders: Holder[];
    freezeAuthority: null;
    mintAuthority: null;
    risks: any[];
    score: number;
    fileMeta: FileMeta;
    lockerOwners: Lockerers;
    lockers: Lockerers;
    lpLockers: null;
    markets: Market[];
    totalMarketLiquidity: number;
    totalLPProviders: number;
    rugged: boolean;
    tokenType: string;
    transferFee: TransferFee;
    knownAccounts: { [key: string]: KnownAccount };
    events: any[];
    verification: Verification;
    detectedAt: Date;
}

export interface FileMeta {
    description: string;
    name: string;
    symbol: string;
    image: string;
}

export interface KnownAccount {
    name: string;
    type: string;
}

export interface Lockerers {
}

export interface Market {
    pubkey: string;
    marketType: string;
    mintA: string;
    mintB: string;
    mintLP: string;
    liquidityA: string;
    liquidityB: string;
    mintAAccount: Token;
    mintBAccount: Token;
    mintLPAccount: Token;
    liquidityAAccount: LiquidityAccount;
    liquidityBAccount: LiquidityAccount;
    lp: Lp;
}

export interface LiquidityAccount {
    mint: string;
    owner: string;
    amount: number;
    delegate: null;
    state: number;
    delegatedAmount: number;
    closeAuthority: null;
}

export interface Lp {
    baseMint: string;
    quoteMint: string;
    lpMint: string;
    quotePrice: number;
    basePrice: number;
    base: number;
    quote: number;
    reserveSupply: number;
    currentSupply: number;
    quoteUSD: number;
    baseUSD: number;
    pctReserve: number;
    pctSupply: number;
    holders: Holder[] | null;
    totalTokensUnlocked: number;
    tokenSupply: number;
    lpLocked: number;
    lpUnlocked: number;
    lpLockedPct: number;
    lpLockedUSD: number;
    lpMaxSupply: number;
    lpCurrentSupply: number;
    lpTotalSupply: number;
}

export interface Holder {
    address: string;
    amount: number;
    decimals: number;
    pct: number;
    uiAmount: number;
    uiAmountString: string;
    owner: string;
    insider: boolean;
}

export interface Token {
    mintAuthority: null | string;
    supply: number;
    decimals: number;
    isInitialized: boolean;
    freezeAuthority: null;
}

export interface TokenMeta {
    name: string;
    symbol: string;
    uri: string;
    mutable: boolean;
    updateAuthority: string;
}

export interface TransferFee {
    pct: number;
    maxAmount: number;
    authority: string;
}

export interface Verification {
    mint: string;
    payer: string;
    name: string;
    symbol: string;
    description: string;
    jup_verified: boolean;
    links: any[];
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toRugcheckResponse(json: string): RugcheckResponse {
        return cast(JSON.parse(json), r("RugcheckResponse"));
    }

    public static rugcheckResponseToJson(value: RugcheckResponse): string {
        return JSON.stringify(uncast(value, r("RugcheckResponse")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ""): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : "";
    const keyText = key ? ` for key "${key}"` : "";
    throw Error(
        `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${
            JSON.stringify(val)
        }`,
    );
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${
                typ.map((a) => {
                    return prettyTypeName(a);
                }).join(", ")
            }]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(
    val: any,
    typ: any,
    getProps: any,
    key: any = "",
    parent: any = "",
): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(
            cases.map((a) => {
                return l(a);
            }),
            val,
            key,
            parent,
        );
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) {
            return invalidValue(l("array"), val, key, parent);
        }
        return val.map((el) => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(
        props: { [k: string]: any },
        additional: any,
        val: any,
    ): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach((key) => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key)
                ? val[key]
                : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(
                    val[key],
                    additional,
                    getProps,
                    key,
                    ref,
                );
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers")
            ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")
            ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")
            ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "RugcheckResponse": o([
        { json: "mint", js: "mint", typ: "" },
        { json: "tokenProgram", js: "tokenProgram", typ: "" },
        { json: "creator", js: "creator", typ: null },
        { json: "token", js: "token", typ: r("Token") },
        { json: "token_extensions", js: "token_extensions", typ: null },
        { json: "tokenMeta", js: "tokenMeta", typ: r("TokenMeta") },
        { json: "topHolders", js: "topHolders", typ: a(r("Holder")) },
        { json: "freezeAuthority", js: "freezeAuthority", typ: null },
        { json: "mintAuthority", js: "mintAuthority", typ: null },
        { json: "risks", js: "risks", typ: a("any") },
        { json: "score", js: "score", typ: 0 },
        { json: "fileMeta", js: "fileMeta", typ: r("FileMeta") },
        { json: "lockerOwners", js: "lockerOwners", typ: r("Lockerers") },
        { json: "lockers", js: "lockers", typ: r("Lockerers") },
        { json: "lpLockers", js: "lpLockers", typ: null },
        { json: "markets", js: "markets", typ: a(r("Market")) },
        { json: "totalMarketLiquidity", js: "totalMarketLiquidity", typ: 3.14 },
        { json: "totalLPProviders", js: "totalLPProviders", typ: 0 },
        { json: "rugged", js: "rugged", typ: true },
        { json: "tokenType", js: "tokenType", typ: "" },
        { json: "transferFee", js: "transferFee", typ: r("TransferFee") },
        {
            json: "knownAccounts",
            js: "knownAccounts",
            typ: m(r("KnownAccount")),
        },
        { json: "events", js: "events", typ: a("any") },
        { json: "verification", js: "verification", typ: r("Verification") },
        { json: "detectedAt", js: "detectedAt", typ: Date },
    ], false),
    "FileMeta": o([
        { json: "description", js: "description", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "symbol", js: "symbol", typ: "" },
        { json: "image", js: "image", typ: "" },
    ], false),
    "KnownAccount": o([
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: "" },
    ], false),
    "Lockerers": o([], false),
    "Market": o([
        { json: "pubkey", js: "pubkey", typ: "" },
        { json: "marketType", js: "marketType", typ: "" },
        { json: "mintA", js: "mintA", typ: "" },
        { json: "mintB", js: "mintB", typ: "" },
        { json: "mintLP", js: "mintLP", typ: "" },
        { json: "liquidityA", js: "liquidityA", typ: "" },
        { json: "liquidityB", js: "liquidityB", typ: "" },
        { json: "mintAAccount", js: "mintAAccount", typ: r("Token") },
        { json: "mintBAccount", js: "mintBAccount", typ: r("Token") },
        { json: "mintLPAccount", js: "mintLPAccount", typ: r("Token") },
        {
            json: "liquidityAAccount",
            js: "liquidityAAccount",
            typ: r("LiquidityAccount"),
        },
        {
            json: "liquidityBAccount",
            js: "liquidityBAccount",
            typ: r("LiquidityAccount"),
        },
        { json: "lp", js: "lp", typ: r("Lp") },
    ], false),
    "LiquidityAccount": o([
        { json: "mint", js: "mint", typ: "" },
        { json: "owner", js: "owner", typ: "" },
        { json: "amount", js: "amount", typ: 0 },
        { json: "delegate", js: "delegate", typ: null },
        { json: "state", js: "state", typ: 0 },
        { json: "delegatedAmount", js: "delegatedAmount", typ: 0 },
        { json: "closeAuthority", js: "closeAuthority", typ: null },
    ], false),
    "Lp": o([
        { json: "baseMint", js: "baseMint", typ: "" },
        { json: "quoteMint", js: "quoteMint", typ: "" },
        { json: "lpMint", js: "lpMint", typ: "" },
        { json: "quotePrice", js: "quotePrice", typ: 3.14 },
        { json: "basePrice", js: "basePrice", typ: 3.14 },
        { json: "base", js: "base", typ: 3.14 },
        { json: "quote", js: "quote", typ: 3.14 },
        { json: "reserveSupply", js: "reserveSupply", typ: 0 },
        { json: "currentSupply", js: "currentSupply", typ: 0 },
        { json: "quoteUSD", js: "quoteUSD", typ: 3.14 },
        { json: "baseUSD", js: "baseUSD", typ: 3.14 },
        { json: "pctReserve", js: "pctReserve", typ: 0 },
        { json: "pctSupply", js: "pctSupply", typ: 0 },
        { json: "holders", js: "holders", typ: u(a(r("Holder")), null) },
        { json: "totalTokensUnlocked", js: "totalTokensUnlocked", typ: 0 },
        { json: "tokenSupply", js: "tokenSupply", typ: 0 },
        { json: "lpLocked", js: "lpLocked", typ: 0 },
        { json: "lpUnlocked", js: "lpUnlocked", typ: 0 },
        { json: "lpLockedPct", js: "lpLockedPct", typ: 3.14 },
        { json: "lpLockedUSD", js: "lpLockedUSD", typ: 3.14 },
        { json: "lpMaxSupply", js: "lpMaxSupply", typ: 0 },
        { json: "lpCurrentSupply", js: "lpCurrentSupply", typ: 0 },
        { json: "lpTotalSupply", js: "lpTotalSupply", typ: 0 },
    ], false),
    "Holder": o([
        { json: "address", js: "address", typ: "" },
        { json: "amount", js: "amount", typ: 0 },
        { json: "decimals", js: "decimals", typ: 0 },
        { json: "pct", js: "pct", typ: 3.14 },
        { json: "uiAmount", js: "uiAmount", typ: 3.14 },
        { json: "uiAmountString", js: "uiAmountString", typ: "" },
        { json: "owner", js: "owner", typ: "" },
        { json: "insider", js: "insider", typ: true },
    ], false),
    "Token": o([
        { json: "mintAuthority", js: "mintAuthority", typ: u(null, "") },
        { json: "supply", js: "supply", typ: 3.14 },
        { json: "decimals", js: "decimals", typ: 0 },
        { json: "isInitialized", js: "isInitialized", typ: true },
        { json: "freezeAuthority", js: "freezeAuthority", typ: null },
    ], false),
    "TokenMeta": o([
        { json: "name", js: "name", typ: "" },
        { json: "symbol", js: "symbol", typ: "" },
        { json: "uri", js: "uri", typ: "" },
        { json: "mutable", js: "mutable", typ: true },
        { json: "updateAuthority", js: "updateAuthority", typ: "" },
    ], false),
    "TransferFee": o([
        { json: "pct", js: "pct", typ: 0 },
        { json: "maxAmount", js: "maxAmount", typ: 0 },
        { json: "authority", js: "authority", typ: "" },
    ], false),
    "Verification": o([
        { json: "mint", js: "mint", typ: "" },
        { json: "payer", js: "payer", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "symbol", js: "symbol", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "jup_verified", js: "jup_verified", typ: true },
        { json: "links", js: "links", typ: a("any") },
    ], false),
};

export interface Risk {
    name: string;
    value: string;
    description: string;
    score: number;
    level: "warn" | "error" | "info";
}
