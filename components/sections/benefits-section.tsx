import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BenefitsContent } from "@/lib/cms";

interface BenefitsSectionProps {
  content: BenefitsContent;
  className?: string;
}

export function BenefitsSection({ content, className }: BenefitsSectionProps) {
  return (
    <section className={cn("py-16 px-4 bg-muted/50", className)}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{content.title}</h2>
        <ul className="space-y-4">
          {content.items.map((benefit, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckCircle className="size-6 text-green-500 shrink-0" />
              <span className="text-lg">{benefit.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
