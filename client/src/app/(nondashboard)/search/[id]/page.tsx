"use client";

import { useGetAuthUserQuery, useGetPropertyQuery } from "@/state/api";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import ImagePreviews from "./ImagePreviews";
import PropertyOverview from "./PropertyOverview";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import ContactWidget from "./ContactWidget";
import ApplicationModal from "./ApplicationModal";
import RoomAndPricingSummary from "./RoomAndPricingSummary";
import RoomInformation from "./RoomInformation";
import PropertyInformation from "./PropertyInformation";
import PropertyOccupants from "./PropertyOccupants";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewList";

const SingleListing = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRevModalOpen, setIsRevModalOpen] = useState(false);
  const { data: authUser } = useGetAuthUserQuery();
  const { data: property, isLoading, isError } = useGetPropertyQuery(propertyId);

  return (
    <div>
      <ImagePreviews
        images={["/singlelisting-2.jpg", "/singlelisting-3.jpg"]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 mb-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="order-2 lg:order-1 w-full lg:w-2/3">
            <PropertyOverview propertyId={propertyId} />
            <PropertyInformation propertyId={propertyId} />
            {/* <PropertyOccupants propertyId={propertyId} /> */}
            {/* <RoomInformation propertyId={propertyId} />
            <RoomAndPricingSummary propertyId={propertyId} /> */}
            {/* <PropertyDetails propertyId={propertyId} /> */}
          </div>

          {/* Sidebar */}
          <div className="order-1 lg:order-2 w-full lg:w-1/3">
            {property && (
              <ContactWidget onOpenModal={() => setIsModalOpen(true)} property={property} />
            )}
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="mt-2">

          {/* Side-by-side Room Info + Pricing Summary */}
          <div className="flex flex-col lg:flex-row gap-8 mb-4">
          <div className="w-full">
            <PropertyOccupants propertyId={propertyId} /> 
          </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 mb-4">
            <div className="w-full lg:w-1/2">
              <RoomInformation propertyId={propertyId} />
            </div>
            <div className="w-full lg:w-1/2">
              <RoomAndPricingSummary propertyId={propertyId} />
            </div>
          </div>
          <PropertyLocation propertyId={propertyId} />
        </div>

        <div className="mt-2">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          <div className="mb-4">
            <button
              onClick={() => setIsRevModalOpen(true)}
              className="inline-flex mb-2 items-center px-4 py-2 rounded-full bg-black text-white text-sm font-medium shadow hover:bg-gray-800 transition duration-150 ease-in-out"
            >
              ✍️ Write a Review
            </button>
          </div>
          <ReviewsList propertyId={propertyId} />
        </div>
      </div>

      {/* Application Modal */}
      {authUser && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={propertyId}
        />
      )}

      {/* Review Modal */}
      <ReviewForm
        isOpen={isRevModalOpen}
        onClose={() => setIsRevModalOpen(false)}
        propertyId={propertyId}
      />
    </div>
  );
};

export default SingleListing;
