"use client";

import { Button } from "@/components/ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { Phone, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { format } from "date-fns";

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
  };
}

const ContactWidget = ({ onOpenModal, property }: ContactWidgetProps) => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const userRole = authUser?.userRole;

  const handleButtonClick = () => {
    if (authUser) {
      onOpenModal();
    } else {
      router.push("/signin");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Contact & Rent Details
      </h3>

      <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div className="p-3 rounded-full bg-primary-700">
          <Phone className="text-white" size={18} />
        </div>
        <div>
          <p className="text-sm text-gray-600">Contact this property</p>
          <p className="font-bold text-primary-800 text-lg">(424) 340-5574</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <InfoLine label="Monthly Rent" value={`€${property.pricePerMonth}`} />
        <InfoLine label="Security Deposit" value={`€${property.securityDeposit}`} />
        {/* <InfoLine label="Application Fee" value={`€${property.applicationFee}`} /> */}
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

      {userRole === "tenant" && (
        <Button
          className="w-full bg-primary-700 text-white hover:bg-primary-600 mt-2"
          onClick={handleButtonClick}
        >
          {authUser ? "Submit Application" : "Sign In to Apply"}
        </Button>
      )}

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
