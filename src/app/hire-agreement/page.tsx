export default function HireAgreementPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-headline font-bold text-primary mb-8">Standard Hire Agreement</h1>
      <div className="prose prose-slate max-w-none space-y-6">
        <p className="text-lg font-bold">
          All bookings are subject to the following terms and conditions. By submitting a booking enquiry and receiving confirmation, you agree to abide by these rules.
        </p>
        
        <h2 className="text-2xl font-bold text-primary mt-8">1. Supervison</h2>
        <p>
          The Hirer shall, during the period of the hiring, be responsible for: supervision of the premises, the fabric and the contents; their care, safety from damage however slight or change of any sort; and the behaviour of all persons using the premises.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8">2. Use of Premises</h2>
        <p>
          The Hirer shall not use the premises for any purpose other than that described in the hiring agreement and shall not sub-hire or allow the premises to be used for any unlawful purpose.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8">3. Licences</h2>
        <p>
          The Hub holds a relevant license for the sale of alcohol. If you intend to sell alcohol during your event, this must be declared at the time of booking and approved by the management committee.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8">4. Damage and Cleaning</h2>
        <p>
          The Hirer shall be responsible for leaving the premises and surrounds in a clean and tidy condition. Any furniture moved must be replaced. All rubbish must be removed from the site unless otherwise agreed.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8">5. Public Safety Compliance</h2>
        <p>
          The Hirer shall comply with all conditions and regulations made in respect of the premises by the Fire Authority, Local Authority, and the Licensing Authority.
        </p>

        <div className="bg-muted p-8 rounded-2xl mt-12 border border-border">
          <p className="text-sm italic">
            Note: This is an abbreviated version of the full agreement. A complete PDF version is available upon request from the bookings secretary.
          </p>
        </div>
      </div>
    </div>
  );
}