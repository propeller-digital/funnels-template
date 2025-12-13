import { cn } from "@/lib/utils";

interface FooterSectionProps {
  pageTitle: string;
  className?: string;
}

export function FooterSection({ pageTitle, className }: FooterSectionProps) {
  const productName = pageTitle.split(" - ")[0];
  const currentYear = new Date().getFullYear();

  const links = [
    { text: "Privacy Policy", url: "/privacy" },
    { text: "Terms of Service", url: "/terms" },
    { text: "Contact", url: "/contact" },
  ];

  return (
    <footer className={cn("py-8 px-4 border-t", className)}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} {productName}. All rights reserved.
        </p>
        <nav className="flex gap-6">
          {links.map((link, index) => (
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
