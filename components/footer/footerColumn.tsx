// components/footer/FooterColumn.tsx

interface FooterColumnProps {
  title?: string
  children: React.ReactNode,
  classname?: string
}

export function FooterColumn({ title, children,classname }: FooterColumnProps) {
  return (
    <div className={`flex flex-col gap-3 ${classname}`}>
      {title && (
        <h3 className="text-sm font-bold uppercase tracking-wide">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}