import {
    KitchenIcons,
    CommunalIcons,
    LaundryIcons,
    SecurityIcons,
    OutdoorIcons,
    DefaultIcon,
  } from "@/lib/constants";
  import { useGetPropertyQuery } from "@/state/api";
  import React from "react";
  
  const PropertyInformation = ({ propertyId }: PropertyInformationProps) => {
    const { data: property, isError, isLoading } = useGetPropertyQuery(propertyId);
  
    if (isLoading) return <>Loading...</>;
    if (isError || !property) return <>Property not Found</>;
  
    const renderItem = (items: string[] | undefined, iconMap: Record<string, any>) => {
      if (!items || items.length === 0) return null;
  
      return (
        <div className="space-y-2">
          {items.map((item, index) => {
            const cleanLabel = item.replace(/[\[\]"]+/g, "");
            const Icon = iconMap[cleanLabel] || DefaultIcon;
  
            return (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <Icon className="w-4 h-4 text-primary-600" />
                <span className="font-medium">{cleanLabel}</span>
              </div>
            );
          })}
        </div>
      );
    };
  
    return (
        
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Kitchen Appliances</h3>
            {renderItem(property.kitchenDetails, KitchenIcons)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Communal Areas</h3>
            {renderItem(property.communalAreas, CommunalIcons)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Laundry</h3>
            {renderItem(property.laundry, LaundryIcons)}
          </div>
        </div>
  
        <hr className="my-6" />
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Security Features</h3>
            {renderItem(property.securityFeatures, SecurityIcons)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Outdoor Space</h3>
            {renderItem(property.outdoorSpace, OutdoorIcons)}
          </div>
        </div>
      </div>
    );
  };
  
  export default PropertyInformation;
  