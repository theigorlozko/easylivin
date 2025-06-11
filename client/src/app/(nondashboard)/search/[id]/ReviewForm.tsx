"use client";

import { useCreateReviewMutation } from "@/state/api";
import { useState } from "react";

const ReviewForm = ({ propertyId }: { propertyId: number }) => {
  const [createReview] = useCreateReviewMutation();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReview({ content, rating, propertyId });
    setContent("");
    setRating(5);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your review..."
        className="w-full border rounded-lg p-2"
        required
      />
      <div className="flex items-center gap-2">
        <label htmlFor="rating">Rating:</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded-lg p-1"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-primary-700 text-white px-4 py-2 rounded-lg"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;