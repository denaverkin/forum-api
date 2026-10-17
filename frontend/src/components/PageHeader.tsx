type PageHeaderProps = {
  title: string
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="page-header">
      <p className="page-eyebrow">Поради</p>
      <h1>{title}</h1>
      <p>Ідеї та поради .</p>
    </header>
  )
}