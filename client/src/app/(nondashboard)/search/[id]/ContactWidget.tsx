"use client";

import { Button } from "@/components/ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { Phone, Home, Mail, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface ContactWidgetProps {
  onOpenModal: () => void;
  property: {
    name: string;
    pricePerMonth: number;
    securityDeposit: number;
    applicationFee: number;
    availableFrom: string;
    location: {
      address: string;
      city: string;
      country: string;
    };
    manager: {
      image: string | undefined;
      cognitoId: string;
      name?: string;
      email: string;
      phone: string;
    };
  };
}

const ContactWidget = ({ onOpenModal, property }: ContactWidgetProps) => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const userRole = authUser?.userRole;
  const { manager } = property;

  const handleButtonClick = () => {
    if (authUser) {
      onOpenModal();
    } else {
      router.push("/signin");
    }
  };

  const handleManagerClick = () => {
    if (manager?.cognitoId) {
      router.push(`/manager/profile/${manager.cognitoId}`);
    }
  };

  console.log(manager)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Contact & Rent Details
      </h3>

      {/* Manager Info (clickable) */}
      {authUser && (
        <Link key={manager.cognitoId} href={`/managers/profile/${manager.cognitoId}`} scroll={false}>
        <div
          className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-xl border border-gray-200 transition"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={manager.image} />
            <AvatarFallback className="bg-green-600 text-white font-semibold">
              {manager.name?.[0]?.toUpperCase() || "M"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-gray-600">Listed by</p>
            <p className="text-lg font-semibold text-gray-800">
              {manager.name || "Unnamed Manager"}
            </p>
          </div>
        </div>
        </Link>
      )}

      {/* Contact Info */}
      {authUser && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="p-2 rounded-full bg-primary-700">
              <Phone className="text-white" size={16} />
            </div>
            <div className="text-sm text-gray-800">{manager.phone || "Not provided"}</div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="p-2 rounded-full bg-primary-700">
              <Mail className="text-white" size={16} />
            </div>
            <div className="text-sm text-gray-800">{manager.email}</div>
          </div>
        </div>
      )}

      {/* Rental Info */}
      <div className="space-y-2 text-sm text-gray-700">
        <InfoLine label="Monthly Rent" value={`€${property.pricePerMonth}`} />
        <InfoLine label="Security Deposit" value={`€${property.securityDeposit}`} />
        <InfoLine
          label="Available From"
          value={format(new Date(property.availableFrom), "MMMM d, yyyy")}
        />
        <InfoLine
          label="Address"
          value={`${property.location.address}, ${property.location.city}`}
          icon={<Home className="text-primary-600" size={14} />}
        />
      </div>

      {/* Application Button */}
      {userRole === "tenant" && (
        <Button
          className="w-full bg-primary-700 text-white hover:bg-primary-600 mt-2"
          onClick={handleButtonClick}
        >
          {authUser ? "Submit Application" : "Sign In to Apply"}
        </Button>
      )}

      {/* Footer */}
      <hr className="my-4" />
      <div className="text-xs text-gray-600">
        <p className="mb-1">📞 Languages: English</p>
        <p>📆 Viewings available by appointment, Mon – Sun</p>
      </div>
    </div>
  );
};

export default ContactWidget;

const InfoLine = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-500">
      {icon ? <span className="inline-flex items-center gap-1">{icon}{label}</span> : label}
    </span>
    <span className="font-medium text-gray-800">{value}</span>
  </div>
);
