import Header from '../Header'

function AdminShell({ children }) {
  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <Header />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default AdminShell
