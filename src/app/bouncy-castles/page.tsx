import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Ruler, ShieldCheck, Zap, Camera } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function BouncyCastlesPage() {
  const exampleImage = PlaceHolderImages.find(img => img.id === 'bouncy-castle-example');

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Bouncy Castle Guidance</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          We are pleased to allow bouncy castles at the Bishops Hull Hub. To ensure the safety of your guests and the protection of our facilities, please follow these guidelines.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-lg bg-white">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Ruler className="h-5 w-5" /> Indoor Use
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">The main hall is suitable for most standard indoor bouncy castles.</p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span><strong>Height Limit:</strong> Maximum height of 3.5m to avoid ceiling lights and projector.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span><strong>Floor Protection:</strong> Protective mats MUST be used under the blower and at the entrance.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span><strong>Hall Size:</strong> 14.8m x 9m allows plenty of room around the inflatable.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-white">
          <CardHeader className="bg-accent/10 border-b border-accent/20">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5" /> Outdoor Use
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">The terrace and surrounding areas can accommodate outdoor inflatables.</p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span><strong>Location:</strong> Usually placed on the south-facing terrace or the grass (weather permitting).</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span><strong>Anchoring:</strong> Must be safely anchored according to the supplier's instructions.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span><strong>Power:</strong> External power sockets are available near the terrace area.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Example Image Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm font-headline">
          <Camera className="h-5 w-5" /> See it in action
        </div>
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-muted">
          <Image
            src={exampleImage?.imageUrl || "https://bhhub.co.uk/wp-content/uploads/2022/07/Bouncy-Castle-Example2-1024x768.jpg"}
            alt={exampleImage?.description || "Bouncy Castle Example"}
            fill
            className="object-cover"
            data-ai-hint="bouncy castle hall"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <p className="text-white font-medium text-lg">Standard indoor castle setup in the Bishops Hull Hub main hall.</p>
            <p className="text-white/80 text-sm">Note the ample clearance around the vaulted ceiling.</p>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 border border-amber-200 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3 text-amber-800">
          <ShieldCheck className="h-8 w-8" />
          <h2 className="text-2xl font-bold font-headline">Hirer Responsibilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-amber-900/80">
          <div className="space-y-4">
            <h3 className="font-bold text-amber-900">Insurance & Safety</h3>
            <p className="text-sm leading-relaxed">
              The Hub's insurance does NOT cover the use of bouncy castles. You must ensure your supplier has valid Public Liability Insurance (minimum £5 million) and provides a risk assessment.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-amber-900">Supervision</h3>
            <p className="text-sm leading-relaxed">
              A responsible adult must supervise the bouncy castle at all times. It is your responsibility to ensure the manufacturer's safety guidelines are followed.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-primary text-primary-foreground rounded-3xl p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold font-headline">Ready to book?</h2>
        <p className="opacity-90 max-w-xl mx-auto">
          Please ensure you mention your intention to have a bouncy castle in your booking enquiry so we can provide any additional support needed.
        </p>
        <Button asChild variant="secondary" size="lg">
          <Link href="/hire#booking-form">Return to Booking Enquiry</Link>
        </Button>
      </div>
    </div>
  );
}
