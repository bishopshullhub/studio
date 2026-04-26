import { cn } from '@/lib/utils';

const PHASES = [
  {
    label: 'Your Enquiry',
    steps: [
      { n: 1, title: 'Check availability', desc: 'Use the live calendar to confirm your preferred date and time is free.' },
      { n: 2, title: 'Complete the enquiry form', desc: 'Fill in your contact details, event type, and date using the form below.' },
    ],
  },
  {
    label: 'Confirming Your Booking',
    steps: [
      { n: 3, title: 'Booking manager reviews your request', desc: 'Our volunteer bookings secretary will process your enquiry, usually within 3 working days.' },
      { n: 4, title: 'Viewing arranged', desc: 'The team will be in touch to arrange a convenient time for you to visit the Hub.' },
      { n: 5, title: 'Visit the Hub for a viewing', desc: 'Come and see the space in person before committing to a booking.' },
      { n: 6, title: 'Confirm whether to proceed', desc: 'Let us know if you would like to go ahead with the booking.' },
      { n: 7, title: 'Agree conditions of hire', desc: 'Review and confirm your agreement with the standard conditions of hire.' },
      { n: 8, title: 'Pay your hire charge', desc: 'Pay the hire fee to secure your booking on the calendar.' },
    ],
  },
  {
    label: 'Your Hire Day & After',
    steps: [
      { n: 9,  title: 'Pay the refundable deposit', desc: 'Two weeks before your hire date, pay the deposit (£50 daytime / £100 evening).' },
      { n: 10, title: 'Our team welcomes you', desc: 'A member of the team will be there at your hire time to let you in and lock up afterwards.' },
      { n: 11, title: 'Deposit returned', desc: 'Your deposit will be returned within 3 days of your hire, subject to the condition of the Hub.' },
    ],
  },
];

export default function HireProcessSection() {
  return (
    <section className="max-w-2xl mx-auto py-4">
      {/* Section header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
          How it works
        </span>
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-foreground">
          Your Hire Journey
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Here is what to expect from the moment you enquire to the end of your event.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {PHASES.map((phase, pi) => (
          <div key={phase.label} className={cn(pi > 0 && 'mt-8')}>
            {/* Phase pill */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-border" />
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold whitespace-nowrap">
                {phase.label}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Steps */}
            <div className="space-y-0">
              {phase.steps.map((step, si) => {
                const isLast = si === phase.steps.length - 1;
                return (
                  <div key={step.n} className="flex gap-4">
                    {/* Number + connector */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        {step.n}
                      </div>
                      {!isLast && (
                        <div className="w-0.5 flex-1 bg-primary/20 my-1" style={{ minHeight: '2rem' }} />
                      )}
                    </div>
                    {/* Text */}
                    <div className={cn('pb-6 pt-1', isLast && 'pb-0')}>
                      <p className="font-semibold text-foreground text-sm leading-snug">{step.title}</p>
                      <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Closing card */}
      <div className="mt-8 bg-gradient-to-r from-primary to-teal-600 text-primary-foreground rounded-2xl p-6 text-center">
        <p className="font-headline font-bold text-lg">Thanks for using the Bishops Hull Hub</p>
        <p className="text-sm opacity-80 mt-1">We hope you and your guests have a wonderful time.</p>
      </div>
    </section>
  );
}
