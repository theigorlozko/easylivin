"use client";

import { useGetAuthUserQuery, useGetManagersQuery } from "@/state/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Building2, Star } from "lucide-react";
import Link from "next/link";

// Your existing logic
export default function MyManagerProfilePage() {
  const { data: authUser, isLoading: loadingAuth } = useGetAuthUserQuery();
  const cognitoId = authUser?.cognitoInfo?.userId;

  const { data: manager, isLoading, isError } = useGetManagersQuery(cognitoId!, {
    skip: !cognitoId,
  });

  if (loadingAuth || isLoading)
    return <p className="p-4 text-muted-foreground">Loading profile...</p>;
  if (isError || !manager)
    return <p className="p-4 text-destructive">Failed to load your profile.</p>;

  const reviewStats = calculateReviewAverages((manager as any).reviews || []);
  const stats = calculateManagerStats(manager);


  // Now render same JSX you use in the public page
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
    {/* Header Section */}
    <div className="flex items-center gap-6 border rounded-2xl p-6 bg-white shadow-md">
      <Avatar className="h-24 w-24">
        <AvatarImage src={manager.photoUrl || ""} alt={manager.name} />
        <AvatarFallback>{manager.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{manager.name}</h1>
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {manager.email}</p>
          <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {manager.phoneNumber}</p>
          <p className="flex items-center gap-2"><Building2 className="w-4 h-4" /> {(manager as any).officeAddress || "No office address provided"}</p>
        </div>
      </div>
    </div>

    {/* About Section */}
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">About</h2>
      <p className="text-sm text-gray-700 leading-relaxed">{(manager as any).bio || "This manager hasn’t added a bio yet."}</p>
    </div>
    {/* Quick Stats */}
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Manager Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm font-medium text-gray-800">
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
          <p className="text-2xl font-bold text-primary">{stats.totalProperties}</p>
          <p className="mt-1">Properties Managed</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
          <p className="text-2xl font-bold text-yellow-500">{stats.averageScore.toFixed(1)} / 5</p>
          <p className="mt-1">Average Review Score</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
          <p className="text-2xl font-bold">{stats.totalReviews}</p>
          <p className="mt-1">Total Reviews</p>
        </div>
      </div>
    </div>


    {/* Review Summary */}
    {reviewStats && (
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Manager Review Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(reviewStats).map(([key, value]) => {
            if (key === "totalReviews") return null;
            const label = getLabel(key);
            return <RatingBar key={key} label={label} rating={value} />;
          })}
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          Based on {reviewStats.totalReviews} review{reviewStats.totalReviews > 1 ? "s" : ""}
        </p>
      </div>
    )}

    {/* Properties Managed */}
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Properties Managed</h2>
      {manager.managedProperties?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {manager.managedProperties.map((property: any) => (
            <Link
              key={property.id}
              href={`/search/${property.id}`}
              className="block border border-gray-200 rounded-2xl bg-gray-50 hover:bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-gray-900">{property.name}</h3>
              <p className="text-sm text-muted-foreground">{property.location?.address}</p>
              <p className="text-sm text-gray-700 mt-1">€{property.pricePerMonth} / month</p>
              <div className="mt-2 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">
                  {property.averageRating?.toFixed(1) ?? "No rating"} ({property.numberOfReviews ?? 0} reviews)
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">This manager has no properties listed.</p>
      )}
    </div>
  </div>
  );
}

// Reusable rating bar
function RatingBar({ label, rating }: { label: string; rating: number }) {
    const barColor = getBarColor(rating);
    const width = `${(rating / 5) * 100}%`;
  
    return (
      <div>
        <div className="flex justify-between text-sm font-medium text-gray-800 mb-1">
          <span>{label}</span>
          <span>{rating.toFixed(1)} / 5</span>
        </div>
        <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width }} />
        </div>
      </div>
    );
  }
  
  // Color logic
  function getBarColor(rating: number) {
    if (rating <= 1.5) return "bg-red-500";
    if (rating <= 3.5) return "bg-yellow-400";
    return "bg-green-500";
  }
  
  // Translate review key to label
  function getLabel(key: string) {
    const map: Record<string, string> = {
      averageOverall: "⭐ Overall",
      communication: "📞 Communication",
      response: "⚡ Response",
      cleanliness: "🧼 Cleanliness",
      condition: "🏚️ Condition",
      amenities: "💡 Amenities",
      safety: "🛡️ Safety",
      transport: "🚇 Transport",
      services: "🛍️ Services",
    };
    return map[key] || key;
  }
  
  // Review calculation logic
  function calculateReviewAverages(reviews: any[]) {
    const count = reviews.length;
    if (count === 0) return null;
  
    const avg = (key: string) =>
      reviews.reduce((acc, r) => acc + (r[key] || 0), 0) / count;
  
    return {
      totalReviews: count,
      averageOverall: reviews.reduce((acc, r) => acc + (r.totalRating || 0), 0) / count,
      communication: avg("managerCommunicationRating"),
      response: avg("managerResponseRating"),
      cleanliness: avg("propertyCleanlinessRating"),
      condition: avg("propertyConditionRating"),
      amenities: avg("propertyAmenitiesRating"),
      safety: avg("areaSafetyRating"),
      transport: avg("areaTransportRating"),
      services: avg("areaServicesRating"),
    };
  }
  function calculateManagerStats(manager: any) {
    const totalProperties = manager.managedProperties?.length || 0;
  
    const allReviews = manager.managedProperties?.flatMap((p: any) => p.reviews || []) || [];
    const totalReviews = allReviews.length;
    const averageScore =
      totalReviews > 0
        ? allReviews.reduce((sum: number, r: any) => sum + (r.totalRating || 0), 0) / totalReviews
        : 0;
  
    return {
      totalProperties,
      totalReviews,
      averageScore,
    };
  }
