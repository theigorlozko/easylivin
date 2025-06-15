// app/manager/profile/[cognitoId]/page.tsx
"use client";
import { useParams } from "next/navigation";

export default function ManagerProfilePage() {
  const params = useParams();
  const managerId = params?.cognitoId;

  return (
    <div>
      <h1>Manager Profile</h1>
      <p>ID: {managerId}</p>
      {/* Fetch and display more info here */}
    </div>
  );
}
