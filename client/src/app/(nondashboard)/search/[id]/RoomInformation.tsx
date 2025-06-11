"use client";

import { useGetPropertyQuery } from "@/state/api";
import React from "react";

const RoomInformation = ({ propertyId }: { propertyId: number }) => {
  const {
    data: property,
    isLoading,
    isError,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) return <>Room not found.</>;

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-primary-800 mb-6">
        Room Information
      </h2>

      {/* Outer Container */}
      <div className="bg-white border border-gray-300 rounded-2xl p-8 shadow-sm space-y-10">

        {/* Core Room Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 text-sm text-gray-800">
          <InfoBlock label="Room Type" value={formatEnum(property.roomType)} />
          <InfoBlock
            label="Owner Occupied"
            value={property.isOwnerOccupied ? "Yes" : "No"}
          />
          <InfoBlock
            label="Reference Required"
            value={property.isRefNeeded ? "Yes" : "No"}
          />
          <InfoBlock
            label="Smokers Allowed"
            value={property.isSmokers ? "Yes" : "No"}
          />
        </div>

        {/* Room Amenities */}
        {property.roomAmenities?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-primary-800 mb-3">
              Room Amenities
            </h3>
            <div className="flex flex-wrap gap-3">
              {property.roomAmenities.map((item: string) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        {(property.roomAdInfo || property.lookingFor) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {property.lookingFor && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-primary-800 mb-2">Looking For</h3>
                <p className="text-gray-700 leading-relaxed">{property.lookingFor}</p>
              </div>
            )}
            {property.roomAdInfo && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-primary-800 mb-2">Additional Information</h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {property.roomAdInfo}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomInformation;

// Reusable block
const InfoBlock = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="space-y-1">
    <h3 className="text-lg font-semibold text-primary-800 mb-3">{label}</h3>
    <p className="text-gray-500 font-medium">{value}</p>
  </div>
);

// Helper function
const formatEnum = (value: string) =>
  value.replace(/([a-z])([A-Z])/g, "$1 $2");
