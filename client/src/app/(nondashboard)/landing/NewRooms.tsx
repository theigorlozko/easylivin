"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetPropertiesQuery } from "@/state/api";
import { Property } from "@/types/prismaTypes";
import { Bath, Bed, House, Star } from "lucide-react";

const NewRooms = () => {
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery({});

  if (isLoading)
    return <div className="px-6 sm:px-16">Loading new rooms...</div>;
  if (isError || !properties)
    return <div className="px-6 sm:px-16">Failed to load properties.</div>;

  return (
    <section className="mt-16 mb-20 px-6 sm:px-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
          New Rooms
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...properties]
          .sort(
            (a, b) =>
              new Date(b.postedDate).getTime() -
              new Date(a.postedDate).getTime()
          )
          .slice(0, 15)
          .map((property: Property) => (
            <Link
              key={property.id}
              href={`/search/${property.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 w-full bg-gray-100">
                <Image
                  src={property.photoUrls?.[0] || "/placeholder.jpg"}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                  {property.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 truncate">
                  {property?.location?.address}, {property?.location?.city}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                   <span className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                            {property.averageRating.toFixed(1)} ({property.numberOfReviews}{" "}
                            Reviews)
                        </span>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    €{property.pricePerMonth.toFixed(0)}{" "}
                    <span className="text-gray-500 text-sm font-normal">
                      /month
                    </span>
                  </p>
                </div>

                <hr />

                <div className="flex justify-between items-center gap-4 text-gray-600 mt-5 text-sm">
                  <span className="flex items-center">
                    <Bed className="w-5 h-5 mr-2" />
                    {property.beds} Bed
                  </span>
                  <span className="flex items-center">
                    <Bath className="w-5 h-5 mr-2" />
                    {property.baths} Bath
                  </span>
                  <span className="flex items-center">
                    <House className="w-5 h-5 mr-2" />
                    {property.squareFeet} sq ft
                  </span>
                </div>
              </div>
            </Link>
          ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/search"
          className="inline-flex items-center text-green-600 font-medium text-sm"
        >
          View all <span className="ml-1">→</span>
        </Link>
      </div>
    </section>
  );
};

export default NewRooms;
