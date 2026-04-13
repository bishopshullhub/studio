import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary font-headline uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Bishops Hull Hub, Bishops Hull Hill, Taunton TA1 5EB</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:bhhubbookings@gmail.com" className="hover:underline">bhhubbookings@gmail.com</a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary font-headline uppercase tracking-wider">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/whats-on" className="hover:text-primary transition-colors">What's On</Link></li>
              <li><Link href="/hire" className="hover:text-primary transition-colors">Hire Information</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">Community Projects</Link></li>
              <li><Link href="/hire#booking-form" className="hover:text-primary transition-colors">Booking Enquiry</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary font-headline uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Statement</Link></li>
              <li><Link href="/hire-agreement" className="hover:text-primary transition-colors">Hire Agreement</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-muted-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 Bishops Hull Hub. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Registered Charity in England & Wales</span>
            <Link href="https://bhhub.co.uk" className="hover:text-primary">Official Site</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}