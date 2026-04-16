"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';

export default function MobileFAB() {
  const { scrollY } = useScroll();

  // Appear after 120px of scroll
  const opacity = useTransform(scrollY, [100, 160], [0, 1]);
  const scale = useTransform(scrollY, [100, 160], [0.85, 1]);

  return (
    <motion.div
      className="fixed bottom-6 right-4 z-50 md:hidden"
      style={{ opacity, scale }}
    >
      <Link
        href="/hire#booking-form"
        className="flex items-center gap-2 bg-gradient-to-r from-primary to-teal-500 text-white font-bold px-5 py-3 rounded-full shadow-2xl shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-transform duration-200 text-sm"
      >
        <CalendarCheck className="h-4 w-4 shrink-0" />
        Book Now
      </Link>
    </motion.div>
  );
}
