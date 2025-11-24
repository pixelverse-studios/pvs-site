import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      {/* Sidebar - Desktop only */}
      <DashboardSidebar />

      {/* Main content area - Full width on mobile, left padding on desktop */}
      <div className="w-full lg:pl-72 transition-all duration-500">
        {children}
      </div>
    </div>
  )
}
