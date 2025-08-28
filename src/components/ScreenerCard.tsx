import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card } from "./ui/card";

export interface ScreenerCardProps {
    title: string;
    description: string;
    image: string;
    link: string;
  }
  
  export const ScreenerCard = ({
    title,
    description,
    image,
    link,
  }: ScreenerCardProps) => {
    return (
      <Link href={link} target="_blank">
        <Card className="flex p-4 bg-[hsl(0,0%,7%)] hover:bg-[hsl(0,0%,12%)] transition cursor-pointer transform hover:scale-105 duration-300">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src={image} alt={title} className="w-5 h-5" />
              <span className="text-md">{title}</span>
            </div>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <ArrowUpRight className="w-4 h-4 ml-auto" />
        </Card>
      </Link>
    );
  };
  