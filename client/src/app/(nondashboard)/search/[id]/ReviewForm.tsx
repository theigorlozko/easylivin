"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateReviewMutation } from "@/state/api";
import { useState } from "react";

const StarInput = ({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (val: number) => void;
  label: string;
}) => {
  const getSliderColor = () => {
    if (value >= 4) return "accent-green-500";
    if (value === 3) return "accent-orange-400";
    return "accent-red-500"; // covers 1–2
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${getSliderColor()}`}
      />
      <div className="text-xs text-gray-500">{value} / 5</div>
    </div>
  );
};

const ReviewForm = ({
  isOpen,
  onClose,
  propertyId,
}: {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
}) => {
  const [createReview] = useCreateReviewMutation();

  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [rating, setRating] = useState(5);

  const [managerCommunicationRating, setManagerCommunicationRating] = useState(5);
  const [managerResponseRating, setManagerResponseRating] = useState(5);
  const [managerComment, setManagerComment] = useState("");

  const [propertyCleanlinessRating, setPropertyCleanlinessRating] = useState(5);
  const [propertyConditionRating, setPropertyConditionRating] = useState(5);
  const [propertyAmenitiesRating, setPropertyAmenitiesRating] = useState(5);
  const [propertyComment, setPropertyComment] = useState("");

  const [areaSafetyRating, setAreaSafetyRating] = useState(5);
  const [areaTransportRating, setAreaTransportRating] = useState(5);
  const [areaServicesRating, setAreaServicesRating] = useState(5);
  const [areaComment, setAreaComment] = useState("");

  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const calculateTotalRating = () => {
    const all = [
      managerCommunicationRating,
      managerResponseRating,
      propertyCleanlinessRating,
      propertyConditionRating,
      propertyAmenitiesRating,
      areaSafetyRating,
      areaTransportRating,
      areaServicesRating,
    ];
    const sum = all.reduce((a, b) => a + b, 0);
    return parseFloat((sum / all.length).toFixed(1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReview({
      content,
      summary,
      rating,
      dateFrom,
      dateTo,
      managerCommunicationRating,
      managerResponseRating,
      managerComment,
      propertyCleanlinessRating,
      propertyConditionRating,
      propertyAmenitiesRating,
      propertyComment,
      areaSafetyRating,
      areaTransportRating,
      areaServicesRating,
      areaComment,
      wouldRecommend,
      totalRating: calculateTotalRating(),
      propertyId,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl w-full rounded-2xl bg-white p-0 mb-10"
        style={{
          maxHeight: "90vh",
          marginTop: "auto",
          marginBottom: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
       <div className="w-full p-6 sm:p-8 overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-2">
              Share Your Experience
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stay Duration */}
            <div>
              <h3 className="font-semibold text-sm text-gray-800">When did you stay?</h3>
              <div className="flex gap-4 mt-2">
                <input type="date" className="w-full border p-2 rounded" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                <input type="date" className="w-full border p-2 rounded" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">One-line Summary</label>
              <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="E.g., Great location, but a bit noisy" className="w-full border p-2 rounded" required />
            </div>

            {/* Full Review */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Full Review</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Describe your experience..." className="w-full border p-2 rounded min-h-[100px]" required />
            </div>

            {/* Ratings */}
            <div>
              <h3 className="font-semibold text-sm text-gray-800">Ratings</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                <StarInput label="Manager Communication" value={managerCommunicationRating} onChange={setManagerCommunicationRating} />
                <StarInput label="Manager Response" value={managerResponseRating} onChange={setManagerResponseRating} />
                <StarInput label="Cleanliness" value={propertyCleanlinessRating} onChange={setPropertyCleanlinessRating} />
                <StarInput label="Condition" value={propertyConditionRating} onChange={setPropertyConditionRating} />
                <StarInput label="Amenities" value={propertyAmenitiesRating} onChange={setPropertyAmenitiesRating} />
                <StarInput label="Area Safety" value={areaSafetyRating} onChange={setAreaSafetyRating} />
                <StarInput label="Transport" value={areaTransportRating} onChange={setAreaTransportRating} />
                <StarInput label="Services" value={areaServicesRating} onChange={setAreaServicesRating} />
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Manager Feedback</h4>
                <textarea
                  className="w-full border p-2 rounded"
                  value={managerComment}
                  onChange={(e) => setManagerComment(e.target.value)}
                  placeholder="E.g., Very responsive and professional"
                />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Property Feedback</h4>
                <textarea
                  className="w-full border p-2 rounded"
                  value={propertyComment}
                  onChange={(e) => setPropertyComment(e.target.value)}
                  placeholder="E.g., Kitchen was well equipped, but heating slow to start"
                />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Area Feedback</h4>
                <textarea
                  className="w-full border p-2 rounded"
                  value={areaComment}
                  onChange={(e) => setAreaComment(e.target.value)}
                  placeholder="E.g., Safe and quiet, 5-min walk to transit"
                />
              </div>
            </div>

            {/* Recommend Checkbox */}
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" checked={wouldRecommend} onChange={(e) => setWouldRecommend(e.target.checked)} />
              <label className="text-sm text-gray-700">I would recommend this place</label>
            </div>

            <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition">
              Submit Review
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
