"use client";

import { Card } from "@/components/ui/card";
import { Telescope } from "lucide-react";

export default function Component() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-6">
          <Telescope className="w-16 h-16 text-primary" />
          <h2 className="text-2xl font-semibold text-center text-foreground">
            Wallet Explorer
          </h2>
          <p className="text-center text-muted-foreground">
            Coming soon! Explore your wallet's transactions, balances, and more.
          </p>
        </div>
      </Card>
    </div>
  );
}
