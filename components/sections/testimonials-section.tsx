import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { TestimonialsContent } from "@/lib/cms";

interface TestimonialsSectionProps {
  content: TestimonialsContent;
  className?: string;
}

export function TestimonialsSection({
  content,
  className,
}: TestimonialsSectionProps) {
  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{content.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.items.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatarUrl} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{testimonial.name}</span>
                </div>
                <p className="text-muted-foreground italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
