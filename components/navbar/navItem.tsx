// components/navbar/NavItem.tsx
import Link from "next/link";

interface NavItemProps {
  label: string;
  href: string;
}

export function NavItem({ label, href }: NavItemProps) {
  return (
    <Link href={href} className="text-sm font-medium text-background">
      {label}
    </Link>
  );
}
