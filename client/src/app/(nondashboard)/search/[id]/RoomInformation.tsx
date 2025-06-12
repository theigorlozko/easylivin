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
    <div className="mb-8 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">🛏️ Room Information</h2>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-10 flex-1">
        {/* Core Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 text-sm text-gray-800">
          <InfoRow label="Room Type" value={formatEnum(property.roomType)} />
          <ColoredInfoRow
            label="Owner Occupied"
            value={property.isOwnerOccupied ? "Yes" : "No"}
            isPositive={property.isOwnerOccupied}
          />
          <ColoredInfoRow
            label="Reference Required"
            value={property.isRefNeeded ? "Yes" : "No"}
            isPositive={property.isRefNeeded}
          />
          <ColoredInfoRow
            label="Smokers Allowed"
            value={property.isSmokers ? "Yes" : "No"}
            isPositive={property.isSmokers}
          />
        </div>

        {/* Room Amenities */}
        {property.roomAmenities?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🎒 Room Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {property.roomAmenities.map((item: string) => (
                <span
                  key={item}
                  className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 border border-gray-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        {property.roomAdInfo && (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <InfoCard title="Additional Information" content={property.roomAdInfo} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomInformation;

// Subcomponents
const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="space-y-1">
    <p className="text-gray-500">{label}</p>
    <p className="text-gray-800 font-medium">{value}</p>
  </div>
);

const ColoredInfoRow = ({
  label,
  value,
  isPositive,
}: {
  label: string;
  value: string;
  isPositive: boolean;
}) => {
  const color = isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
  return (
    <div className="space-y-1">
      <p className="text-gray-500">{label}</p>
      <p className={`font-medium rounded px-2 py-1 inline-block text-sm ${color}`}>
        {value}
      </p>
    </div>
  );
};

const InfoCard = ({ title, content }: { title: string; content: string }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
    <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
  </div>
);

// Helper
const formatEnum = (value: string) =>
  value.replace(/([a-z])([A-Z])/g, "$1 $2");
