import { Link, Outlet } from 'react-router-dom'

const SettingsPage = () => {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 md:gap-8 ">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="." className="font-semibold text-primary">
            General
          </Link>
          <Link to="security">Security</Link>
          <Link to="advanced">Advanced</Link>
        </nav>
        <Outlet />
      </div>
    </main>
  )
}

export default SettingsPage
