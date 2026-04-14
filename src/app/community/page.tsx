import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, Landmark, Sprout, Footprints, ExternalLink, Eye, Music, Wind, Hand, TreePine, Accessibility } from 'lucide-react';

export default function CommunityPage() {
  const gardenImages = PlaceHolderImages.filter(img => img.id.startsWith('garden-'));
  const sensoryMain = PlaceHolderImages.find(img => img.id === 'sensory-trail-main');
  const sensoryWillow = PlaceHolderImages.find(img => img.id === 'sensory-willow');

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

      {/* Expanded Sensory Trail Section */}
      <section id="sensory-trail" className="scroll-mt-24 space-y-12">
        <div className="relative rounded-[3rem] overflow-hidden bg-primary text-primary-foreground shadow-2xl">
          <div className="absolute inset-0 opacity-20 z-0">
             <Image 
                src={sensoryMain?.imageUrl || "https://picsum.photos/seed/sensory-1/1200/600"} 
                alt="Sensory Trail" 
                fill 
                className="object-cover"
                data-ai-hint="sensory garden"
             />
          </div>
          <div className="relative z-10 p-8 md:p-16 space-y-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/20 rounded-full text-sm font-bold uppercase tracking-wider backdrop-blur-sm">
              <Footprints className="h-4 w-4" /> Award Winning Project
            </div>
            <h2 className="text-4xl md:text-6xl font-headline font-bold">The Sensory Trail</h2>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed font-medium">
              A journey of discovery through the natural beauty of Bishops Hull. Designed for all ages and abilities to connect with nature.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" size="lg" className="rounded-2xl px-8">Download Trail Map</Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-2xl px-8" size="lg">Educational Guide</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Sight",
              icon: Eye,
              desc: "A riot of seasonal colors from our wildflower meadow and carefully selected year-round planting.",
              color: "bg-blue-50 text-blue-700"
            },
            {
              title: "Sound",
              icon: Music,
              desc: "Listen to the rustle of the living willow tunnel and the gentle melody of our wind chimes.",
              color: "bg-amber-50 text-amber-700"
            },
            {
              title: "Smell",
              icon: Wind,
              desc: "Inhale the fragrance of our herb garden, featuring lavender, rosemary, and seasonal blooms.",
              color: "bg-green-50 text-green-700"
            },
            {
              title: "Touch",
              icon: Hand,
              desc: "Explore tactile markers, varied path textures, and smooth natural wood installations.",
              color: "bg-purple-50 text-purple-700"
            }
          ].map((station, idx) => (
            <Card key={idx} className="border-none shadow-lg hover:translate-y-[-4px] transition-all duration-300 rounded-[2rem]">
              <CardContent className="p-8 space-y-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${station.color}`}>
                  <station.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-headline">{station.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{station.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-xl">
            <Image 
              src={sensoryWillow?.imageUrl || "https://picsum.photos/seed/sensory-2/600/400"} 
              alt="Willow Tunnel" 
              fill 
              className="object-cover"
              data-ai-hint="willow tunnel"
            />
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Accessibility className="h-8 w-8" />
              <h3 className="text-2xl md:text-3xl font-headline font-bold">Inclusive by Design</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The trail has been meticulously planned to be fully accessible. With wide, level paths and high-contrast markers, we ensure that wheelchair users and those with visual impairments can enjoy the trail independently.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                <p className="font-bold text-primary">100m</p>
                <p className="text-xs text-muted-foreground uppercase font-bold">Total Loop</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                <p className="font-bold text-primary">Full Access</p>
                <p className="text-xs text-muted-foreground uppercase font-bold">Step-free</p>
              </div>
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
