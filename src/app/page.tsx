"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen p-8 absolute inset-0 h-full w-full">
      <div className="flex items-center flex-col gap-3">
        <img src="/logo.svg" alt="Sova" className="w-40 h-40" />
        <h1 className="font-semibold text-2xl">Sova Screener</h1>
        <p>essential crypto utilities in one place</p>
      </div>
    </div>
  );
}
