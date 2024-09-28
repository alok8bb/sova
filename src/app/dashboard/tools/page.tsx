"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KeyConverter from "@/components/key-converter";

export default function ToolsPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <KeyConverter />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Vanity Address Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Coming soon...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Other Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">More tools coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
