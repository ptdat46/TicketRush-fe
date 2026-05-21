function AdminStatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-[#869488]">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  )
}

export default AdminStatCard
