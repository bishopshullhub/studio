"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import * as SliderPrimitive from "@radix-ui/react-slider";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const seasons = [
  { label: "May 2023",      short: "May",       icon: "🌱" },
  { label: "June 2023",     short: "June",      icon: "🌸" },
  { label: "July 2023",     short: "July",      icon: "☀️" },
  { label: "August 2023",   short: "August",    icon: "🌻" },
  { label: "Christmas 2023",short: "Christmas", icon: "❄️" },
] as const;

type SeasonLabel = typeof seasons[number]["label"];

const galleryData: Record<SeasonLabel, string[]> = {
  "May 2023": [
    "/garden-photos/2023-05_May/P5231430.jpg",
    "/garden-photos/2023-05_May/P5231434.jpg",
    "/garden-photos/2023-05_May/P5231438.jpg",
    "/garden-photos/2023-05_May/P5231441.jpg",
    "/garden-photos/2023-05_May/P5231443.jpg",
    "/garden-photos/2023-05_May/P5231444.jpg",
    "/garden-photos/2023-05_May/P5231445.jpg",
    "/garden-photos/2023-05_May/P5231446.jpg",
    "/garden-photos/2023-05_May/P5231448.jpg",
    "/garden-photos/2023-05_May/P5231449.jpg",
    "/garden-photos/2023-05_May/P5231450.jpg",
    "/garden-photos/2023-05_May/P5231451.jpg",
    "/garden-photos/2023-05_May/P5231453.jpg",
  ],
  "June 2023": [
    "/garden-photos/2023-06_June/P6071487.jpg",
    "/garden-photos/2023-06_June/P6071489.jpg",
    "/garden-photos/2023-06_June/P6071490.jpg",
    "/garden-photos/2023-06_June/P6071493.jpg",
    "/garden-photos/2023-06_June/P6071494.jpg",
    "/garden-photos/2023-06_June/P6071495.jpg",
    "/garden-photos/2023-06_June/P6071497.jpg",
    "/garden-photos/2023-06_June/P6071498.jpg",
    "/garden-photos/2023-06_June/P6071499.jpg",
    "/garden-photos/2023-06_June/P6071501.jpg",
    "/garden-photos/2023-06_June/P6071503.jpg",
    "/garden-photos/2023-06_June/P6071504.jpg",
    "/garden-photos/2023-06_June/P6071505.jpg",
    "/garden-photos/2023-06_June/P6071506.jpg",
    "/garden-photos/2023-06_June/P6071508.jpg",
    "/garden-photos/2023-06_June/site-of-planned-sensory-garden-P6071509.jpg",
  ],
  "July 2023": [
    "/garden-photos/2023-07_July/20230701_113116.jpg",
    "/garden-photos/2023-07_July/20230701_113228.jpg",
    "/garden-photos/2023-07_July/20230701_113453.jpg",
  ],
  "August 2023": [
    "/garden-photos/2023-08_August/P8041547.jpg",
    "/garden-photos/2023-08_August/P8041548.jpg",
    "/garden-photos/2023-08_August/P8041549.jpg",
    "/garden-photos/2023-08_August/P8041550.jpg",
    "/garden-photos/2023-08_August/P8041551.jpg",
    "/garden-photos/2023-08_August/P8041552.jpg",
    "/garden-photos/2023-08_August/P8041553.jpg",
    "/garden-photos/2023-08_August/P8041554.jpg",
    "/garden-photos/2023-08_August/P8041555.jpg",
    "/garden-photos/2023-08_August/P8041559.jpg",
    "/garden-photos/2023-08_August/P8041560.jpg",
    "/garden-photos/2023-08_August/P8041561.jpg",
    "/garden-photos/2023-08_August/P8041562.jpg",
    "/garden-photos/2023-08_August/P8041563.jpg",
    "/garden-photos/2023-08_August/P8041564.jpg",
    "/garden-photos/2023-08_August/P8041565.jpg",
  ],
  "Christmas 2023": [
    "/garden-photos/2023-12_Christmas/20231202_092650.jpg",
    "/garden-photos/2023-12_Christmas/20231202_092731.jpg",
    "/garden-photos/2023-12_Christmas/20231202_092921.jpg",
    "/garden-photos/2023-12_Christmas/20231202_093018.jpg",
    "/garden-photos/2023-12_Christmas/20231202_093037.jpg",
    "/garden-photos/2023-12_Christmas/20231202_093054.jpg",
  ],
};

export default function GardenGallery() {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const activeSeason = seasons[sliderIndex];
  const currentPhotos = galleryData[activeSeason.label];

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-emerald-900 mb-4 font-headline">
          Hub Garden
        </h1>
        <p className="text-center text-gray-500 mb-12">
          A visual journey of our community garden project.
        </p>

        {/* Volunteer Section */}
        <div className="mb-14 bg-emerald-50 border border-emerald-200 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-bold text-emerald-900 font-headline">Volunteer as a Gardener</h2>
            <p className="text-gray-600 leading-relaxed">
              Want to get your hands dirty for a great cause? Our gardening group meets on <strong>Saturday mornings</strong> to tend the Hub gardens.
              Whether you're an experienced gardener or a complete beginner, you're welcome to come along, learn from our friendly team, and enjoy some time outdoors in good company.
            </p>
            <p className="text-gray-600">
              Get in touch and we'll let you know when to join us.
            </p>
          </div>
          <a
            href="mailto:bishopshullhub@gmail.com?subject=Garden%20Volunteer%20Interest"
            className="shrink-0 inline-flex items-center justify-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            Get Involved
          </a>
        </div>

        {/* Timeline Slider */}
        <div className="mb-14 px-4">
          {/* Active season label */}
          <p className="text-center text-emerald-700 font-semibold text-lg mb-6">
            {activeSeason.icon} {activeSeason.label}
          </p>

          <SliderPrimitive.Root
            min={0}
            max={seasons.length - 1}
            step={1}
            value={[sliderIndex]}
            onValueChange={([val]) => setSliderIndex(val)}
            className="relative flex items-center select-none touch-none w-full h-8"
          >
            <SliderPrimitive.Track className="relative h-2 w-full rounded-full bg-emerald-100 grow">
              <SliderPrimitive.Range className="absolute h-full rounded-full bg-emerald-500" />

              {/* Tick marks */}
              {seasons.map((_, i) => {
                const pct = (i / (seasons.length - 1)) * 100;
                return (
                  <span
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-300"
                    style={{ left: `calc(${pct}% - 4px)` }}
                  />
                );
              })}
            </SliderPrimitive.Track>

            <SliderPrimitive.Thumb className="block w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 cursor-grab active:cursor-grabbing" />
          </SliderPrimitive.Root>

          {/* Labels beneath the slider */}
          <div className="relative mt-3 w-full">
            {seasons.map((s, i) => {
              const pct = (i / (seasons.length - 1)) * 100;
              return (
                <button
                  key={s.label}
                  onClick={() => setSliderIndex(i)}
                  className={`absolute -translate-x-1/2 text-xs font-medium transition-colors ${
                    i === sliderIndex
                      ? "text-emerald-700 font-bold"
                      : "text-gray-400 hover:text-emerald-500"
                  }`}
                  style={{ left: `${pct}%` }}
                >
                  {s.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {currentPhotos.map((src, i) => (
              <motion.div
                key={src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative h-64 overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                onClick={() => {
                  setPhotoIndex(i);
                  setOpen(true);
                }}
              >
                <Image
                  src={src}
                  alt={`Garden scene — ${activeSeason.label}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={photoIndex}
          slides={currentPhotos.map((src) => ({ src }))}
        />
      </div>
    </section>
  );
}
