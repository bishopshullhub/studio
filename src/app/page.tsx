import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Ticket, Heart, HelpCircle, ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');
  const youthImage = PlaceHolderImages.find(img => img.id === 'youth-club');

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/bhh-hero/1200/600"}
            alt="Bishops Hull Hub Exterior"
            fill
            className="object-cover"
            priority
            data-ai-hint="modern building community hall"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="container relative z-10 text-center text-white px-4 space-y-6">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight drop-shadow-md">
            Welcome to the <span className="text-accent">Bishops Hull Hub</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-medium drop-shadow-sm">
            The heart of our village community. A space for everyone to connect, learn, and grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8">
              <Link href="/whats-on">View Schedule</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white text-lg px-8">
              <Link href="/hire">Make a Booking</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="container mx-auto px-4 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Event Tickets",
              desc: "Book your place for our upcoming one-off events and fundraisers.",
              icon: Ticket,
              href: "/whats-on#tickets",
              color: "bg-white"
            },
            {
              title: "Join the 100 Club",
              desc: "Support your hub and get a chance to win monthly prizes.",
              icon: Heart,
              href: "/community#100-club",
              color: "bg-white"
            },
            {
              title: "Common Questions",
              desc: "Find answers about venue hire, capacities, and facilities.",
              icon: HelpCircle,
              href: "/faq",
              color: "bg-white"
            }
          ].map((item, idx) => (
            <Card key={idx} className={`${item.color} shadow-xl border-t-4 border-t-primary hover:translate-y-[-4px] transition-all duration-300`}>
              <CardHeader>
                <item.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-2xl font-headline text-primary">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{item.desc}</p>
                <Link 
                  href={item.href} 
                  className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all"
                >
                  Find out more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Highlight Module: The Youth Hub */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-primary/5 rounded-3xl overflow-hidden border border-primary/10 grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 md:p-16 flex flex-col justify-center space-y-6">
            <div className="inline-block px-4 py-1 bg-accent/20 text-primary font-bold rounded-full text-sm uppercase tracking-wider">
              Featured Activity
            </div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">The Youth Hub</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Open to secondary-school age children, the Youth Hub is a safe and vibrant space for our village's teenagers.
              </p>
              <p className="font-semibold text-foreground">
                <CalendarDays className="inline mr-2 h-5 w-5 text-primary" />
                Every 3rd Saturday of the Month
              </p>
              <p>
                Whether you want to chill, play games, or learn new skills, our youth team is here to support you.
              </p>
            </div>
            <Button asChild size="lg" className="w-fit">
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSdbFE1XNPMMnVcUxeR7XnxVJa-qyC7vrPxmlgF3g4AXDmzkoA/viewform" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Register Your Interest
              </a>
            </Button>
          </div>
          <div className="relative h-[400px] lg:h-auto">
            <Image
              src={youthImage?.imageUrl || "https://picsum.photos/seed/bhh-youth/600/400"}
              alt="Youth Activities"
              fill
              className="object-cover"
              data-ai-hint="teens playing games"
            />
          </div>
        </div>
      </section>

      {/* News / Call to Action Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-headline font-bold">Ready to Host Your Event?</h2>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Our modern facility is perfect for birthday parties, meetings, classes, and wedding receptions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link href="/hire">View Pricing & Specs</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg">
              <Link href="/hire#booking-form">Inquire Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
