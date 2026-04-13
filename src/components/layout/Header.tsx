"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: "What's On", href: '/whats-on' },
    { name: 'Hire the Hub', href: '/hire' },
    { name: 'Community', href: '/community' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
            B
          </div>
          <span className="font-headline font-bold text-xl text-primary hidden sm:inline-block">
            Bishops Hull Hub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
            <Link href="/hire#booking-form">Book the Hub</Link>
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-20 bg-background border-b border-border px-4 py-6 space-y-4 transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="block text-lg font-medium py-2 border-b border-muted last:border-0"
          >
            {link.name}
          </Link>
        ))}
        <Button asChild className="w-full mt-4" onClick={() => setIsOpen(false)}>
          <Link href="/hire#booking-form">Book the Hub</Link>
        </Button>
      </div>
    </header>
  );
}
