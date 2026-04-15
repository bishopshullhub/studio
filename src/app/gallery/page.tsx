"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Updated with actual file paths from the folder structure
const galleryData = {
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
    "/garden-photos/2023-05_May/P5231453.jpg"
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
    "/garden-photos/2023-06_June/site-of-planned-sensory-garden-P6071509.jpg"
  ],
  "July 2023": [
    "/garden-photos/2023-07_July/20230701_113116.jpg",
    "/garden-photos/2023-07_July/20230701_113228.jpg",
    "/garden-photos/2023-07_July/20230701_113453.jpg"
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
    "/garden-photos/2023-08_August/P8041565.jpg"
  ],
  "Christmas 2023": [
    "/garden-photos/2023-12_Christmas/20231202_092650.jpg",
    "/garden-photos/2023-12_Christmas/20231202_092731.jpg",
    "/garden-photos/2023-12_Christmas/20231202_092921.jpg",
    "/garden-photos/2023-12_Christmas/20231202_093018.jpg",
    "/garden-photos/2023-12_Christmas/20231202_093037.jpg",
    "/garden-photos/2023-12_Christmas/20231202_093054.jpg"
  ]
};

export default function SeasonGallery() {
  const [activeTab, setActiveTab] = useState("May 2023");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const currentPhotos = galleryData[activeTab as keyof typeof galleryData];

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto pt-20">
        <h2 className="text-4xl font-bold text-center text-emerald-900 mb-4">Hub Gardens Through the Seasons</h2>
        <p className="text-center text-gray-500 mb-10">A visual journey of our community garden project.</p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Object.keys(galleryData).map((season) => (
            <button
              key={season}
              onClick={() => setActiveTab(season)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === season 
                  ? "bg-emerald-600 text-white shadow-md" 
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              {season}
            </button>
          ))}
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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative h-64 overflow-hidden rounded-xl cursor-pointer"
                onClick={() => { setIndex(i); setOpen(true); }}
              >
                <Image
                  src={src}
                  alt={`Garden scene ${activeTab}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox for Zoom */}
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={currentPhotos.map(src => ({ src }))}
        />
      </div>
    </section>
  );
}
