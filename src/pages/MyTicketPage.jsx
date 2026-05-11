import Header from '../components/Header'

function MyTicketPage() {
  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white">Vé của tôi</h1>
        <p className="mt-3 text-[#bccabd]">Danh sách vé đã mua sẽ được hiển thị tại đây.</p>
      </main>
    </div>
  )
}

export default MyTicketPage
