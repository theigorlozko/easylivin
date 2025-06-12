"use client";

import { useGetPropertyQuery } from "@/state/api";
import React from "react";

const RoomAndPricingSummary = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) return <>Property not found.</>;

  return (
    <div className="mb-8">
      {/* Heading outside the box */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Room Pricing & Lease Details
      </h2>

      {/* Card container */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm text-gray-800">
          {/* Pricing Section */}
          <div>
            <h3 className="text-base font-semibold text-primary-800 mb-4">Pricing</h3>
            <ul className="space-y-4">
              <DetailItem label="Monthly Rent" value={`€${property.pricePerMonth.toLocaleString()}`} valueColor="text-green-700" />
              <DetailItem label="Security Deposit" value={`€${property.securityDeposit.toLocaleString()}`} />
              <DetailItem label="Application Fee" value={`€${property.applicationFee.toLocaleString()}`} />
            </ul>
          </div>

          {/* Lease Section */}
          <div>
            <h3 className="text-base font-semibold text-primary-800 mb-4">Lease</h3>
            <ul className="space-y-4">
              <DetailItem label="Lease Length" value={property.leaseLength} />
              <DetailItem label="Term Range" value={`${property.minTerm} – ${property.maxTerm} months`} />
              <DetailItem
                label="Available From"
                value={new Date(property.availableFrom).toLocaleDateString("en-IE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAndPricingSummary;

// Reusable display block
const DetailItem = ({
  label,
  value,
  valueColor = "text-gray-800",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <li className="flex justify-between items-center border border-gray-100 bg-gray-50 rounded-md px-4 py-3 hover:bg-gray-100 transition">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
  </li>
);
