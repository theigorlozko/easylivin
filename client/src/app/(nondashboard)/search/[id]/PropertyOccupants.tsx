"use client";

import { useGetPropertyQuery } from "@/state/api";
import React from "react";

const PropertyOccupants = ({ propertyId }: { propertyId: number }) => {
  const { data: property, isError, isLoading } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) return <>Property not found</>;

  const { currentOccupantsDescription, lookingFor } = property;

  return (
    <div className="mb-12">
      {/* Heading outside the box */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Occupants & Preferences
      </h2>

      {/* Info Box */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-8">
        {currentOccupantsDescription && (
          <div>
            <h3 className="text-sm font-semibold text-primary-700 mb-2">
              Current Occupants
            </h3>
            <p className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 leading-6 whitespace-pre-line">
              {currentOccupantsDescription}
            </p>
          </div>
        )}

        {lookingFor && (
          <div>
            <h3 className="text-sm font-semibold text-primary-700 mb-2">
              Preferred New Tenant
            </h3>
            <p className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 leading-6 whitespace-pre-line">
              {lookingFor}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyOccupants;
