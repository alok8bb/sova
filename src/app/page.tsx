"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen p-8 absolute inset-0 h-full w-full bg-black bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_90%_90%_at_50%_50%,#000_0%,transparent_100%)]">
      <div className="flex items-center flex-col gap-3">
        <h1 className="text-4xl font-bold text-solana-green uppercase tracking-wider text-center">
          Solaris Board
        </h1>
        <p className="italic">solana essentials, streamlined</p>
        <div className="flex gap-2">
          <Button
            className="hover:bg-solana-green hover:text-black"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </Button>
          <Button
            className="hover:bg-solana-green hover:text-black"
            onClick={() =>
              window.open("https://github.com/alok8bb/solaris-board")
            }
          >
            GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
