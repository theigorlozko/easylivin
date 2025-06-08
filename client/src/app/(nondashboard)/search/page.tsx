"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import FiltersBar from "./FiltersBar";
import FiltersFull from "./FiltersFull";
import { cleanParams } from "@/lib/utils";
import { setFilters } from "@/state";
import Map from "./Map";
import Listings from "./Listings";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  useEffect(() => {
    const initialFilters = Array.from(searchParams.entries()).reduce(
      (acc: any, [key, value]) => {
        if (key === "priceRange" || key === "squareFeet") {
          acc[key] = value.split(",").map((v) => (v === "" ? null : Number(v)));
        } else if (key === "coordinates") {
          acc[key] = value.split(",").map(Number);
        } else {
          acc[key] = value === "any" ? null : value;
        }

        return acc;
      },
      {}
    );

    const cleanedFilters = cleanParams(initialFilters);
    dispatch(setFilters(cleanedFilters));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
  className='w-full mx-auto px-5 flex flex-col'
  style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
>
  <FiltersBar />
  <div className="flex flex-col md:flex-row flex-1 gap-3 overflow-y-auto md:overflow-hidden">
    {/* Sidebar Filters – Desktop Only */}
    <div
      className={`transition-all duration-300 ease-in-out overflow-auto hidden md:block ${
        isFiltersFullOpen ? "md:w-3/12 opacity-100 visible" : "md:w-0 opacity-0 invisible"
      }`}
    >
      <FiltersFull />
    </div>

    {/* Map – Hidden on Mobile */}
    <div className="hidden md:flex md:basis-5/12 grow relative rounded-xl overflow-hidden">
      <Map />
    </div>

    {/* Listings – Scrolls on both desktop and mobile */}
    <div className="w-full md:basis-4/12 overflow-y-auto">
      <Listings />
    </div>
  </div>
</div>

  );
};

export default SearchPage;
