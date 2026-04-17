// components/footer/FooterColumn.tsx

interface FooterColumnProps {
  title?: string
  children: React.ReactNode
}

export function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      {title && (
        <h3 className="text-sm font-semibold text-white hover:text-yellow-400 uppercase tracking-wide">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}