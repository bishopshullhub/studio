import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, Landmark, Sprout, Footprints, ExternalLink } from 'lucide-react';

export default function CommunityPage() {
  const gardenImages = PlaceHolderImages.filter(img => img.id.startsWith('garden-'));

  return (
    <div className="container mx-auto px-4 py-16 space-y-24">
      {/* Introduction */}
      <section className="max-w-3xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Community & Support</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          The Hub is more than just a building; it's a testament to what our village can achieve together. 
          Discover how you can get involved and support our ongoing projects.
        </p>
      </section>

      {/* Initiatives Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div id="100-club" className="space-y-6 p-8 rounded-3xl bg-primary/5 border border-primary/10 scroll-mt-24">
          <div className="h-14 w-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary">Join the 100 Club</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The 100 Club is a fantastic way to support the maintenance of the Hub while having a chance to win! 
            For just £5 a month, you are entered into our monthly prize draw. All profits go directly towards Hub improvements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">Sign Up Digitally</Button>
            <Button variant="outline" size="lg">Download Form</Button>
          </div>
        </div>

        <div id="buy-a-brick" className="space-y-6 p-8 rounded-3xl bg-accent/5 border border-accent/20 scroll-mt-24">
          <div className="h-14 w-14 bg-accent text-primary rounded-2xl flex items-center justify-center">
            <Landmark className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary">Buy a Brick</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Leave a lasting legacy by buying a commemorative brick. Your name or a message will be permanently 
            engraved and placed in our special tribute wall. A perfect gift or memorial for a loved one.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">Order Your Brick</Button>
        </div>
      </section>

      {/* Sensory Trail */}
      <section id="sensory-trail" className="scroll-mt-24">
        <div className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none hidden lg:block">
             <Footprints className="w-full h-full rotate-12" />
          </div>
          <div className="p-8 md:p-16 max-w-2xl space-y-8">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">The Sensory Trail</h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Our award-winning sensory trail offers an immersive natural experience for people of all ages and abilities. 
              With tactile elements, fragrant plants, and calming soundscapes, it's a jewel in the heart of Bishops Hull.
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" size="lg">View Trail Map</Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg">Read the Story</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Garden Gallery */}
      <section id="garden" className="space-y-12 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
              <Sprout className="h-5 w-5" /> Our Project
            </div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Gardens Through the Seasons</h2>
            <p className="text-lg text-muted-foreground">
              Meticulously maintained by our dedicated volunteers, the Hub gardens provide a space for quiet reflection and community gathering.
            </p>
          </div>
          <Button variant="outline" className="shrink-0">
            Volunteer as a Gardener <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gardenImages.map((img, idx) => (
            <div 
              key={idx} 
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
            >
              <Image
                src={img.imageUrl}
                alt={img.description}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                data-ai-hint={img.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <p className="text-white text-sm font-medium">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-12 space-y-8 border-t border-muted">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary">Want to start a new project?</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          We are always open to new ideas that benefit the Bishops Hull community. 
          Get in touch with the management committee today.
        </p>
        <Button asChild size="lg">
          <a href="mailto:info@bhhub.co.uk">Contact the Committee</a>
        </Button>
      </section>
    </div>
  );
}