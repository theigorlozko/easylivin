// app/property/success/page.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertySuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 text-center">
      <CheckCircle className="text-green-600 w-20 h-20" />
      <h1 className="text-2xl font-semibold">Property Created Successfully!</h1>
      <p className="text-gray-600">Your property has been listed and is now live.</p>
      <div className="flex gap-4">
        {propertyId && (
          <Button onClick={() => router.push(`/search/${propertyId}`)}>
            View Property
          </Button>
        )}
        {/* <Button variant="outline" onClick={() => router.push("/managers")}>
          Go to Dashboard
        </Button> */}
      </div>
    </div>
  );
}
