type TokenInfo = {
    imageUrl: string;
    websites: Array<{
        label: string;
        url: string;
    }>;
    socials: Array<{
        type: string;
        url: string;
    }>;
};

type Token = {
    address: string;
    name: string;
    symbol: string;
};

type Transaction = {
    buys: number;
    sells: number;
};

type Txns = {
    m5: Transaction;
    h1: Transaction;
    h6: Transaction;
    h24: Transaction;
};

type Volume = {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
};

type PriceChange = {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
};

type Liquidity = {
    usd: number;
    base: number;
    quote: number;
};

export type Pair = {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    labels?: string[];
    baseToken: Token;
    quoteToken: Token;
    priceNative: string;
    priceUsd: string;
    txns: Txns;
    volume: Volume;
    priceChange: PriceChange;
    liquidity: Liquidity;
    fdv: number;
    marketCap: number;
    pairCreatedAt: number;
    info: TokenInfo;
};

export type TokenApiResponse = {
    schemaVersion: string;
    pairs: Pair[];
};

export const getFilteredPair = (
    response: TokenApiResponse,
): Pair | undefined => {
    try {
        return response.pairs
            .filter((pair) =>
                pair.chainId === "solana" && pair.dexId === "raydium"
            )
            .shift();
    } catch (e) {
        throw Error("Couldn't find the pair");
    }
};
