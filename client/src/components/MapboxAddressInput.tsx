"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { MapPin } from "lucide-react";

import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

// Load access token
const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error("Mapbox access token is not defined in the environment variables.");
}
mapboxgl.accessToken = accessToken;

type Props = {
  label?: string;
  helpText?: string;
  onSelect: (address: string, coords: { lat: number; lng: number }) => void;
};

const MapboxAddressInput = ({
  onSelect,
  label = "Where is your property located?",
  helpText,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);

  useEffect(() => {
    if (!containerRef.current || geocoderRef.current) return;

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken as string,
      placeholder: "Search city, street or postcode",
      countries: "IE",
      marker: false,
      flyTo: false,
      // Removed unsupported 'render' property
    });

    geocoder.addTo(containerRef.current);

    // Wait for input to mount and restyle it
    setTimeout(() => {
      const input = containerRef.current?.querySelector("input");
      const geocoderIcon = containerRef.current?.querySelector(
        ".mapboxgl-ctrl-geocoder--icon"
      );

      // Remove magnifier icon
      if (geocoderIcon) {
        (geocoderIcon as HTMLElement).style.display = "none";
      }

      if (input) {
        input.className = `
          w-full
          rounded-full
          bg-gray-100
          text-gray-900
          placeholder-gray-500
          font-medium
          text-sm
          py-3
          pl-12
          pr-4
          border border-gray-300
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-black
          focus:border-black
          transition-all
          duration-200
        `.replace(/\s+/g, " ");
      }
    }, 100);

    geocoder.on("result", (e) => {
      const result = e.result;
      const address = result.place_name;
      const [lng, lat] = result.center;
      onSelect(address, { lat, lng });
    });

    geocoderRef.current = geocoder;

    return () => {
      geocoderRef.current?.clear();
    };
  }, [onSelect]);

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {/* 🧭 Map pin icon inside input */}
        <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        <div ref={containerRef} className="w-full" />
      </div>
      {helpText && (
        <p className="text-xs text-gray-500 mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default MapboxAddressInput;
