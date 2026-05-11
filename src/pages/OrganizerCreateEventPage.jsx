import Header from '../components/Header'

function OrganizerCreateEventPage() {
  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white">Tạo sự kiện</h1>
        <p className="mt-3 text-[#bccabd]">Khu vực tạo sự kiện dành cho nhà tổ chức.</p>
      </main>
    </div>
  )
}

export default OrganizerCreateEventPage
