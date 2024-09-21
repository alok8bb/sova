"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNews, NewsItem } from "@/lib/news.api";
import {
  Connection,
  EpochInfo,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  BarChart,
  DollarSign,
  Clock12,
  RefreshCcw,
  Shield,
} from "lucide-react";
import { useCallback, useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { BINANCE_PRICE_API, SOL_STATUS_API } from "@/lib/strings";
import { getStatusColor } from "@/lib/utils";

const TradingViewWidget = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
  {
    ssr: false,
  }
);

export default function DashboardHome() {
  const connection = useMemo(() => new Connection(clusterApiUrl("devnet")), []);

  const [epochInfo, setEpochInfo] = useState<EpochInfo>({
    epoch: 0,
    slotIndex: 0,
    slotsInEpoch: 0,
    absoluteSlot: 0,
    blockHeight: 0,
    transactionCount: 0,
  });

  const [networkStatus, setNetworkStatus] = useState({
    indicator: "none",
    description: "All Systems Operational",
  });
  const [solPrice, setSolPrice] = useState({ price: "", time: 0 });
  const [totalSupply, setTotalSupply] = useState(0);
  const [activeValidator, setActiveValidators] = useState(0);
  const [news, setNews] = useState<NewsItem[]>();

  const fetchData = useCallback(async () => {
    try {
      const [
        newEpochInfo,
        supply,
        voteAccounts,
        networkStatusResponse,
        solPriceResponse,
      ] = await Promise.all([
        connection.getEpochInfo(),
        connection.getSupply(),
        connection.getVoteAccounts(),
        fetch(SOL_STATUS_API),
        fetch(BINANCE_PRICE_API),
      ]);

      setTotalSupply(supply.value.total / LAMPORTS_PER_SOL);
      setEpochInfo(newEpochInfo);
      setActiveValidators(voteAccounts.current.length);

      const networkStatusData = await networkStatusResponse.json();
      setNetworkStatus(networkStatusData.status);

      const solPriceData = await solPriceResponse.json();
      setSolPrice({
        price: solPriceData.price,
        time: solPriceData.time,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [connection]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await getNews();
        setNews(newsData);
        console.log(newsData);
      } catch (e) {
        console.error("Couldn't fetch news", e);
      }
    };

    fetchNews();
  }, []);

  const memoizedTradingViewWidget = useMemo(
    () => (
      <TradingViewWidget
        hide_legend
        hide_side_toolbar
        details={false}
        hide_top_toolbar
        disabled_features={["create_volume_indicator_by_default"]}
        symbol="SOLUSD"
        show_popup_button={false}
        theme="dark"
        style="3"
        allow_symbol_change={false}
        autosize
      />
    ),
    []
  );

  return (
    <div>
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Block Height
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {epochInfo!.blockHeight?.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current block height
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Network Status
                </CardTitle>
                <div className="flex items-center space-x-1">
                  <div
                    className={`h-2 w-2 rounded-full ${getStatusColor(
                      networkStatus.indicator
                    )}`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {networkStatus.indicator === "none"
                      ? "Operational"
                      : networkStatus.description}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {networkStatus.indicator === "none" ? "100%" : "Degraded"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Uptime in last 30 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SOL Price</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${solPrice.price}</div>
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(solPrice.time).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
            <Card className="col-span-4">
              <div className="w-full h-full p-4">
                {memoizedTradingViewWidget}
              </div>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Latest News</CardTitle>
                <CardDescription>
                  Stay updated with Solana ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {news &&
                      news.map((item) => (
                        <div
                          key={item.url}
                          className="flex flex-col space-y-1 hover:cursor-pointer"
                          onClick={() => window.open(item.url, "_blank")}
                        >
                          <h3 className="font-medium leading-none">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.source.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </p>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Supply
                </CardTitle>
                <RefreshCcw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalSupply.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">SOL</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Validators
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeValidator.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Securing the network
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Epoch Progress
                </CardTitle>
                <Clock12 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    (epochInfo!.slotIndex / epochInfo!.slotsInEpoch) *
                    100
                  ).toFixed(2)}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Current epoch: {epochInfo?.epoch}
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
