"use client";

import { useGetAuthUserQuery } from "@/state/api";
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
  const { data: authUser } = useGetAuthUserQuery();

  return (
    <div>
      <ImagePreviews
        images={["/singlelisting-2.jpg", "/singlelisting-3.jpg"]}
      />
     <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 mb-16">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="order-2 lg:order-1 w-full lg:w-2/3">
            <PropertyOverview propertyId={propertyId} />
            <PropertyInformation propertyId={propertyId} />
            <RoomAndPricingSummary propertyId={propertyId} />
            <PropertyOccupants propertyId={propertyId} />
            <RoomInformation propertyId={propertyId} />
            <PropertyDetails propertyId={propertyId} />
            <PropertyLocation propertyId={propertyId} />
            <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <ReviewForm propertyId={propertyId} />
            <ReviewsList propertyId={propertyId} />
          </div>
          </div>

          <div className="order-1 lg:order-2 w-full lg:w-1/3">
            <ContactWidget onOpenModal={() => setIsModalOpen(true)} />
              <div className="mt-4"></div>
            <RoomAndPricingSummary propertyId={propertyId} />
          </div>
        </div>
      </div>

      {authUser && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={propertyId}
        />
      )}
    </div>
  );
};

export default SingleListing;
