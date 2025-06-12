import {
  KitchenIcons,
  CommunalIcons,
  LaundryIcons,
  SecurityIcons,
  OutdoorIcons,
  DefaultIcon,
} from "@/lib/constants";
import { useGetPropertyQuery } from "@/state/api";
import { ParkingCircle, PawPrint } from "lucide-react";
import React from "react";

const PropertyInformation = ({ propertyId }: PropertyInformationProps) => {
  const { data: property, isError, isLoading } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) return <>Property not Found</>;

  return (
    <div className="mb-12">
      {/* Heading outside the box */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Features</h2>

      {/* Feature Box */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-10">
        {/* Feature Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureBlock title="Kitchen Appliances" items={property.kitchenDetails} iconMap={KitchenIcons} />
          <FeatureBlock title="Communal Areas" items={property.communalAreas} iconMap={CommunalIcons} />
          <FeatureBlock title="Laundry" items={property.laundry} iconMap={LaundryIcons} />
        </div>

        <hr className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureBlock title="Security Features" items={property.securityFeatures} iconMap={SecurityIcons} />
          <FeatureBlock title="Outdoor Space" items={property.outdoorSpace} iconMap={OutdoorIcons} />
        </div>

        <hr className="my-4" />

        {/* Parking and Pets Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            className={`flex items-center gap-3 text-sm px-4 py-3 rounded-md border ${
              property.isParkingIncluded
                ? "bg-green-50 text-green-700 border-green-100"
                : "bg-red-50 text-red-700 border-red-100"
            }`}
          >
            <ParkingCircle className={`w-5 h-5 ${property.isParkingIncluded ? "text-green-600" : "text-red-600"}`} />
            <span className="font-medium">
              Parking: {property.isParkingIncluded ? "Available" : "Not Available"}
            </span>
          </div>

          <div
            className={`flex items-center gap-3 text-sm px-4 py-3 rounded-md border ${
              property.isPetsAllowed
                ? "bg-green-50 text-green-700 border-green-100"
                : "bg-red-50 text-red-700 border-red-100"
            }`}
          >
            <PawPrint className={`w-5 h-5 ${property.isPetsAllowed ? "text-green-600" : "text-red-600"}`} />
            <span className="font-medium">
              Pets Allowed: {property.isPetsAllowed ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInformation;

// Reusable subcomponent
const FeatureBlock = ({
  title,
  items,
  iconMap,
}: {
  title: string;
  items: string[] | undefined;
  iconMap: Record<string, any>;
}) => {
  const renderItem = (items: string[] | undefined) => {
    if (!items || items.length === 0) return <p className="text-sm text-gray-400">Not specified</p>;

    return (
      <ul className="space-y-2">
        {items.map((item, index) => {
          const cleanLabel = item.replace(/[\[\]"]+/g, "");
          const Icon = iconMap[cleanLabel] || DefaultIcon;

          return (
            <li
              key={index}
              className="flex items-center gap-2 rounded-md px-3 py-2 bg-gray-50 border border-gray-100 hover:bg-gray-100 transition text-sm text-gray-700"
            >
              <Icon className="w-4 h-4 text-primary-600" />
              <span className="font-medium">{cleanLabel}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-800 mb-3">{title}</h3>
      {renderItem(items)}
    </div>
  );
};
