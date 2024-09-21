"use client";

import { Risk, RugcheckResponse } from "@/components/rugcheck.types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CHART_SRC,
  DEXS_TOKEN_API,
  MAINNET_BETA_RPC,
  RUGCHECK_REPORT_URL,
} from "@/lib/strings";
import { getFilteredPair, Pair, TokenApiResponse } from "@/lib/token.api";
import { init } from "@jup-ag/terminal";
import "@jup-ag/terminal/css";
import {
  AlertTriangle,
  CheckCircle,
  Ghost,
  XCircle,
  Clipboard,
} from "lucide-react";
import { useEffect, useState } from "react";

const fetchTokenData = async (address: string): Promise<RugcheckResponse> => {
  try {
    const response = await fetch(RUGCHECK_REPORT_URL(address));
    const data: RugcheckResponse = await response.json();
    console.log(data);

    return data;
  } catch (e) {
    throw Error("Couldn't fetch rugcheck data");
  }
};

export default function TradePage() {
  const [address, setAddress] = useState<string>("");
  const [pairAddress, setPairAddress] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<RugcheckResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pair, setPair] = useState<Pair | null>(null);

  // idk some ssr issue `document not found`
  useEffect(() => {
    init({
      displayMode: "integrated",
      integratedTargetId: "integrated-terminal",
      endpoint: MAINNET_BETA_RPC,
    });
  }, []);

  const handleCheck = async (): Promise<void> => {
    const response = await fetch(DEXS_TOKEN_API + address);
    const data: TokenApiResponse = await response.json();
    try {
      const pair = getFilteredPair(data);
      if (!pair) {
        console.log("pair not found");
      } else {
        setPairAddress(pair.pairAddress);
        setPair(pair);
      }
    } catch (e) {
      console.log("Couldn't find the pair");
    }

    setLoading(true);
    try {
      const data: RugcheckResponse = await fetchTokenData(address);
      setTokenData(data);
    } catch (error) {
      console.error("Error fetching token data:", error);
    }
    setLoading(false);
    setAddress("");
  };

  return (
    <div className="h-full w-full p-4 flex flex-col lg:flex-row gap-4">
      <Card className="flex-1 lg:min-w-[200px] lg:max-w-sm min-h-[700]">
        <CardHeader>
          <CardTitle>Token Check</CardTitle>
          <CardDescription>
            Enter a token address to check its details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Enter token address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button onClick={handleCheck} disabled={loading}>
              {loading ? "Checking..." : "Check"}
            </Button>
          </div>
          <div className="overflow-y-auto">
            {tokenData ? (
              <div className="space-y-4 w-full">
                <div className="flex flex-row justify-between">
                  <div>
                    <h3 className="font-semibold">Symbol:</h3>
                    <p className="text-sm">{pair?.baseToken.symbol}</p>
                  </div>
                  <div className=" flex flex-row gap-2 ">
                    <Button
                      variant={"link"}
                      className="px-0 text-blue-500 hover:text-blue-400"
                      onClick={() =>
                        window.open(
                          `https://rugcheck.xyz/${pair?.baseToken.address}`,
                          "_blank"
                        )
                      }
                    >
                      Rugcheck
                    </Button>
                    <Button
                      variant={"link"}
                      className="px-0 text-blue-500 hover:text-blue-400"
                      onClick={() =>
                        window.open(
                          `https://photon-sol.tinyastro.io/en/lp//${pair?.baseToken.address}`,
                          "_blank"
                        )
                      }
                    >
                      Photon
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Token Address:</h3>
                  <div className="flex items-center">
                    <p className="text-sm truncate">
                      {pair?.baseToken.address}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          pair?.baseToken.address ?? ""
                        );
                      }}
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Pair Address:</h3>
                  <div className="flex items-center">
                    <p className="text-sm truncate ">{pair?.pairAddress}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(pair?.pairAddress ?? "");
                      }}
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="flex flex-row justify-between w-full">
                    <div className="w-1/2">
                      <h3 className="font-semibold">Liquidity:</h3>
                      <p className="text-sm">
                        $ {pair?.liquidity.usd.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-1/2">
                      <h3 className="font-semibold">FDV:</h3>
                      <p className="text-sm">$ {pair?.fdv.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex flex-row justify-between w-full">
                    <div className="w-1/2">
                      <h3 className="font-semibold">Freeze:</h3>
                      <p
                        className={`text-sm ${
                          tokenData.freezeAuthority
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {!tokenData.freezeAuthority ? "Disabled" : "Enabled"}
                      </p>
                    </div>
                    <div className="w-1/2">
                      <h3 className="font-semibold">Mint:</h3>
                      <p
                        className={`text-sm ${
                          tokenData.mintAuthority
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {tokenData.mintAuthority ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                </div>
                {tokenData.risks.length > 0 && (
                  <div>
                    <h3 className="font-semibold">Risks:</h3>
                    {tokenData.risks.map((risk, index) => (
                      <Alert key={index} className="mt-2">
                        <AlertTitle className="flex items-center space-x-2">
                          {getRiskIcon(risk.level)}
                          <span>{risk.name}</span>
                        </AlertTitle>
                        <AlertDescription>{risk.description}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 h-full flex flex-col items-center justify-center">
                <Ghost className="w-16 h-16 mb-4" />
                <p>
                  Enter a token address and click "Check" to view token details
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {tokenData && (
            <div className="w-full text-center">
              <p className="font-semibold">Rug Score: {tokenData.score}</p>
            </div>
          )}
        </CardFooter>
      </Card>

      <Card className="flex-[2] min-h-[700]">
        <CardContent className="p-0 h-full">
          {pairAddress ? (
            <iframe
              id="dextools-widget"
              sandbox="allow-scripts allow-same-origin allow-popups"
              title="DEXTools Trading Chart"
              className="w-full h-full"
              style={{ border: "none" }}
              src={CHART_SRC(pairAddress)}
            ></iframe>
          ) : (
            <div className="w-full min-h-[700px] flex items-center justify-center">
              <div className="flex flex-col justify-center items-center text-gray-400">
                <Ghost className="w-16 h-16" />
                <p>Please check a token to load the chart!</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex-1 lg:max-w-[700px]">
        <div
          id="integrated-terminal"
          className="w-full overflow-auto bg-[#282830] rounded-xl h-full"
        />
      </div>
    </div>
  );
}

const getRiskIcon = (level: Risk["level"]): React.ReactElement => {
  switch (level) {
    case "warn":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
};
