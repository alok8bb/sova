import { NEWS_API_ROUTE } from "./strings";

type Currency = {
    code: string;
    title: string;
    slug: string;
    url: string;
};

type Source = {
    title: string;
    region: string;
    domain: string;
    path: string | null;
    type: string;
};

export type NewsItem = {
    title: string;
    source: Source;
    currencies: Currency[];
    url: string;
    created_at: string;
};

type ApiResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: NewsItem[];
};

export async function getNews(): Promise<NewsItem[]> {
    const response = await fetch(
        NEWS_API_ROUTE,
    );

    try {
        const data: ApiResponse = await response.json();
        const newsCount = Math.min(10, data.results.length);

        return data.results.slice(0, newsCount).map((item) => ({
            title: item.title,
            source: item.source,
            currencies: item.currencies,
            url: item.url,
            created_at: item.created_at,
        }));
    } catch (e) {
        throw Error("Couldn't fetch news");
    }
}
