
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, Landmark, Sprout, Footprints, ExternalLink, Eye, Music, Wind, Hand, TreePine, Accessibility, Download, Info } from 'lucide-react';

export default function CommunityPage() {
  const gardenImages = PlaceHolderImages.filter(img => img.id.startsWith('garden-'));
  const sensoryMain = PlaceHolderImages.find(img => img.id === 'sensory-trail-main');
  const sensoryWillow = PlaceHolderImages.find(img => img.id === 'sensory-willow');
  const sensoryWildflower = PlaceHolderImages.find(img => img.id === 'sensory-wildflower');
  const sensoryHerbs = PlaceHolderImages.find(img => img.id === 'sensory-herbs');

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

      {/* Sensory Trail - The Main Feature */}
      <section id="sensory-trail" className="scroll-mt-24 space-y-16">
        <div className="relative rounded-[3rem] overflow-hidden bg-primary text-primary-foreground shadow-2xl">
          <div className="absolute inset-0 opacity-20 z-0">
             <Image 
                src={sensoryMain?.imageUrl || "https://picsum.photos/seed/sensory-1/1200/600"} 
                alt="Sensory Trail Entrance" 
                fill 
                className="object-cover"
                data-ai-hint="sensory garden entrance"
             />
          </div>
          <div className="relative z-10 p-8 md:p-16 space-y-8 max-w-4xl">
            
            <h2 className="text-4xl md:text-6xl font-headline font-bold leading-tight">The Bishops Hull Sensory Trail</h2>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed font-medium">
              A new way to discover the natural beauty of Bishops Hull. Designed for all ages and abilities to connect with nature through touch, sight, sound, and smell.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="secondary" size="lg" className="rounded-2xl px-8 h-14">
                <a href="/Sensory-Walk-Master-Plan-Amendment-031122.pdf" download>
                  <Download className="mr-2 h-5 w-5" /> Download Trail Map
                </a>
              </Button>
            
            </div>
          </div>
        </div>

        {/* Trail Narrative Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-headline font-bold text-primary">Station 1: The Willow Tunnel</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Walk through our living willow tunnel. As the seasons change, so does the tunnel—from the bare structures of winter to the lush green canopy of summer. It provides a natural shade and a unique tactile experience for visitors.
            </p>
            <div className="p-6 bg-muted/50 rounded-2xl border border-border flex gap-4">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                <Hand className="h-5 w-5" />
              </div>
              <p className="text-sm italic">Feel the smooth bark and the flexible branches that form this living structure.</p>
            </div>
          </div>
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
            <Image 
              src={sensoryWillow?.imageUrl || "https://picsum.photos/seed/sensory-2/600/400"} 
              alt="Living Willow Tunnel" 
              fill 
              className="object-cover"
              data-ai-hint="willow tunnel"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white lg:order-2">
            <Image 
              src={sensoryWildflower?.imageUrl || "https://picsum.photos/seed/sensory-3/600/400"} 
              alt="Wildflower Meadow" 
              fill 
              className="object-cover"
              data-ai-hint="wildflower meadow"
            />
          </div>
          <div className="space-y-6 lg:order-1">
            <h3 className="text-3xl font-headline font-bold text-primary">Station 2: The Wildflower Meadow</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our meadow is a riot of color during the summer months. It's not just beautiful to look at; it's a vital habitat for local pollinators. Listen to the hum of bees and the gentle rustle of tall grasses in the wind.
            </p>
            <div className="p-6 bg-muted/50 rounded-2xl border border-border flex gap-4">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                <Music className="h-5 w-5" />
              </div>
              <p className="text-sm italic">Close your eyes and listen to the natural symphony of our local wildlife.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-headline font-bold text-primary">Station 3: The Herb Garden</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Designed to stimulate the sense of smell, our herb garden features lavender, rosemary, mint, and thyme. This station encourages visitors to gently touch the leaves to release their natural oils and fragrances.
            </p>
            <div className="p-6 bg-muted/50 rounded-2xl border border-border flex gap-4">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                <Wind className="h-5 w-5" />
              </div>
              <p className="text-sm italic">Inhale deeply and explore the varied scents of our kitchen and medicinal herbs.</p>
            </div>
          </div>
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
            <Image 
              src={sensoryHerbs?.imageUrl || "https://picsum.photos/seed/sensory-4/600/400"} 
              alt="Aromatic Herb Garden" 
              fill 
              className="object-cover"
              data-ai-hint="herb garden lavender"
            />
          </div>
        </div>

        {/* Accessibility Note */}
        <div className="bg-accent/5 border-2 border-accent/20 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
          <div className="h-20 w-20 bg-accent text-primary rounded-3xl flex items-center justify-center shrink-0 shadow-lg">
            <Accessibility className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-bold font-headline text-primary">Fully Accessible Design</h4>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The entire 100m trail loop has been meticulously planned to be fully accessible. With wide, level paths and high-contrast markers, we ensure that wheelchair users and those with visual impairments can enjoy the trail independently.
            </p>
          </div>
        </div>
      </section>

      {/* Fundraising Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div id="100-club" className="space-y-6 p-10 rounded-[3rem] bg-primary/5 border border-primary/10 scroll-mt-24 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-14 w-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary">Join the 100 Club</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The 100 Club is a fantastic way to support the maintenance of the Hub while having a chance to win! 
            For just £5 a month, you are entered into our monthly prize draw. All profits go directly towards Hub improvements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-xl px-8">Sign Up Digitally</Button>
            <Button variant="outline" size="lg" className="rounded-xl px-8">Download Form</Button>
          </div>
        </div>

        <div id="buy-a-brick" className="space-y-6 p-10 rounded-[3rem] bg-accent/5 border border-accent/20 scroll-mt-24 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-14 w-14 bg-accent text-primary rounded-2xl flex items-center justify-center">
            <Landmark className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary">Buy a Brick</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Leave a lasting legacy by buying a commemorative brick. Your name or a message will be permanently 
            engraved and placed in our special tribute wall. A perfect gift or memorial for a loved one.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-xl px-8">Order Your Brick</Button>
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
          <Button variant="outline" className="shrink-0 rounded-xl">
            Volunteer as a Gardener <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gardenImages.map((img, idx) => (
            <div 
              key={idx} 
              className="group relative aspect-square rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
            >
              <Image
                src={img.imageUrl}
                alt={img.description}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                data-ai-hint={img.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 text-center">
                <p className="text-white text-sm font-medium w-full">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-16 space-y-8 border-t border-muted bg-primary/5 rounded-[3rem]">
        <div className="h-16 w-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <TreePine className="h-8 w-8" />
        </div>
        <h2 className="text-2xl md:text-4xl font-headline font-bold text-primary">Want to start a new project?</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          We are always open to new ideas that benefit the Bishops Hull community. 
          Get in touch with the management committee today.
        </p>
        <Button asChild size="lg" className="rounded-2xl px-12 h-14 text-lg shadow-xl">
          <a href="mailto:info@bhhub.co.uk">Contact the Committee</a>
        </Button>
      </section>
    </div>
  );
}
