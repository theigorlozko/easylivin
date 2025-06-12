import {
  useGetAuthUserQuery,
  useGetTenantQuery,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useGetPropertyQuery,
} from "@/state/api";
import { Heart, MapPin, Star } from "lucide-react";
import React, { useState } from "react";

const MAX_LENGTH = 1050;

const PropertyOverview = ({ propertyId }: PropertyOverviewProps) => {
  const { data: property, isError, isLoading } = useGetPropertyQuery(propertyId);
  const [showFull, setShowFull] = useState(false);

  const { data: authUser } = useGetAuthUserQuery();
  const userRole = authUser?.userRole;

  const { data: tenant } = useGetTenantQuery(authUser?.cognitoInfo?.userId || "", {
    skip: userRole !== "tenant",
  });

  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();

  const isFavorite = tenant?.favorites?.some((fav: { id: number; }) => fav.id === propertyId);

  const handleFavoriteToggle = async () => {
    if (!authUser || userRole !== "tenant") return;

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
  if (isError || !property) return <>Property not Found</>;

  const toggleShow = () => setShowFull((prev) => !prev);
  const isLong = property.description.length > MAX_LENGTH;
  const displayedText = showFull
    ? property.description
    : property.description.slice(0, MAX_LENGTH) + (isLong ? "..." : "");

  return (
    <div className="mb-12">
      {/* Title and Favorite */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>

        {userRole === "tenant" && (
          <button
            className="bg-white hover:bg-gray-100 rounded-full p-2 border border-gray-300"
            onClick={handleFavoriteToggle}
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"
              }`}
            />
          </button>
        )}
      </div>

      {/* Info Row */}
      <div className="flex justify-between items-center flex-wrap text-sm text-gray-600 mb-6 gap-4">
        <div className="flex items-center leading-none">
          <MapPin className="w-4 h-4 mr-1 text-gray-700" />
          {property.location?.address}, {property.location?.city}, {property.location?.state}, {property.location?.country}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center leading-none text-yellow-500">
            <Star className="w-4 h-4 mr-1 fill-current" />
            <span className="font-semibold text-gray-800">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="ml-1 text-gray-500">
              ({property.numberOfReviews} reviews)
            </span>
          </div>
          <span className="text-green-600 font-medium leading-none">
            Verified Listing
          </span>
        </div>
      </div>

      {/* Description Box */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold text-primary-800 mb-4">
          About this place
        </h2>
        <p className="text-gray-600 leading-7 whitespace-pre-line">
          {displayedText}
        </p>

        {isLong && (
          <button
            className="mt-2 text-sm text-primary-700 font-semibold underline hover:text-primary-900"
            onClick={toggleShow}
          >
            {showFull ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyOverview;






{/* Details
      <div className="border border-primary-200 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center gap-4 px-5">
          <div>
            <div className="text-sm text-gray-500">Monthly Rent</div>
            <div className="font-semibold">
              ${property.pricePerMonth.toLocaleString()}
            </div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Bedrooms</div>
            <div className="font-semibold">{property.beds} bd</div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Bathrooms</div>
            <div className="font-semibold">{property.baths} ba</div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Square Feet</div>
            <div className="font-semibold">
              {property.squareFeet.toLocaleString()} sq ft
            </div>
          </div>
        </div>
      </div> */}
