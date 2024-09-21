import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (indicator: string) => {
  switch (indicator) {
    case "none":
      return "bg-solana-green";
    case "minor":
      return "bg-yellow-500";
    case "major":
      return "bg-orange-500";
    case "critical":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
