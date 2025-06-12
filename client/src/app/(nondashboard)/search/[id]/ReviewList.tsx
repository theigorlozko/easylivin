"use client";

import { useGetPropertyReviewsQuery } from "@/state/api";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { Review } from "@/types/prismaTypes";

// Get bar color based on rating value
const getBarColor = (rating: number) => {
  if (rating <= 1) return "bg-red-500";
  if (rating <= 3) return "bg-orange-400";
  return "bg-green-500";
};

// Render star icons based on rating
const renderStars = (rating: number) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        fill={i < Math.round(rating) ? "#fbbf24" : "none"}
        stroke="#fbbf24"
      />
    ))}
    <span className="ml-2 text-sm font-medium text-gray-800">{rating.toFixed(1)} / 5</span>
  </div>
);

// Format date range nicely
const formatStayDates = (from?: string, to?: string) => {
  if (!from || !to) return null;
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const sameMonth = fromDate.getMonth() === toDate.getMonth();
  return sameMonth
    ? `Stayed in ${format(fromDate, "MMMM yyyy")}`
    : `Stayed from ${format(fromDate, "MMM yyyy")} to ${format(toDate, "MMM yyyy")}`;
};

// Reusable rating line with colored bar
const RatingBar = ({ label, rating }: { label: string; rating: number }) => {
  const barColor = getBarColor(rating);
  const barWidth = `${(rating / 5) * 100}%`;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm text-gray-800">
        <span>{label}</span>
        <span className="font-medium">{rating.toFixed(1)} / 5</span>
      </div>
      <div className="w-full h-2 rounded bg-gray-200 overflow-hidden mt-1">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: barWidth }}
        ></div>
      </div>
    </div>
  );
};

const ReviewsList = ({ propertyId }: { propertyId: number }) => {
  const { data: reviews, isLoading, isError } = useGetPropertyReviewsQuery(propertyId);

  if (isLoading) return <p className="text-sm text-gray-500">Loading reviews...</p>;
  if (isError || !reviews) return <p className="text-sm text-red-500">Failed to load reviews.</p>;

  return (
    <div className="space-y-10 mb-20">
      {reviews.map((review: Review) => (
        <div
          key={review.id}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-base font-semibold text-gray-900">{review.tenant.name}</h3>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  review.wouldRecommend
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {review.wouldRecommend ? "Would recommend" : "Would not recommend"}
              </span>
            </div>
            {renderStars(review.totalRating)}
          </div>
  
          {/* Summary & Content */}
          {review.summary && (
            <p className="text-sm italic text-gray-700 mb-2">“{review.summary}”</p>
          )}
          <p className="text-sm text-gray-800 mb-3 leading-relaxed">{review.content}</p>
  
          {/* Stay Dates */}
          {formatStayDates(review.dateFrom, review.dateTo) && (
            <p className="text-xs text-gray-500 mb-5">
              {formatStayDates(review.dateFrom, review.dateTo)}
            </p>
          )}
  
          {/* Ratings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Manager Section */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🧑‍💼</span>
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Manager</h4>
              </div>
              <RatingBar label="Communication" rating={review.managerCommunicationRating} />
              <RatingBar label="Response" rating={review.managerResponseRating} />
              {review.managerComment && (
                <p className="mt-3 text-gray-600 italic border-t pt-2 text-xs">“{review.managerComment}”</p>
              )}
            </div>
  
            {/* Property Section */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🏠</span>
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Property</h4>
              </div>
              <RatingBar label="Cleanliness" rating={review.propertyCleanlinessRating} />
              <RatingBar label="Condition" rating={review.propertyConditionRating} />
              <RatingBar label="Amenities" rating={review.propertyAmenitiesRating} />
              {review.propertyComment && (
                <p className="mt-3 text-gray-600 italic border-t pt-2 text-xs">“{review.propertyComment}”</p>
              )}
            </div>
  
            {/* Area Section */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🌍</span>
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Area</h4>
              </div>
              <RatingBar label="Safety" rating={review.areaSafetyRating} />
              <RatingBar label="Transport" rating={review.areaTransportRating} />
              <RatingBar label="Services" rating={review.areaServicesRating} />
              {review.areaComment && (
                <p className="mt-3 text-gray-600 italic border-t pt-2 text-xs">“{review.areaComment}”</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
