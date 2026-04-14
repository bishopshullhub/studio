"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, User, LogOut, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useFirebase, initiateAnonymousSignIn } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, auth } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    // Ensure we always have an identity for Firestore rules
    if (!user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, auth]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: "What's On", href: '/whats-on' },
    { name: 'Hire the Hub', href: '/hire' },
    { name: 'Community', href: '/community' },
    { name: 'FAQ', href: '/faq' },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
    setIsOpen(false);
  };

  const isRealUser = user && !user.isAnonymous;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <span className="font-headline font-bold text-xl text-primary transition-colors group-hover:text-primary/80">
            Bishops Hull Hub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-border mx-2" />

          {isRealUser ? (
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="gap-2 text-primary">
                <Link href="/admin"><ShieldCheck className="h-4 w-4" /> Admin</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/login"><LogIn className="h-4 w-4" /> Login</Link>
            </Button>
          )}

          <Button asChild variant="default" className="bg-primary hover:bg-primary/90 shadow-md">
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
          "md:hidden fixed inset-x-0 top-20 bg-background border-b border-border px-4 py-6 space-y-4 transition-all duration-300 ease-in-out shadow-2xl",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="block text-lg font-medium py-3 border-b border-muted last:border-0"
          >
            {link.name}
          </Link>
        ))}
        
        <div className="pt-4 space-y-3">
          {isRealUser ? (
            <>
              <Button asChild variant="outline" className="w-full gap-2 justify-start" onClick={() => setIsOpen(false)}>
                <Link href="/admin"><ShieldCheck className="h-5 w-5" /> Admin Portal</Link>
              </Button>
              <Button variant="ghost" className="w-full gap-2 justify-start text-destructive" onClick={handleLogout}>
                <LogOut className="h-5 w-5" /> Sign Out
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" className="w-full gap-2 justify-start" onClick={() => setIsOpen(false)}>
              <Link href="/login"><LogIn className="h-5 w-5" /> Portal Login</Link>
            </Button>
          )}
          <Button asChild className="w-full h-12 text-lg shadow-lg" onClick={() => setIsOpen(false)}>
            <Link href="/hire#booking-form">Book the Hub</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
