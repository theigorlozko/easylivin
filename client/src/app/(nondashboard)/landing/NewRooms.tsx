"use client";

import React from "react";
import { useGetAuthUserQuery, useGetPropertiesQuery, useGetTenantQuery, useAddFavoritePropertyMutation, useRemoveFavoritePropertyMutation } from "@/state/api";
import { useAppSelector } from "@/state/redux";
import { Property } from "@/types/prismaTypes";
import Card from "@/components/Card";

const NewRooms = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const userRole = authUser?.userRole;

  const { data: tenant } = useGetTenantQuery(authUser?.cognitoInfo?.userId || "", {
    skip: userRole !== "tenant",
  });

  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();

  const { data: properties, isLoading, isError } = useGetPropertiesQuery({});

  const handleFavoriteToggle = async (propertyId: number) => {
    if (!authUser || userRole !== "tenant") return;

    const isFavorite = tenant?.favorites?.some(
      (fav: Property) => fav.id === propertyId
    );

    if (isFavorite) {
      await removeFavorite({
        cognitoId: authUser.cognitoInfo.userId,
        propertyId,
      });
    } else {
      await addFavorite({
        cognitoId: authUser.cognitoInfo.userId,
        propertyId,
      });
    }
  };

  if (isLoading)
    return <div className="px-6 sm:px-16">Loading new rooms...</div>;
  if (isError || !properties)
    return <div className="px-6 sm:px-16">Failed to load properties.</div>;

  return (
    <section className="mt-16 mb-20 px-6 sm:px-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
          New Rooms
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...properties]
          .sort(
            (a, b) =>
              new Date(b.postedDate).getTime() -
              new Date(a.postedDate).getTime()
          )
          .slice(0, 15)
          .map((property: Property) => (
            <Card
              key={property.id}
              property={property}
              isFavorite={
                userRole === "tenant" &&
                tenant?.favorites?.some((fav: Property) => fav.id === property.id)
              }
              onFavoriteToggle={() =>
                userRole === "tenant" && handleFavoriteToggle(property.id)
              }
              showFavoriteButton={userRole === "tenant"}
              propertyLink={`/search/${property.id}`}
            />
          ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href="/search"
          className="inline-flex items-center text-green-600 font-medium text-sm"
        >
          View all <span className="ml-1">→</span>
        </a>
      </div>
    </section>
  );
};

export default NewRooms;
