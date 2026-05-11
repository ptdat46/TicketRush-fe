import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EventWizardFooter from '../components/organizer/EventWizardFooter'
import EventWizardSidebar from '../components/organizer/EventWizardSidebar'
import Step1BasicInfo from '../components/organizer/Step1BasicInfo'
import Step2Seating from '../components/organizer/Step2Seating'
import Step3Publish from '../components/organizer/Step3Publish'
import { api } from '../utils/api'

const STEPS = [
  { key: 'basic', stepNumber: 1, label: 'details' },
  { key: 'seating', stepNumber: 2, label: 'venue' },
  { key: 'publish', stepNumber: 3, label: 'marketing' },
]

const INITIAL_DATA = {
  name: '',
  description: '',
  category: '',
  thumbnail_url: '',
  banner_url: '',
  venue: '',
  starts_at: '',
  ends_at: '',
  ticket_sale_starts_at: '',
  ticket_sale_ends_at: '',
  display_type: 'rectangular',
  master_width: 6,
  master_length: 4,
  zones: [],
  bank_name: '',
  bank_account_number: '',
  bank_account_name: '',
}

function OrganizerCreateEventPage() {
  const navigate = useNavigate()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState(INITIAL_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const currentStep = STEPS[currentStepIndex]
  const totalSteps = STEPS.length

  const handleFieldChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((i) => i + 1)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i) => i - 1)
    }
  }

  const handleSidebarChange = (stepKey) => {
    const index = STEPS.findIndex((s) => s.label === stepKey)
    if (index !== -1) {
      setCurrentStepIndex(index)
    }
  }

  const canProceed = () => {
    switch (currentStepIndex) {
      case 0:
        return Boolean(data.name && data.category)
      case 1:
        return Boolean(data.venue && data.starts_at && data.ends_at)
      case 2:
        return Boolean(data.name && data.category && data.bank_name)
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        name: data.name,
        description: data.description,
        category: data.category,
        thumbnail_url: data.thumbnail_url,
        banner_url: data.banner_url,
        venue: data.venue,
        starts_at: data.starts_at,
        ends_at: data.ends_at,
        ticket_sale_starts_at: data.ticket_sale_starts_at,
        ticket_sale_ends_at: data.ticket_sale_ends_at,
        display_type: data.display_type,
        master_width: data.master_width,
        master_length: data.master_length,
        bank_name: data.bank_name,
        bank_account_number: data.bank_account_number,
        bank_account_name: data.bank_account_name,
      }

      const response = await api.post('/organizer/events', payload)

      if (!response.success) {
        setError(response.error || 'Khong the tao su kien.')
        setIsSubmitting(false)
        return
      }

      const eventId = response.data?.id

      if (eventId && data.zones.length > 0) {
        for (const zone of data.zones) {
          await api.post(`/organizer/events/${eventId}/zones`, zone)
        }
      }

      navigate('/')
    } catch {
      setError('Da xay ra loi. Vui long thu lai.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <EventWizardSidebar activeStep={currentStep.label} onStepChange={handleSidebarChange} />

      <main className="pb-32 pt-16 md:pl-64">
        <div className="mx-auto max-w-5xl px-6 py-8">
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {currentStepIndex === 0 && <Step1BasicInfo data={data} onChange={handleFieldChange} />}
          {currentStepIndex === 1 && <Step2Seating data={data} onChange={handleFieldChange} />}
          {currentStepIndex === 2 && (
            <Step3Publish
              data={data}
              isSubmitting={isSubmitting}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </main>

      <EventWizardFooter
        canProceed={canProceed()}
        currentStep={currentStep.stepNumber}
        onBack={handleBack}
        onNext={currentStepIndex === totalSteps - 1 ? handleSubmit : handleNext}
        totalSteps={totalSteps}
      />
    </div>
  )
}

export default OrganizerCreateEventPage
