function AdminPageHeader({ action, description, eyebrow = 'Admin', title }) {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#59de92]">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-[#bccabd]">{description}</p>}
      </div>

      {action}
    </section>
  )
}

export default AdminPageHeader
