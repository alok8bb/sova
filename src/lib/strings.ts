export const NEWS_API_ROUTE =
    `https://cryptopanic.com/api/free/v1/posts/?auth_token=${process.env.NEXT_PUBLIC_CRYPTO_PANIC_API_KEY}&currencies=SOL&kind=news&filter=rising`;
export const SOL_STATUS_API = "https://status.solana.com/api/v2/status.json";
export const BINANCE_PRICE_API =
    "https://fapi.binance.com/fapi/v1/ticker/price?symbol=solusdt";
export const DEXS_TOKEN_API = `https://api.dexscreener.com/latest/dex/tokens/`;
export const CHART_SRC = (pairAddress: string) => {
    return `https://www.dextools.io/widget-chart/en/solana/pe-light/${pairAddress}?theme=dark&chartType=3&chartResolution=5&drawingToolbars=false&chartType=1`;
};
export const RUGCHECK_REPORT_URL = (address: string) => {
    return `https://api.rugcheck.xyz/v1/tokens/${address}/report`;
};
export const MAINNET_BETA_RPC = "https://api.mainnet-beta.solana.com";
