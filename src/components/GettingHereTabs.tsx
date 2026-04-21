"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Bus, Footprints, Bike, ParkingCircle, Clock, ExternalLink, MapPin, Lock } from "lucide-react";

const steps = {
  car: [
    {
      icon: MapPin,
      title: "Set your satnav",
      detail: "Use postcode TA1 5EB for Bishops Hull Playing Field",
    },
    {
      icon: Car,
      title: "Head onto Bishops Hull Hill",
      detail: "Coming from Taunton town centre, travel west along Wellington Road and onto Silk Mills Road. The turn left at the traffic lights onto Bishops Hull Hill",
    },
    {
      icon: MapPin,
      title: "Look for the playing field entrance",
      detail: "The gate is on the left-hand side — it can be easy to miss at speed, so watch carefully",
    },
    {
      icon: ParkingCircle,
      title: "Follow the track to the car park",
      detail: "Free on-site parking is available in the Hub car park for users of the Hub and Playing Field",
    },
  ],
  bus: [
    {
      icon: Bus,
      title: "Catch Route 3",
      detail: "The Bishops Hull · Parade · Dowslands service runs from Taunton town centre (The Parade)",
    },
    {
      icon: MapPin,
      title: "Alight at Hamwood Terrace",
      detail: "This is the closest stop to the Hub — look out for it as you travel along Bishops Hull Hill",
    },
    {
      icon: Footprints,
      title: "Short walk to the Hub",
      detail: "From Hamwood Terrace it's a short walk along Bishops Hull Hill to the playing field entrance",
    },
  ],
  foot: [
    {
      icon: MapPin,
      title: "The Hub is at the heart of Bishops Hull",
      detail: "Centrally located on the playing field, the Hub is within easy walking distance from across the whole village",
    },
    {
      icon: Clock,
      title: "Around 20–25 minutes from Taunton town centre",
      detail: "A pleasant, mostly-flat walk along Bishops Hull Road and Bishops Hull Hill",
    },
    {
      icon: MapPin,
      title: "Head west from town centre",
      detail: "From town centre, follow Wellington Road and Mountway Road and continue across Silk Mills Road onto Bishops Hull Hill",
    },
    {
      icon: MapPin,
      title: "Turn onto Bishops Hull Hill",
      detail: "Continue along the hill — the playing field entrance will appear on your right",
    },
    {
      icon: Footprints,
      title: "Enter via the field gate",
      detail: "Walk through the playing field to reach the Hub building",
    },
  ],
  bike: [
    {
      icon: Bike,
      title: "Follow the local cycle network",
      detail: "Taunton has good cycle links — plan your route using Sustrans or CycleStreets",
    },
    {
      icon: MapPin,
      title: "Approach via Bishops Hull Road",
      detail: "A quieter route from town — continue onto Bishops Hull Hill and look for the playing field entrance",
    },
    {
      icon: ParkingCircle,
      title: "Bike parking at the Hub",
      detail: "Secure bike parking is available on-site",
    },
  ],
};

function StepList({ items }: { items: typeof steps.car }) {
  return (
    <ol className="space-y-4 mt-6">
      {items.map((step, i) => (
        <li key={i} className="flex gap-4 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
            <span className="text-primary font-bold text-xs">{i + 1}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <step.icon className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="font-semibold text-foreground text-sm">{step.title}</p>
            </div>
            <p className="text-muted-foreground text-sm mt-0.5 ml-6">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function GettingHereTabs() {
  return (
    <Tabs defaultValue="foot" className="w-full">
      <TabsList className="w-full h-auto flex flex-wrap gap-1 p-1.5 bg-muted rounded-2xl mb-2">
        <TabsTrigger
          value="foot"
          className="flex-1 min-w-[100px] flex items-center gap-2 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
        >
          <Footprints className="h-4 w-4" />
          <span className="font-medium">On Foot</span>
          <span className="hidden sm:inline-flex items-center rounded-full bg-accent/30 text-accent-foreground data-[state=active]:bg-white/20 data-[state=active]:text-white px-1.5 py-0.5 text-[10px] font-semibold leading-none">
            Preferred
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="car"
          className="flex-1 min-w-[100px] flex items-center gap-2 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
        >
          <Car className="h-4 w-4" />
          <span className="font-medium">By Car</span>
        </TabsTrigger>
        <TabsTrigger
          value="bus"
          className="flex-1 min-w-[100px] flex items-center gap-2 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
        >
          <Bus className="h-4 w-4" />
          <span className="font-medium">By Bus</span>
        </TabsTrigger>
        <TabsTrigger
          value="bike"
          className="flex-1 min-w-[100px] flex items-center gap-2 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
        >
          <Bike className="h-4 w-4" />
          <span className="font-medium">By Bike</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="foot">
        <div className="bg-card rounded-3xl border border-border p-6 md:p-8">
          <div className="flex items-start gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Footprints className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg">Walking</h3>
                <span className="inline-flex items-center rounded-full bg-accent/20 text-primary px-2.5 py-0.5 text-xs font-semibold">
                  Our preferred way to visit
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                The Hub is centrally located in Bishops Hull — most residents can walk from their door
              </p>
            </div>
          </div>
          <StepList items={steps.foot} />
          <a
            href="https://maps.app.goo.gl/BBxK3zLuSw2dXfpNA"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Get walking directions in Google Maps <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </TabsContent>

      <TabsContent value="car">
        <div className="bg-card rounded-3xl border border-border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Arriving by Car</h3>
              <p className="text-muted-foreground text-sm">Satnav: TA1 5EB</p>
            </div>
          </div>
          <StepList items={steps.car} />
          <div className="mt-6 space-y-3">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 flex items-start gap-3">
              <ParkingCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Free parking</span> — On-site car park available at no charge for users of the Hub and Playing Field.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <Lock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Please note:</span> The car park is reserved for Hub and Playing Field users only. The gate may be locked outside of operating hours to prevent unauthorised access to the playing field.
              </p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="bus">
        <div className="bg-card rounded-3xl border border-border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Arriving by Bus</h3>
              <p className="text-muted-foreground text-sm">Route 3 — Bishops Hull service</p>
            </div>
          </div>
          <StepList items={steps.bus} />
          <a
            href="https://data.bus-data.dft.gov.uk/timetable/dataset/18602/detail/?line=3&service=UZ000SMST:003A"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View Route 3 timetable <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </TabsContent>

      <TabsContent value="bike">
        <div className="bg-card rounded-3xl border border-border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bike className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Arriving by Bike</h3>
              <p className="text-muted-foreground text-sm">Bike parking available on-site</p>
            </div>
          </div>
          <StepList items={steps.bike} />
          <a
            href="https://www.sustrans.org.uk/find-a-route-on-the-national-cycle-network/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Plan a cycle route via Sustrans <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </TabsContent>
    </Tabs>
  );
}
