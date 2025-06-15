import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/state/api";
import { useAppSelector } from "@/state/redux";
import { Property } from "@/types/prismaTypes";
import Card from "@/components/Card";
import React from "react";
import CardCompact from "@/components/CardCompact";
import Link from "next/link";

const Listings = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const userRole = authUser?.userRole; // Determine the user role (manager or tenant)

  // Fetch tenant data only if the user is a tenant
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo?.userId || "",
    {
      skip: userRole !== "tenant", // Skip query if the user is not a tenant
    }
  );

  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  const handleFavoriteToggle = async (propertyId: number) => {
    if (!authUser || userRole !== "tenant") return; // Only tenants can toggle favorites

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

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  return (
    <div className="px-2 w-full">
      <div className="flex">
        <div className=" w-full">
          {properties?.map((property) =>
          <Link key={property.id} href={`/search/${property.id}`} scroll={false}>
              <Card
                key={property.id}
                property={property}
                isFavorite={
                  userRole === "tenant" &&
                  tenant?.favorites?.some(
                    (fav: Property) => fav.id === property.id
                  )
                }
                onFavoriteToggle={() =>
                  userRole === "tenant" && handleFavoriteToggle(property.id)
                }
                showFavoriteButton={userRole === "tenant"}
                // propertyLink={`/search/${property.id}`}
              />
              </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;