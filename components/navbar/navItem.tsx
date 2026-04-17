// components/navbar/NavItem.tsx
import Link from "next/link"

interface NavItemProps {
  label: string
  href: string
}

export function NavItem({ label, href }: NavItemProps) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-white/80 hover:text-yellow-400 transition-colors"
    >
      {label}
    </Link>
  )
}