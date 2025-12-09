import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CtaContent } from "@/lib/cms";

interface CtaSectionProps {
  content: CtaContent;
  className?: string;
}

export function CtaSection({ content, className }: CtaSectionProps) {
  return (
    <section
      className={cn("py-20 px-4 bg-primary text-primary-foreground", className)}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{content.headline}</h2>
        <p className="text-xl mb-8 opacity-90">{content.description}</p>
        <Button size="lg" variant="secondary">
          {content.buttonText}
        </Button>
      </div>
    </section>
  );
}
