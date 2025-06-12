import { Bed, Calendar, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Card = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardProps) => {
  const [imgSrc, setImgSrc] = useState(
    property.photoUrls?.[0] || "/placeholder.jpg"
  );

  const formattedDate = new Date(property.availableFrom).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="relative group w-full">
  {/* Favorite button must be here, above the Link */}
  {showFavoriteButton && (
    <button
      className="absolute top-4 right-4 bg-white hover:bg-white/90 rounded-full p-2 cursor-pointer z-30 shadow-md"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteToggle();
      }}
    >
      <Heart
        className={`w-5 h-5 ${
          isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
        }`}
      />
    </button>
  )}

  {/* Clickable card */}
  <Link href={propertyLink ?? "#"} scroll={false}>
    <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full mb-5">
      <div className="relative">
        <div className="w-full h-48 relative">
          <Image
            src={imgSrc}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 780px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc("/placeholder.jpg")}
          />
        </div>

        <div className="absolute bottom-4 left-4 flex gap-2">
          {property.isPetsAllowed && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Pets Allowed
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Parking Included
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-1 text-gray-900 ">
          {property.name}
        </h2>
        <p className="text-gray-600 mb-2">
          {property?.location?.address}, {property?.location?.city}
        </p>

        <div className="flex justify-between items-center">
          <span className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 mr-1 fill-current" />
            {property.averageRating.toFixed(1)} ({property.numberOfReviews} Reviews)
          </span>
          <p className="text-lg font-bold mb-3">
            ${property.pricePerMonth.toFixed(0)}{" "}
            <span className="text-gray-600 text-base font-normal">/month</span>
          </p>
        </div>

        <hr />

        <div className="flex justify-between items-center gap-4 text-gray-600 mt-5">
          <span className="flex items-center">
            <Bed className="w-5 h-5 mr-2" />
            {property.roomType.replace(/([a-z])([A-Z])/g, "$1 $2")}
          </span>
          <span className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            From: {formattedDate}
          </span>
        </div>
      </div>
    </div>
  </Link>
</div>
  );
};

export default Card;
