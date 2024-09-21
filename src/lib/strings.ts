export const NEWS_API_ROUTE =
    `https://cryptopanic.com/api/free/v1/posts/?auth_token=${process.env.NEXT_PUBLIC_CRYPTO_PANIC_API_KEY}&currencies=SOL&kind=news&filter=rising`;
export const SOL_STATUS_API = "https://status.solana.com/api/v2/status.json";
export const BINANCE_PRICE_API =
    "https://fapi.binance.com/fapi/v1/ticker/price?symbol=solusdt";
