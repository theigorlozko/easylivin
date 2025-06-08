"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setFilters } from "@/state";
import { Map } from "lucide-react"; 

const HeroSection = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleLocationSearch = async () => {
    try {
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) return;

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          trimmedQuery
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        dispatch(
          setFilters({
            location: trimmedQuery,
            coordinates: [lat, lng],
          })
        );
        const params = new URLSearchParams({
          location: trimmedQuery,
          lat: lat.toString(),
          lng: lng,
        });
        router.push(`/search?${params.toString()}`);
      }
    } catch (error) {
      console.error("error search location:", error);
    }
  };
  const handleNavigateToSearch = () => {
    router.push("/search");
  };

  return (
    <div className="relative h-[65vh] sm:h-[60vh] w-full">
      <Image
        src="/movingin2.jpg"
        alt="Rentiful Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/40"></div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-8 text-center"
      >
        <div className="max-w-xl w-full flex flex-col items-center space-y-4 sm:space-y-6">
          <h1 className="text-white text-2xl sm:text-4xl font-bold leading-snug sm:leading-tight">
            Start your journey to finding the perfect place to call home
          </h1>
          <p className="text-white text-sm sm:text-lg">
            Browse trusted house shares, rooms, and rentals tailored to your lifestyle.
          </p>
          <Button
        onClick={handleNavigateToSearch}
        className="relative overflow-hidden text-white font-semibold tracking-wide rounded-full px-10 py-5 text-lg sm:text-xl group transition-all duration-300 ease-in-out bg-gradient-to-r from-green-500 to-emerald-600 shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-100"
      >
        <span className="relative z-10 flex items-center gap-4">
          <Map className="w-8 h-8 sm:w-10 sm:h-10" />
          Discover
        </span>

        <span className="absolute inset-0 bg-white/10 group-hover:blur-md group-hover:opacity-30 transition duration-300 ease-in-out rounded-full"></span>
      </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
