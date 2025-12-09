import { cn } from "@/lib/utils";
import type { FooterContent } from "@/lib/cms";

interface FooterSectionProps {
  content: FooterContent;
  className?: string;
}

export function FooterSection({ content, className }: FooterSectionProps) {
  return (
    <footer className={cn("py-8 px-4 border-t", className)}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">{content.copyrightText}</p>
        <nav className="flex gap-6">
          {content.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.text}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
