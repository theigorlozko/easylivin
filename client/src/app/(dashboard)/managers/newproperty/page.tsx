"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { useCreatePropertyMutation, useGetAuthUserQuery } from "@/state/api";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum, RoomAmenityEnum, RoomTypeEnum } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

const NewProperty = () => {
  const [createProperty] = useCreatePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 1000,
      securityDeposit: 500,
      roomNumber: 1,
      applicationFee: 100,
      isPetsAllowed: false,
      isParkingIncluded: false,
      isOwnerOccupied: false,
      isSmokers: false,
      photoUrls: [],
      amenities: "",
      roomAmenities: RoomAmenityEnum.Desk,
      highlights: "",
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      roomType: RoomTypeEnum.SingleRoom, // Set default value to undefined
      lookingFor: "",
      isRefNeeded: false,
      roomAdInfo: "",
      leaseLength: "12 months",
      minTerm: 6,
      maxTerm: 12,
      availableDay: "",
      availableMonth: "",
      availableYear: "",
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    if (!authUser?.cognitoInfo?.userId) {
      throw new Error("No manager ID found");
    }
    const { availableDay, availableMonth, availableYear, ...rest } = data;
    const availableFrom = `${availableYear}-${availableMonth.padStart(2, '0')}-${availableDay.padStart(2, '0')}`;
// → "2025-06-12"

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "photoUrls") {
        const files = value as File[];
        files.forEach((file: File) => {
          formData.append("photos", file);
        });
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    formData.append("availableFrom", availableFrom);

    formData.append("managerCognitoId", authUser.cognitoInfo.userId);

    await createProperty(formData);
  };

  return (
    <div className="dashboard-container">
      <Header
        title="Add New Property"
        subtitle="Create a new property listing with detailed information"
      />
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-10"
          >
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <CustomFormField name="name" label="Property Name" />
                <CustomFormField
                  name="description"
                  label="Description"
                  type="textarea"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Property Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Entire Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomFormField
                  name="beds"
                  label="Number of Beds"
                  type="number"
                />
                <CustomFormField
                  name="baths"
                  label="Number of Baths"
                  type="number"
                />
                <CustomFormField
                  name="squareFeet"
                  label="Square Meter"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomFormField
                  name="propertyType"
                  label="Property Type"
                  type="select"
                  options={Object.keys(PropertyTypeEnum).map((type) => ({
                    value: type,
                    label: type,
                  }))}
                />
                <CustomFormField
                  name="roomNumber"
                  label="Number of Rooms"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                <CustomFormField
                  name="isPetsAllowed"
                  label="Pets Allowed"
                  type="switch"
                />
                <CustomFormField
                  name="isParkingIncluded"
                  label="Parking Included"
                  type="switch"
                />
                <CustomFormField
                  name="isOwnerOccupied"
                  label="Owner Occupied"
                  type="switch"
                />
                <CustomFormField
                  name="isSmokers"
                  label="Smokers At Property"
                  type="switch"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

             {/* Amenities and Highlights */}
             <div>
              <h2 className="text-lg font-semibold mb-4">
                Property Amenities and Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomFormField
                  name="amenities"
                  label="Amenities"
                  type="select"
                  options={Object.keys(AmenityEnum).map((amenity) => ({
                    value: amenity,
                    label: amenity,
                  }))}
                />
                <CustomFormField
                  name="highlights"
                  label="Highlights"
                  type="select"
                  options={Object.keys(HighlightEnum).map((highlight) => ({
                    value: highlight,
                    label: highlight,
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />
            {/* Room Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Current Occupant Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 add occupants here name, description, age , gender, occupation.
              </div>
            </div>

            <hr className="my-6 border-gray-200" />
            {/* Property Details */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Room Details</h2>
              <div className="grid grid-cols-3 gap-4">
                <CustomFormField
                  name="availableDay"
                  label="Day"
                  type="text"
                />
                <CustomFormField
                  name="availableMonth"
                  label="Month"
                  type="text"
                />
                <CustomFormField
                  name="availableYear"
                  label="Year"
                  type="text"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">
                    <CustomFormField
                      name="roomType"
                      label="Room Type"
                      type="select"
                      options={Object.keys(RoomTypeEnum).map((type) => ({
                        value: type,
                        label: type.replace(/([a-z])([A-Z])/g, '$1 $2'),
                      }))}
                    />
                    <CustomFormField
                    name="roomAmenities"
                    label="Room Amenities"
                    type="select"
                    options={Object.keys(RoomAmenityEnum).map((roomAmenities) => ({
                      value: roomAmenities,
                      label: roomAmenities,
                    }))}
                    />
                </div>
                <div className="mt-4">
                <CustomFormField
                  name="roomAdInfo"
                  label="Additional Room Information"
                  type="textarea"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

             {/* Fees */}
             <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Fees and Lease</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomFormField
                  name="pricePerMonth"
                  label="Room Price per Month"
                  type="number"
                />
                  <CustomFormField
                    name="securityDeposit"
                    label="Security Deposit"
                    type="number"
                  />
                  <CustomFormField
                    name="applicationFee"
                    label="Application Fee"
                    type="number"
                  />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <CustomFormField
                    name="leaseLength"
                    label="Lease Length"
                    type="select"
                    options={[
                      { value: "12 months", label: "12 months" },
                      { value: "6 months", label: "6 months" },
                      { value: "Academic Year", label: "Academic Year" },
                      { value: "Flexible", label: "Flexible" },
                      { value: "Upon Request", label: "Upon Request" },
                      { value: "None", label: "None" },
                    ]}
                  />

                  <CustomFormField
                    name="minTerm"
                    label="Minimum Term (Months)"
                    type="select"
                    options={[...Array(12).keys()].map((i) => ({
                      value: String(i + 1),
                      label: `${i + 1} month${i === 0 ? "" : "s"}`,
                    }))}
                  />

                  <CustomFormField
                    name="maxTerm"
                    label="Maximum Term (Months)"
                    type="select"
                    options={[...Array(60).keys()].map((i) => ({
                      value: String(i + 1),
                      label: `${i + 1} month${i === 0 ? "" : "s"}`,
                    }))}
                  />
                  </div>
            </div>
            <hr className="my-6 border-gray-200" />

            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Tenant Requirments</h2>
              <div className="space-y-4">
              <CustomFormField
                  name="lookingFor"
                  label="Looking For"
                  type="textarea"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                <CustomFormField
                  name="isRefNeeded"
                  label="References Needed"
                  type="switch"
                />
              </div>
            </div>

            {/* Photos */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Photos</h2>
              <CustomFormField
                name="photoUrls"
                label="Property Photos"
                type="file"
                accept="image/*"
              />
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">
                Property Location
              </h2>
              <CustomFormField name="address" label="Address" />
              <div className="flex justify-between gap-4">
                <CustomFormField name="city" label="City" className="w-full" />
                <CustomFormField
                  name="state"
                  label="State"
                  className="w-full"
                />
                <CustomFormField
                  name="postalCode"
                  label="Postal Code"
                  className="w-full"
                />
              </div>
              <CustomFormField name="country" label="Country" />
            </div>

            <Button
              type="submit"
              className="bg-primary-700 text-white w-full mt-8"
            >
              Create Property
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProperty;
