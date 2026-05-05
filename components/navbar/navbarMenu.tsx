import { NavItem } from "./navItem"

interface NavMenuProps {
  items: {
    label: string
    href: string
  }[]
}

export function NavMenu({ items }: NavMenuProps) {
  return (
    <div className="w-full border-t border-white/20">
      {/* Container dengan scroll horizontal dan hide scrollbar */}
      <nav className="container mx-auto flex items-center justify-start lg:justify-center gap-6 px-4 py-3 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] no-scrollbar">
        {items.map((item, i) => (
          <NavItem key={i} {...item} />
        ))}
      </nav>
    </div>
  )
}