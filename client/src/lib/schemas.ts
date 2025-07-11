import * as z from "zod";
import { PropertyTypeEnum, RoomTypeEnum } from "@/lib/constants";

export const propertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  pricePerMonth: z.coerce.number().positive().min(0).int(),
  securityDeposit: z.coerce.number().positive().min(0).int(),
  roomNumber: z.coerce.number().positive().min(0).max(20).int(),
  applicationFee: z.coerce.number().positive().min(0).int(),
  isPetsAllowed: z.boolean(),
  isRefNeeded: z.boolean(),
  isParkingIncluded: z.boolean(),
  isOwnerOccupied: z.boolean(),
  isSmokers: z.boolean(),
  photoUrls: z
    .array(z.instanceof(File))
    .min(1, "At least one photo is required"),
  amenities: z.string().min(1, "Amenities are required"),
  highlights: z.string().min(1, "Highlights are required"),
  beds: z.coerce.number().positive().min(0).max(10).int(),
  baths: z.coerce.number().positive().min(0).max(10).int(),
  squareFeet: z.coerce.number().int().positive(),
  propertyType: z.nativeEnum(PropertyTypeEnum),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  roomType: z.nativeEnum(RoomTypeEnum),
  roomAmenities: z.string().min(1, "Amenities are required"),
  lookingFor: z.string().min(1, "Criteria is required"),
  roomAdInfo: z.string().optional(),
  leaseLength: z.string().min(1, "Lease length is required"),
  minTerm: z.coerce.number().int().min(1, "Minimum term must be at least 1 month"),
  maxTerm: z.coerce.number().int().optional(),
  availableDay: z.string().min(1, "Day is required"),
  availableMonth: z.string().min(1, "Month is required"),
  availableYear: z.string().min(4, "Year is required"),
  currentOccupantsDescription: z.string().optional(),
  kitchenDetails: z.array(z.string()).optional(),
  communalAreas: z.array(z.string()).optional(),
  laundry: z.array(z.string()).optional(),
  securityFeatures: z.array(z.string()).optional(),
  outdoorSpace: z.array(z.string()).optional(),
  // fullAddress: z.string().min(1, "Full address is required"),
  // coordinates: z.object({
  //   lat: z.number(),
  //   lng: z.number(),
  // }),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
