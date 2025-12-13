import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BenefitsSectionProps {
  messaging: {
    audience: string;
    mainBenefit: string;
    mainPromise: string;
    toneOfVoice: string;
    keyObjections: string[];
    pricePosition: string;
  };
  className?: string;
}

export function BenefitsSection({ messaging, className }: BenefitsSectionProps) {
  const benefits = [
    messaging.mainPromise,
    `Designed for ${messaging.audience.toLowerCase()}`,
    `${messaging.pricePosition} at its finest`,
    messaging.mainBenefit,
  ];

  return (
    <section className={cn("py-16 px-4 bg-muted/50", className)}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <ul className="space-y-4">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckCircle className="size-6 text-green-500 shrink-0" />
              <span className="text-lg">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
