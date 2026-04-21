import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageSquare, Phone } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I contact someone when there's an issue during hire period?",
      answer: "Please call the number displayed above the notice board labelled 'On-Duty Contact number'.",
      icon: Phone,
    },
    {
      question: "What is the height of the gate height barrier?",
      answer: "The height barrier is 2m high. If you expect vehicles that will exceed this heigh, please contact the booking manager or On-Duty contact number",
    },
    {
      question: "What do I do with any rubbish generated during my hire?",
      answer: "We ask all hirers to take any rubbish generated during their hire away with them to keep the Hub clean for everyone.",
    },
    {
      question: "What is the total number of people allowed in the hall?",
      answer: "The maximum capacity for the hall is 110 people.",
    },
    {
      question: "Is there a 'Premises' licence for the Hub?",
      answer: "No, the Hub does not hold a general premises licence.",
    },
    {
      question: "Are dogs allowed on the premises?",
      answer: "No dogs are allowed on the premises, with the exception of guide and assistant dogs.",
    },
    {
      question: "How many tables and chairs are available?",
      answer: "We have 12 tables and approximately 80 chairs available for use in the hall.",
    },
    {
      question: "Are other tables available if needed?",
      answer: "Yes, it is possible to hire additional tables from the Playing Field Trust. Please contact you Hub contact for more information.",
    },
    {
      question: "Where is the fire assembly point and who is responsible for evacuations?",
      answer: "In the event of a fire or the fire alarm sounding, guests should assemble outside on the playing field. It is the hirer's responsibility to ensure everyone is safely out and to call the fire brigade.",
    },
    {
      question: "What is the size and floor space of the Hub?",
      answer: "The main hall is 14.8M long x 9M wide. It features a vaulted sloping roof with a maximum height of 4M.",
    },
    {
      question: "What parking is available?",
      answer: "There are 18 dedicated parking spaces at the Hub, with additional parking available within the village.",
    },
    {
      question: "What external space is available for use?",
      answer: "We have a front south-facing terrace facing the playing field, which is directly accessible from the main hall. It measures approximately 23M x 2.5M.",
    },
    {
      question: "Can we have a bouncy castle in the Hall?",
      answer: "Yes, provided the equipment is for internal use (to avoid floor damage) and has a limited height to avoid the ceiling lights and projector.",
    },
    {
      question: "Can we use stage smoke or dry ice?",
      answer: "It is not advisable. In certain circumstances, such as warm temperatures, stage smoke can trigger the smoke alarms.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl text-primary mb-2">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to know about hiring and using the Bishops Hull Hub.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="px-6 border-b last:border-0 border-muted">
              <AccordionTrigger className="text-left text-lg font-semibold py-6 hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-16 p-8 bg-primary/5 rounded-3xl border border-primary/10 text-center space-y-6">
        <div className="inline-flex items-center justify-center p-2 bg-primary text-primary-foreground rounded-lg">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-primary">Still have questions?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          If you couldn't find the answer you were looking for, please don't hesitate to reach out to our bookings team.
        </p>
        <div className="flex justify-center">
          <a
            href="mailto:bhhubbookings@gmail.com"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all"
          >
            Contact the Bookings Secretary
          </a>
        </div>
      </div>
    </div>
  );
}
