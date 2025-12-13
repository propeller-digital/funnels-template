"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FeaturesSectionProps {
  content: {
    headline: string;
    items: Array<{
      title: string;
      text: string;
      image: { alt: string; url: string };
    }>;
  };
  className?: string;
}

export function FeaturesSection({ content, className }: FeaturesSectionProps) {
  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{content.headline}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.items.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                {feature.image?.url && (
                  <div className="relative w-full h-32 mb-2 rounded-md overflow-hidden">
                    <Image
                      src={feature.image.url}
                      alt={feature.image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
