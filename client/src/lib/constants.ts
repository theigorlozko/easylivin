import {
  Wifi,
  Waves,
  Dumbbell,
  Car,
  PawPrint,
  Tv,
  Thermometer,
  Cigarette,
  Cable,
  Maximize,
  Bath,
  Phone,
  Sprout,
  Hammer,
  Bus,
  Mountain,
  VolumeX,
  Home,
  Warehouse,
  Building,
  Castle,
  Trees,
  LucideIcon,
  Utensils,
  CupSoda,
  Monitor,
  Gamepad,
  Landmark,
  WashingMachine,
  AlarmClock,
  Camera,
  KeyRound,
  Shrub,
  Sun,
  HelpCircle,
} from "lucide-react";

export const KitchenIcons: Record<string, any> = {
  Microwave: Utensils,
  Stove: Utensils,
  Kettle: CupSoda,
  Toaster: Utensils,
  Fridge: CupSoda,
};

export const CommunalIcons: Record<string, any> = {
  TV: Monitor,
  "Board Games": Gamepad,
  "Dining Table": Utensils,
  "Lounge Area": Landmark,
};

export const LaundryIcons: Record<string, any> = {
  Washer: WashingMachine,
  Dryer: WashingMachine,
  "Washer-Dryer Combo": WashingMachine,
};

export const SecurityIcons: Record<string, any> = {
  Alarm: AlarmClock,
  CCTV: Camera,
  "Keypad Entry": KeyRound,
};

export const OutdoorIcons: Record<string, any> = {
  Garden: Shrub,
  Patio: Sun,
  Balcony: Sun,
};

export const DefaultIcon = HelpCircle;

export enum RoomAmenityEnum {
  Desk = "Desk",
  Chair = "Chair",
  Wardrobe = "Wardrobe",
  ChestOfDrawers = "ChestOfDrawers",
  BedsideTable = "BedsideTable",
  Mirror = "Mirror",
  LockOnDoor = "LockOnDoor",
  KeypadEntry = "KeypadEntry",
  MiniFridge = "MiniFridge",
  PrivateBathroom = "PrivateBathroom",
  SharedBathroom = "SharedBathroom",
  TV = "TV",
  WifiIncluded = "WifiIncluded",
  Balcony = "Balcony",
  BlackoutCurtains = "BlackoutCurtains",
  Heating = "Heating",
  AirConditioning = "AirConditioning",
}

export enum AmenityEnum {
  WasherDryer = "WasherDryer",
  AirConditioning = "AirConditioning",
  Dishwasher = "Dishwasher",
  HighSpeedInternet = "HighSpeedInternet",
  HardwoodFloors = "HardwoodFloors",
  WalkInClosets = "WalkInClosets",
  Microwave = "Microwave",
  Refrigerator = "Refrigerator",
  Pool = "Pool",
  Gym = "Gym",
  Parking = "Parking",
  PetsAllowed = "PetsAllowed",
  WiFi = "WiFi",
}

export const AmenityIcons: Record<AmenityEnum, LucideIcon> = {
  WasherDryer: Waves,
  AirConditioning: Thermometer,
  Dishwasher: Waves,
  HighSpeedInternet: Wifi,
  HardwoodFloors: Home,
  WalkInClosets: Maximize,
  Microwave: Tv,
  Refrigerator: Thermometer,
  Pool: Waves,
  Gym: Dumbbell,
  Parking: Car,
  PetsAllowed: PawPrint,
  WiFi: Wifi,
};

export enum HighlightEnum {
  HighSpeedInternetAccess = "HighSpeedInternetAccess",
  WasherDryer = "WasherDryer",
  AirConditioning = "AirConditioning",
  Heating = "Heating",
  SmokeFree = "SmokeFree",
  CableReady = "CableReady",
  SatelliteTV = "SatelliteTV",
  DoubleVanities = "DoubleVanities",
  TubShower = "TubShower",
  Intercom = "Intercom",
  SprinklerSystem = "SprinklerSystem",
  RecentlyRenovated = "RecentlyRenovated",
  CloseToTransit = "CloseToTransit",
  GreatView = "GreatView",
  QuietNeighborhood = "QuietNeighborhood",
}

export const HighlightIcons: Record<HighlightEnum, LucideIcon> = {
  HighSpeedInternetAccess: Wifi,
  WasherDryer: Waves,
  AirConditioning: Thermometer,
  Heating: Thermometer,
  SmokeFree: Cigarette,
  CableReady: Cable,
  SatelliteTV: Tv,
  DoubleVanities: Maximize,
  TubShower: Bath,
  Intercom: Phone,
  SprinklerSystem: Sprout,
  RecentlyRenovated: Hammer,
  CloseToTransit: Bus,
  GreatView: Mountain,
  QuietNeighborhood: VolumeX,
};

export enum PropertyTypeEnum {
  Rooms = "Rooms",
  Tinyhouse = "Tinyhouse",
  Apartment = "Apartment",
  Villa = "Villa",
  Townhouse = "Townhouse",
  Cottage = "Cottage",
}

export enum RoomTypeEnum {
  SingleRoom = "SingleRoom",
  DoubleRoom = "DoubleRoom",
  TwinRoom = "TwinRoom",
  Suite = "Suite",
  Studio = "Studio",
  SharedRoom = "SharedRoom",
  EnsuiteRoom = "EnsuiteRoom",
  LoftRoom = "LoftRoom",
  AtticRoom = "AtticRoom",
  BasementRoom = "BasementRoom"
}

export const PropertyTypeIcons: Record<PropertyTypeEnum, LucideIcon> = {
  Rooms: Home,
  Tinyhouse: Warehouse,
  Apartment: Building,
  Villa: Castle,
  Townhouse: Home,
  Cottage: Trees,
};

// Add this constant at the end of the file
export const NAVBAR_HEIGHT = 52; // in pixels

// Test users for development
export const testUsers = {
  tenant: {
    username: "Carol White",
    userId: "us-east-2:76543210-90ab-cdef-1234-567890abcdef",
    signInDetails: {
      loginId: "carol.white@example.com",
      authFlowType: "USER_SRP_AUTH",
    },
  },
  tenantRole: "tenant",
  manager: {
    username: "John Smith",
    userId: "us-east-2:12345678-90ab-cdef-1234-567890abcdef",
    signInDetails: {
      loginId: "john.smith@example.com",
      authFlowType: "USER_SRP_AUTH",
    },
  },
  managerRole: "manager",
};
