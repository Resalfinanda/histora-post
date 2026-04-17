// components/navbar/NavMenu.tsx
import { NavItem } from "./navItem"

interface NavMenuProps {
  items: {
    label: string
    href: string
  }[]
}

export function NavMenu({ items }: NavMenuProps) {
  return (
    <nav className="hidden md:flex items-center gap-6">
      {items.map((item, i) => (
        <NavItem key={i} {...item} />
      ))}
    </nav>
  )
}