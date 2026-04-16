"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  heroImageUrl: string;
}

export default function HeroSection({ heroImageUrl }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Parallax: image moves up at ~40% of scroll speed
  const imageY = useTransform(scrollY, [0, 600], ['0%', '25%']);

  // Overlay darkens as user scrolls
  const overlayOpacity = useTransform(scrollY, [0, 350], [0.4, 0.75]);

  // Frosted glass blur increases on scroll
  const blurAmount = useTransform(scrollY, [0, 350], [0, 10]);
  const blurFilter = useTransform(blurAmount, (v) => `blur(${v}px)`);


  return (
    <section
      ref={ref}
      className="relative h-[60vh] md:h-[680px] flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-0 z-0 scale-110"
        style={{ y: imageY }}
      >
        <Image
          src={heroImageUrl}
          alt="Bishops Hull Hub Exterior"
          fill
          className="object-cover"
          priority
          data-ai-hint="modern building community hall"
        />
      </motion.div>

      {/* Darkening overlay with frosted glass effect */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          opacity: overlayOpacity,
          backdropFilter: blurFilter,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(10,60,55,0.85) 100%)',
        }}
      />

      {/* Hero content */}
      <div className="container relative z-20 text-center text-white px-4 space-y-5 md:space-y-7">
        <motion.h1
          className="text-4xl md:text-6xl font-headline font-bold tracking-tight drop-shadow-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Welcome to the{' '}
          <span className="text-accent">Bishops Hull Hub</span>
        </motion.h1>

        <motion.p
          className="font-marker text-2xl md:text-3xl max-w-2xl mx-auto drop-shadow-md text-white/90"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          The heart of our village community.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-8 h-12 md:h-14 shadow-lg"
          >
            <Link href="/whats-on">View Schedule</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/25 text-white text-base md:text-lg px-8 h-12 md:h-14"
          >
            <Link href="/hire">Make a Booking</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/70"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <ChevronDown className="h-7 w-7" />
      </motion.div>
    </section>
  );
}
