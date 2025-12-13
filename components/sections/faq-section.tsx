"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FaqSectionProps {
  content: {
    headline: string;
    items: Array<{
      title: string;
      text: string;
    }>;
  };
  className?: string;
}

export function FaqSection({ content, className }: FaqSectionProps) {
  return (
    <section className={cn("py-16 px-4 bg-muted/50", className)}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{content.headline}</h2>
        <Accordion type="single" collapsible className="w-full">
          {content.items.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.title}</AccordionTrigger>
              <AccordionContent>{faq.text}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
