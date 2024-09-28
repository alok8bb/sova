import { ArrowLeftRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
// @ts-expect-error - module doesn't have types
import b58 from "b58";

export default function KeyConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"hashToArray" | "arrayToHash">(
    "hashToArray"
  );

  const toggleDirection = () => {
    setDirection((prev) =>
      prev === "hashToArray" ? "arrayToHash" : "hashToArray"
    );
    setInput("");
    setOutput("");
  };

  const convert = () => {
    try {
      if (direction === "hashToArray") {
        const decoded = b58.decode(input);
        setOutput(JSON.stringify(Array.from(decoded)));
      } else {
        let array;
        if (input.trim().startsWith("[") && input.trim().endsWith("]")) {
          array = JSON.parse(input);
        } else {
          array = input.split(",").map((num) => parseInt(num.trim(), 10));
        }
        const uint8Array = new Uint8Array(array);
        const encoded = b58.encode(uint8Array);
        setOutput(encoded);
      }
    } catch (error) {
      setOutput("Error: Invalid input");
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Solana Key Converter (B58 Array ↔ Hash)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label
                htmlFor="input"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                {direction === "hashToArray"
                  ? "Base58 Encoded Key"
                  : "Byte Array"}
              </label>
              <textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  direction === "hashToArray"
                    ? "Enter Base58 encoded key..."
                    : "Enter byte array (e.g., [1, 2, 3] or 1, 2, 3)"
                }
                className="w-full h-40 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={toggleDirection}
              variant="outline"
              className="px-4 py-6 self-center"
            >
              <ArrowLeftRight className="h-6 w-6" />
            </Button>
            <div className="flex-1">
              <label
                htmlFor="output"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                {direction === "hashToArray"
                  ? "Converted Byte Array"
                  : "Base58 Encoded Key"}
              </label>
              <textarea
                id="output"
                value={output}
                readOnly
                placeholder="Conversion result will appear here..."
                className="w-full h-40 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Button onClick={convert} className="w-full h-12 text-lg">
            Convert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
