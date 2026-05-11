const footerLinks = ['Về chúng tôi', 'Trung tâm hỗ trợ', 'Điều khoản sử dụng', 'Chính sách bảo mật']

function Footer() {
  return (
    <footer className="mt-8 border-t border-zinc-800 bg-zinc-950 py-12 text-xs text-zinc-500">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-12">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <span className="text-xl font-black text-zinc-200">TicketRush</span>
          <p>© 2024 TicketRush. Năng lượng và Tốc độ trong tầm tay.</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <a className="underline-offset-4 transition-colors hover:text-[#20b36c] hover:underline" href="#" key={link}>
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
