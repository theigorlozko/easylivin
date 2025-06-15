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
  const isTenant = authUser?.userRole  === "tenant";
  const isManager = authUser?.userRole === "manager";

  console.log (authUser?.userRole, "authUser role");

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
          <div className="order-1 lg:order-2 w-full lg:w-1/3 relative">
            {property ? (
              authUser ? (
                <ContactWidget onOpenModal={() => setIsModalOpen(true)} property={property} />
              ) : (
                <div className="relative">
                  <div className="blur-sm pointer-events-none select-none">
                    <ContactWidget onOpenModal={() => {}} property={property} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                    <div className="text-center">
                      <p className="text-sm font-medium mb-2">Sign in to contact</p>
                      <div className="flex gap-2 justify-center">
                        <button
                          className="px-4 py-1 bg-black text-white rounded-full text-sm"
                          onClick={() => window.location.href = "/signin"}
                        >
                          Sign In
                        </button>
                        <button
                          className="px-4 py-1 border border-black text-black rounded-full text-sm"
                          onClick={() => window.location.href = "/signup"}
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center text-gray-500">Loading contact info...</div>
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
          
        <div className="mt-2">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>

          {authUser ? (
            <>
              {/* Only tenants can write a review */}
              {isTenant && (
                <div className="mb-4">
                  <button
                    onClick={() => setIsRevModalOpen(true)}
                    className="inline-flex mb-2 items-center px-4 py-2 rounded-full bg-black text-white text-sm font-medium shadow hover:bg-gray-800 transition duration-150 ease-in-out"
                  >
                    ✍️ Write a Review
                  </button>
                </div>
              )}

              {/* All authenticated users (tenant/manager) can see reviews */}
              <ReviewsList propertyId={propertyId} />
            </>
          ) : (
            // Blurred view for unauthenticated users
            <div className="relative">
              <div className="blur-sm pointer-events-none select-none">
                <ReviewsList propertyId={propertyId} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">
                    Sign in to view and write reviews
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      className="px-4 py-1 border border-green-600 text-black rounded-full text-sm"
                      onClick={() => (window.location.href = "/signin")}
                    >
                      Sign In
                    </button>
                    <button
                      className="px-4 py-1 bg-green-600 text-white rounded-full text-sm"
                      onClick={() => (window.location.href = "/signup")}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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
