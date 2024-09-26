"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, Video, FileText, Link, Search, Lightbulb } from "lucide-react";
import { LearningResources, ResourceCategory } from "@/lib/data";

// resources taken from awesome-solana and other sources
const categories: string[] = [
  "All Categories",
  ...Array.from(
    new Set(LearningResources.map((resource) => resource.category))
  ),
];

export default function ImprovedLearningResourcesDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");

  const filteredResources = LearningResources.filter(
    (resource) =>
      (resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "All Categories" ||
        resource.category === selectedCategory)
  );

  const getIcon = (category: ResourceCategory) => {
    switch (category) {
      case "Resource":
        return <FileText className="h-5 w-5" />;
      case "Project Ideas":
        return <Lightbulb className="h-5 w-5" />;
      case "Videos":
        return <Video className="h-5 w-5" />;
      case "Course":
        return <Book className="h-5 w-5" />;
      default:
        return <Link className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Learn Solana</h1>
        <p className="text-muted-foreground">
          Explore our curated list of learning materials to enhance your skills.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No resources found. Try adjusting your search or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{resource.category}</Badge>
                  <div className="p-2 bg-secondary rounded-full">
                    {getIcon(resource.category)}
                  </div>
                </div>
                <CardTitle className="mt-4">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{resource.description}</p>
              </CardContent>
              <CardFooter>
                <a
                  href={resource.link}
                  className="text-primary hover:underline w-full text-center py-2 bg-primary/10 rounded-md transition-colors hover:bg-primary/20"
                  aria-label={`View ${resource.title}`}
                  target="_blank"
                >
                  View Resource
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
