import { ScreenerCard } from "@/components/ScreenerCard";

export default async function Page({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  return (
    <div className="flex flex-col gap-10 max-w-screen-md mx-auto my-10">
      <nav className="flex gap-3 items-center">
        <img src="/logo.svg" alt="Sova" className="w-12 h-12" />
        <span className="text-2xl font-semibold">Sova</span>
      </nav>

      <div className="flex w-full gap-14">
        <div className="flex-1 flex flex-col gap-4">
          <span className="text-xl font-semibold">screeners</span>
          <ScreenerCard
            title="Solscan"
            description="View on Solscan"
            image="/logos/solscan.svg"
            link={`https://solscan.io/address/${address}`}
          />

          <ScreenerCard
            title="GmGn"
            description="View on GmGn"
            image="/logos/gmgnai.svg"
            link={`https://gmgn.ai/sol/token/${address}`}
          />

          <ScreenerCard
            title="Photon"
            description="View on Photon"
            image="/logos/photon.svg"
            link={`https://photon-sol.tinyastro.io/en/lp/${address}`}
          />

          <ScreenerCard
            title="Dexscreener"
            description="View on Dexscreener"
            image="/logos/dexscreener.svg"
            link={`https://dexscreener.com/solana/${address}`}
          />

          <ScreenerCard
            title="Birdeye"
            description="View on Birdeye"
            image="/logos/birdeye.png"
            link={`https://birdeye.so/solana/token/${address}`}
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <span className="text-xl font-semibold">trade</span>

          <ScreenerCard
            title="Jupiter"
            description="Trade with Jupiter"
            image="/logos/jupiter.svg"
            link={`https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=${address}`}
          />

          <ScreenerCard
            title="Raydium"
            description="Trade with Raydium"
            image="/logos/raydium.svg"
            link={`https://raydium.io/swap?inputMint=sol&outputMint=${address}`}
          />
        </div>
      </div>
    </div>
  );
}
