import { useEffect, useState } from 'react'
import { FiSave, FiX } from 'react-icons/fi'
import { EVENT_CATEGORY_LABELS, EVENT_STATUS_LABELS } from '../../utils/eventDisplay'

const categoryOptions = Object.entries(EVENT_CATEGORY_LABELS).map(([value, label]) => ({ label, value }))
const statusOptions = Object.entries(EVENT_STATUS_LABELS).map(([value, label]) => ({ label, value }))

const inputClass = 'w-full rounded-lg border border-[#3d4a40] bg-[#0e1510] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#869488] focus:border-[#59de92] focus:ring-2 focus:ring-[#59de92]/20'
const labelClass = 'text-xs font-bold uppercase tracking-wider text-[#869488]'

function toDatetimeLocal(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 16)
}

function toApiDatetime(value) {
  return value ? `${value.replace('T', ' ')}:00` : ''
}

function makeInitialForm(event) {
  return {
    banner_url: event?.banner_url || '',
    category: event?.category || '',
    description: event?.description || '',
    ends_at: toDatetimeLocal(event?.ends_at),
    is_featured: Boolean(event?.is_featured),
    is_special: Boolean(event?.is_special),
    name: event?.name || '',
    sort_order: event?.sort_order ?? 0,
    starts_at: toDatetimeLocal(event?.starts_at),
    status: event?.status || 'pending',
    thumbnail_url: event?.thumbnail_url || '',
    ticket_sale_ends_at: toDatetimeLocal(event?.ticket_sale_ends_at),
    ticket_sale_starts_at: toDatetimeLocal(event?.ticket_sale_starts_at),
    venue: event?.venue || '',
  }
}

function buildPayload(form) {
  const payload = {
    banner_url: form.banner_url,
    category: form.category,
    description: form.description,
    is_featured: form.is_featured,
    is_special: form.is_special,
    name: form.name,
    sort_order: Number(form.sort_order || 0),
    status: form.status,
    thumbnail_url: form.thumbnail_url,
    venue: form.venue,
  }

  if (form.starts_at) payload.starts_at = toApiDatetime(form.starts_at)
  if (form.ends_at) payload.ends_at = toApiDatetime(form.ends_at)
  if (form.ticket_sale_starts_at) payload.ticket_sale_starts_at = toApiDatetime(form.ticket_sale_starts_at)
  if (form.ticket_sale_ends_at) payload.ticket_sale_ends_at = toApiDatetime(form.ticket_sale_ends_at)

  return payload
}

function FormField({ children, className = '', label }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  )
}

function ToggleField({ checked, label, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-[#3d4a40] bg-[#0e1510] px-4 py-3">
      <input
        checked={checked}
        className="h-4 w-4 accent-[#59de92]"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span className="text-sm font-bold text-[#dde5dc]">{label}</span>
    </label>
  )
}

function AdminEventEditModal({ error, event, isSaving, onClose, onSubmit }) {
  const [form, setForm] = useState(() => makeInitialForm(event))

  useEffect(() => {
    setForm(makeInitialForm(event))
  }, [event])

  if (!event) return null

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault()
    onSubmit(event.id, buildPayload(form))
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto flex max-h-[calc(100vh-3rem)] max-w-5xl flex-col overflow-hidden rounded-xl border border-[#3d4a40] bg-[#1a211c] shadow-2xl shadow-black/50">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#3d4a40] bg-[#1a211c] p-5">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-[#59de92]">Cập nhật sự kiện</p>
            <h2 className="mt-1 truncate text-2xl font-black text-white">{event.name}</h2>
          </div>
          <button
            aria-label="Đóng"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#3d4a40] text-[#bccabd] transition hover:border-[#59de92] hover:text-white"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            <FiX />
          </button>
        </div>

        <form className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <FormField className="md:col-span-2" label="Tên sự kiện">
              <input
                className={inputClass}
                onChange={(inputEvent) => updateField('name', inputEvent.target.value)}
                required
                value={form.name}
              />
            </FormField>

            <FormField label="Danh mục">
              <select
                className={inputClass}
                onChange={(inputEvent) => updateField('category', inputEvent.target.value)}
                required
                value={form.category}
              >
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Trạng thái duyệt">
              <select
                className={inputClass}
                onChange={(inputEvent) => updateField('status', inputEvent.target.value)}
                value={form.status}
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </FormField>

            <FormField className="md:col-span-2" label="Mô tả">
              <textarea
                className={`${inputClass} min-h-32 resize-y leading-6`}
                onChange={(inputEvent) => updateField('description', inputEvent.target.value)}
                value={form.description}
              />
            </FormField>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Thumbnail URL">
              <input
                className={inputClass}
                onChange={(inputEvent) => updateField('thumbnail_url', inputEvent.target.value)}
                value={form.thumbnail_url}
              />
            </FormField>

            <FormField label="Banner URL">
              <input
                className={inputClass}
                onChange={(inputEvent) => updateField('banner_url', inputEvent.target.value)}
                value={form.banner_url}
              />
            </FormField>

            <FormField className="md:col-span-2" label="Địa điểm">
              <input
                className={inputClass}
                onChange={(inputEvent) => updateField('venue', inputEvent.target.value)}
                value={form.venue}
              />
            </FormField>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Bắt đầu sự kiện">
              <input
                className={`${inputClass} scheme-dark`}
                onChange={(inputEvent) => updateField('starts_at', inputEvent.target.value)}
                type="datetime-local"
                value={form.starts_at}
              />
            </FormField>

            <FormField label="Kết thúc sự kiện">
              <input
                className={`${inputClass} scheme-dark`}
                onChange={(inputEvent) => updateField('ends_at', inputEvent.target.value)}
                type="datetime-local"
                value={form.ends_at}
              />
            </FormField>

            <FormField label="Mở bán vé">
              <input
                className={`${inputClass} scheme-dark`}
                onChange={(inputEvent) => updateField('ticket_sale_starts_at', inputEvent.target.value)}
                type="datetime-local"
                value={form.ticket_sale_starts_at}
              />
            </FormField>

            <FormField label="Đóng bán vé">
              <input
                className={`${inputClass} scheme-dark`}
                onChange={(inputEvent) => updateField('ticket_sale_ends_at', inputEvent.target.value)}
                type="datetime-local"
                value={form.ticket_sale_ends_at}
              />
            </FormField>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_1fr_160px]">
            <ToggleField checked={form.is_featured} label="Featured" onChange={(value) => updateField('is_featured', value)} />
            <ToggleField checked={form.is_special} label="Special" onChange={(value) => updateField('is_special', value)} />
            <FormField label="Thứ tự hiển thị">
              <input
                className={inputClass}
                min="0"
                onChange={(inputEvent) => updateField('sort_order', inputEvent.target.value)}
                type="number"
                value={form.sort_order}
              />
              <span className="text-xs leading-5 text-[#869488]">
                Dùng để sắp xếp thủ công trên trang chính và danh sách public. Số nhỏ hơn sẽ hiển thị trước trong cùng nhóm featured hoặc không featured.
              </span>
            </FormField>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#3d4a40] pt-5 sm:flex-row sm:justify-end">
            <button
              className="inline-flex items-center justify-center rounded-full border border-[#3d4a40] px-5 py-3 text-sm font-bold text-[#bccabd] transition hover:border-[#59de92] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#59de92] px-5 py-3 text-sm font-bold text-[#00391e] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              <FiSave />
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminEventEditModal
