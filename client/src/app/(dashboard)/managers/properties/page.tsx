"use client";

import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetAuthUserQuery, useGetManagerPropertiesQuery } from "@/state/api";
import Link from "next/link";
import React from "react";
import { Pencil } from "lucide-react"; // Pencil icon from lucide

const Properties = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: managerProperties,
    isLoading,
    error,
  } = useGetManagerPropertiesQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading manager properties</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="My Properties"
        subtitle="View and manage your property listings"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {managerProperties?.map((property) => (
          <div key={property.id} className="relative group">
            <Link href={`/search/${property.id}`} scroll={false}>
              <Card
                property={property}
                isFavorite={false}
                onFavoriteToggle={() => {}}
                showFavoriteButton={false}
              />
            </Link>

            {/* Edit Button overlaid on card */}
            <Link
              href={`/managers/properties/${property.id}/edit`}
              className="absolute top-2 right-2 z-10 flex items-center gap-1 text-sm font-medium bg-orange-100 text-orange-600 px-2 py-1 rounded-lg shadow hover:bg-orange-200 transition-all"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
          </div>
        ))}
      </div>

      {(!managerProperties || managerProperties.length === 0) && (
        <p>You don&rsquo;t manage any properties</p>
      )}
    </div>
  );
};

export default Properties;
