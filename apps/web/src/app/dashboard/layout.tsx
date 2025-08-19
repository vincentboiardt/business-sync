import { Header } from '~/components/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-foreground">
      <Header />
      {children}
    </div>
  )
}
