import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TestimonialsSectionProps {
  content: {
    headline: string;
    body?: string;
    items: Array<{
      title: string;
      text: string;
      image: { alt: string; url: string };
    }>;
  };
  className?: string;
}

export function TestimonialsSection({
  content,
  className,
}: TestimonialsSectionProps) {
  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{content.headline}</h2>
        {content.body && (
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            {content.body}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.items.map((testimonial, index) => {
            // Extract name from title like "Endorsement from John Doe, Pro Snowboarder"
            const nameMatch = testimonial.title.match(/from\s+([^,]+)/i);
            const name = nameMatch ? nameMatch[1].trim() : testimonial.title;

            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={testimonial.image.url} />
                      <AvatarFallback>
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{name}</span>
                  </div>
                  <p className="text-muted-foreground italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
