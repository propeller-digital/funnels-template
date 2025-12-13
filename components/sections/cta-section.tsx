import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CtaSectionProps {
  content: {
    headline: string;
    subheadline: string;
    ctas: Array<{ label: string; action: string; supportingText?: string }>;
  };
  className?: string;
}

export function CtaSection({ content, className }: CtaSectionProps) {
  const buttonText = content.ctas[0]?.label ?? "Get Started";

  return (
    <section
      className={cn("py-20 px-4 bg-primary text-primary-foreground", className)}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{content.headline}</h2>
        <p className="text-xl mb-8 opacity-90">{content.subheadline}</p>
        <Button size="lg" variant="secondary">
          {buttonText}
        </Button>
        {content.ctas[0]?.supportingText && (
          <p className="text-sm mt-2 opacity-80">{content.ctas[0].supportingText}</p>
        )}
      </div>
    </section>
  );
}
