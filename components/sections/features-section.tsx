"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { icons, Star, type LucideIcon } from "lucide-react";
import type { FeaturesContent } from "@/lib/cms";

interface FeaturesSectionProps {
  content: FeaturesContent;
  className?: string;
}

export function FeaturesSection({ content, className }: FeaturesSectionProps) {
  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{content.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.items.map((feature, index) => {
            const IconComponent: LucideIcon =
              icons[feature.icon as keyof typeof icons] || Star;
            return (
              <Card key={index}>
                <CardHeader>
                  <IconComponent className="size-8 mb-2 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
