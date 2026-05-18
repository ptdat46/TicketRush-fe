function EventWizardFooter({ currentStep, totalSteps, onBack, onNext, canProceed }) {
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  return (
    <footer className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-[#3d4a40] bg-[#252c26] px-6 py-4 shadow-lg md:pl-[calc(16rem+24px)]">
      <div className="hidden text-xs font-semibold text-[#bccabd] md:block">
        &copy; 2024 TicketRush Organizers
      </div>

      <div className="flex w-full items-center gap-4 md:w-auto md:justify-end">
        {!isFirstStep && (
          <button
            className="rounded-full border border-[#59de92] px-6 py-2 text-xs font-semibold text-[#59de92] transition-all hover:shadow-[0_0_15px_rgba(89,222,146,0.4)]"
            onClick={onBack}
            type="button"
          >
            Quay lại
          </button>
        )}

        {isLastStep ? (
          <button
            className="rounded-full bg-[#59de92] px-6 py-2 text-xs font-bold text-[#00391e] transition-all hover:brightness-110 hover:shadow-[0_0_15px_rgba(89,222,146,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canProceed}
            onClick={onNext}
            type="button"
          >
            Hoàn tất & Đăng sự kiện
          </button>
        ) : (
          <button
            className="rounded-full bg-[#59de92] px-6 py-2 text-xs font-bold text-[#00391e] transition-all hover:brightness-110 hover:shadow-[0_0_15px_rgba(89,222,146,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canProceed}
            onClick={onNext}
            type="button"
          >
            Bước tiếp theo
          </button>
        )}
      </div>
    </footer>
  )
}

export default EventWizardFooter
