'use client';

import { ChevronDown, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type FAQEntry, CAT_COLORS } from '@/app/faq/FAQClient';

interface FAQItemProps {
  faq: FAQEntry;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onCopy: (id: string) => void;
  searchTerm: string;
}

export default function FAQItem({ faq, isOpen, onToggle, onCopy, searchTerm }: FAQItemProps) {
  const color = CAT_COLORS[faq.cat] ?? 'hsl(171,44%,38%)';

  const highlight = (text: string) => {
    if (!searchTerm) return <>{text}</>;
    const re = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    );
    const parts = text.split(re);
    return (
      <>
        {parts.map((part, i) =>
          re.test(part)
            ? <mark key={i} className="bg-accent/25 text-inherit rounded px-0.5">{part}</mark>
            : part
        )}
      </>
    );
  };

  return (
    <div
      id={`faq-${faq.id}`}
      className={cn(
        'relative rounded-[18px] bg-card border transition-all duration-300 overflow-hidden scroll-mt-24',
        isOpen
          ? 'border-primary/30 shadow-lg shadow-primary/10'
          : 'border-border hover:border-border/80 hover:shadow-md hover:shadow-primary/5'
      )}
    >
      {/* Trigger */}
      <button
        onClick={() => onToggle(faq.id)}
        className="w-full flex items-start gap-4 text-left px-6 py-5 bg-transparent border-none cursor-pointer relative z-10"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
      >
        {/* Category dot */}
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 transition-shadow duration-300"
          style={{
            background: color,
            boxShadow: isOpen ? `0 0 0 3px ${color}22` : 'none',
          }}
        />

        <span
          className={cn(
            'flex-1 text-base font-semibold leading-relaxed transition-colors duration-200',
            isOpen ? 'text-foreground' : 'text-foreground/75'
          )}
        >
          {highlight(faq.q)}
        </span>

        <ChevronDown
          className={cn(
            'flex-shrink-0 h-5 w-5 mt-0.5 transition-all duration-300',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
          style={{ color: isOpen ? color : undefined }}
        />
      </button>

      {/* Answer — CSS grid-row trick for smooth height animation */}
      <div
        id={`faq-answer-${faq.id}`}
        className={cn('faq-answer-panel', isOpen && 'faq-answer-panel--open')}
        role="region"
      >
        <div className="faq-answer-inner">
          <div className="relative pl-[3.1rem] pr-6 pb-6">
            {/* Accent left rule */}
            <div
              className="absolute left-[2.25rem] top-0 bottom-6 w-[2.5px] rounded-full"
              style={{ background: `linear-gradient(to bottom, ${color}, ${color}00)` }}
            />
            <p className="pl-4 text-[0.95rem] leading-[1.78] text-muted-foreground">
              {faq.a}
            </p>
            <button
              onClick={() => onCopy(faq.id)}
              className="mt-3 ml-4 inline-flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-primary/8"
            >
              <Link2 className="h-3 w-3" />
              Copy link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
