import type { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'FAQ — Bishops Hull Hub',
  description:
    'Frequently asked questions about hiring and using the Bishops Hull Hub community venue in Taunton.',
};

export default function FAQPage() {
  return <FAQClient />;
}
