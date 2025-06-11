"use client";

import { useGetPropertyQuery } from "@/state/api";
import React from "react";

const PropertyOccupants = ({ propertyId }: { propertyId: number }) => {
  const { data: property, isError, isLoading } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) return <>Property not found</>;

  const { currentOccupantsDescription, lookingFor } = property;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Occupants & Preferences
      </h2>

      <div className="space-y-6">
        {currentOccupantsDescription && (
          <div>
            <h3 className="text-sm font-semibold text-primary-700 mb-1">
              Current Occupants
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-6">
              {currentOccupantsDescription}
            </div>
          </div>
        )}

        {lookingFor && (
          <div>
            <h3 className="text-sm font-semibold text-primary-700 mb-1">
              Preferred New Tenant
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-6">
              {lookingFor}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyOccupants;
