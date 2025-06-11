"use client";

import { useGetPropertyReviewsQuery } from "@/state/api";

type Review = {
  id: number;
  content: string;
  rating: number;
  tenant: {
    id: number;
    name: string;
  };
};

const ReviewsList = ({ propertyId }: { propertyId: number }) => {
  const { data: reviews, isLoading, isError } = useGetPropertyReviewsQuery(propertyId);

  if (isLoading) return <p>Loading reviews...</p>;
  if (isError || !reviews) return <p>Failed to load reviews.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((review: Review) => (
        <div key={review.id} className="border rounded-lg p-4">
          <p className="font-semibold">{review.tenant.name}</p>
          <p className="text-sm text-gray-600">{review.content}</p>
          <p className="text-yellow-500">Rating: {review.rating} / 5</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
