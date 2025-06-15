"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useGetPropertyQuery,
  useUpdatePropertyMutation,
  useGetAuthUserQuery,
} from "@/state/api";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import {
  RoomAmenityEnum,
  RoomTypeEnum,
  PropertyTypeEnum,
  HighlightEnum,
  AmenityEnum,
} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/FormField";

const EditProperty = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  const router = useRouter();

  const { data: authUser } = useGetAuthUserQuery();
  const { data: property, isLoading, isError } = useGetPropertyQuery(propertyId);
  const [updateProperty] = useUpdatePropertyMutation();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 0,
      securityDeposit: 0,
      roomNumber: 0,
      applicationFee: 0,
      isPetsAllowed: false,
      isParkingIncluded: false,
      isOwnerOccupied: false,
      isSmokers: false,
      photoUrls: [],
      amenities: "",
      roomAmenities: RoomAmenityEnum.Desk,
      highlights: "",
      beds: 0,
      baths: 0,
      squareFeet: 0,
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      roomType: RoomTypeEnum.SingleRoom,
      lookingFor: "",
      isRefNeeded: false,
      roomAdInfo: "",
      leaseLength: "",
      minTerm: 0,
      maxTerm: 0,
      availableDay: "",
      availableMonth: "",
      availableYear: "",
      currentOccupantsDescription: "",
      kitchenDetails: [],
      communalAreas: [],
      laundry: [],
      securityFeatures: [],
      outdoorSpace: [],
    },
  });

  useEffect(() => {
    if (property) {
      const [year, month, day] = property.availableFrom?.split("-") || ["", "", ""];
      form.reset({
        ...property,
        availableDay: day,
        availableMonth: month,
        availableYear: year,
      });
    }
  }, [property, form]);

  const onSubmit = async (data: PropertyFormData) => {
    const { availableDay, availableMonth, availableYear, ...rest } = data;
    const availableFrom = `${availableYear}-${availableMonth.padStart(2, "0")}-${availableDay.padStart(2, "0")}`;
    const payload = { ...rest, availableFrom, id: propertyId };
    const response = await updateProperty(payload);
    if ("data" in response) {
      router.push("/managers/properties");
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !property) return <div>Error loading property</div>;

  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <CustomFormField name="name" label="Property Name" />
            <CustomFormField name="description" label="Description" type="textarea" />
            <CustomFormField name="pricePerMonth" label="Price Per Month" type="number" />
            <CustomFormField name="securityDeposit" label="Security Deposit" type="number" />
            <CustomFormField name="roomNumber" label="Room Number" type="number" />
            <CustomFormField name="applicationFee" label="Application Fee" type="number" />
            <CustomFormField name="beds" label="Beds" type="number" />
            <CustomFormField name="baths" label="Baths" type="number" />
            <CustomFormField name="squareFeet" label="Square Feet" type="number" />
            {/* <CustomFormField name="propertyType" label="Property Type" type="select" options={Object.keys(PropertyTypeEnum).map(type => ({ value: type, label: type }))} />
            <CustomFormField name="roomType" label="Room Type" type="select" options={Object.keys(RoomTypeEnum).map(type => ({ value: type, label: type }))} />
            <CustomFormField name="roomAmenities" label="Room Amenities" type="select" options={Object.keys(RoomAmenityEnum).map(type => ({ value: type, label: type }))} />
            <CustomFormField name="amenities" label="Amenities" type="select" options={Object.keys(AmenityEnum).map(type => ({ value: type, label: type }))} />
            <CustomFormField name="highlights" label="Highlights" type="select" options={Object.keys(HighlightEnum).map(type => ({ value: type, label: type }))} /> */}
            <CustomFormField name="leaseLength" label="Lease Length" type="text" />
            <CustomFormField name="minTerm" label="Minimum Term (Months)" type="number" />
            <CustomFormField name="maxTerm" label="Maximum Term (Months)" type="number" />
            <CustomFormField name="availableDay" label="Available Day" type="text" />
            <CustomFormField name="availableMonth" label="Available Month" type="text" />
            <CustomFormField name="availableYear" label="Available Year" type="text" />
            <CustomFormField name="currentOccupantsDescription" label="Current Occupants Description" type="textarea" />
            <CustomFormField name="lookingFor" label="Looking For" type="textarea" />
            <CustomFormField name="isPetsAllowed" label="Pets Allowed" type="switch" />
            <CustomFormField name="isParkingIncluded" label="Parking Included" type="switch" />
            <CustomFormField name="isOwnerOccupied" label="Owner Occupied" type="switch" />
            <CustomFormField name="isSmokers" label="Smokers Allowed" type="switch" />
            <CustomFormField name="isRefNeeded" label="Reference Needed" type="switch" />
            {/* <CustomFormField name="kitchenDetails" label="Kitchen Details" type="multi-select" options={["Microwave", "Stove", "Kettle", "Toaster", "Fridge"].map(v => ({ label: v, value: v }))} />
            <CustomFormField name="communalAreas" label="Communal Areas" type="multi-select" options={["TV", "Board Games", "Dining Table", "Lounge Area"].map(v => ({ label: v, value: v }))} />
            <CustomFormField name="laundry" label="Laundry" type="multi-select" options={["Washer", "Dryer", "Washer-Dryer Combo"].map(v => ({ label: v, value: v }))} />
            <CustomFormField name="securityFeatures" label="Security Features" type="multi-select" options={["Alarm", "CCTV", "Keypad Entry"].map(v => ({ label: v, value: v }))} />
            <CustomFormField name="outdoorSpace" label="Outdoor Space" type="multi-select" options={["Garden", "Patio", "Balcony"].map(v => ({ label: v, value: v }))} /> */}
            <CustomFormField name="roomAdInfo" label="Additional Room Information" type="textarea" />
            {/* <CustomFormField name="address" label="Address" />
            <CustomFormField name="city" label="City" />
            <CustomFormField name="state" label="County" />
            <CustomFormField name="postalCode" label="Postal Code" />
            <CustomFormField name="country" label="Country" /> */}
            {/* <CustomFormField name="photoUrls" label="Property Photos" type="file" accept="image/*" /> */}
            <Button type="submit" className="bg-primary-700 text-white w-full mt-8">
              Save Changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditProperty;