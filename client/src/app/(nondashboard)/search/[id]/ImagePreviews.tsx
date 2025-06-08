"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ImagePreviews = ({ images }: ImagePreviewsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 mt-6 ">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Main image */}
        <div className="relative h-[300px] sm:h-[500px] w-full sm:w-[80%] rounded-xl overflow-hidden shadow-md">
          {images.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={image}
                alt={`Property Image ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover h-full"
              />
            </div>
          ))}
          {/* Optional arrows */}
          <button
            onClick={() =>
              setCurrentImageIndex(
                currentImageIndex === 0
                  ? images.length - 1
                  : currentImageIndex - 1
              )
            }
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-20"
            aria-label="Previous image"
          >
            <ChevronLeft className="text-gray-700 w-5 h-5" />
          </button>
          <button
            onClick={() =>
              setCurrentImageIndex(
                currentImageIndex === images.length - 1
                  ? 0
                  : currentImageIndex + 1
              )
            }
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-20"
            aria-label="Next image"
          >
            <ChevronRight className="text-gray-700 w-5 h-5" />
          </button>
        </div>

        {/* Thumbnails (vertical on desktop) */}
        <div className="hidden sm:flex flex-col gap-3 w-[20%] max-h-[500px] overflow-y-auto pr-1">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative h-[80px] w-full rounded-lg overflow-hidden cursor-pointer border ${
                index === currentImageIndex
                  ? "border-green-600"
                  : "border-gray-200"
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover hover:opacity-80"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImagePreviews;
