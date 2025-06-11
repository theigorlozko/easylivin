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
    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-primary-800 mb-6">
        Room Pricing / Lease
      </h2>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8 text-sm text-gray-800">
          {/* Pricing Section */}
          <div className="flex-1 pr-0 lg:pr-6">
            <h3 className="text-lg font-semibold text-primary-800 mb-4">Pricing</h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Monthly Rent</p>
                <p className="text-lg font-semibold text-green-700">
                  €{property.pricePerMonth.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Security Deposit</p>
                <p className="text-lg font-semibold">
                  €{property.securityDeposit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-gray-200" />

          {/* Lease Section */}
          <div className="flex-1 pl-0 lg:pl-6">
            <h3 className="text-lg font-semibold text-primary-800 mb-4">Lease</h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Lease Length</p>
                <p className="text-lg font-semibold">{property.leaseLength}</p>
              </div>

              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Term Range</p>
                <p className="text-lg font-semibold">
                  {property.minTerm} – {property.maxTerm} months
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Available From</p>
                <p className="text-lg font-semibold">
                  {new Date(property.availableFrom).toLocaleDateString("en-IE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAndPricingSummary;
