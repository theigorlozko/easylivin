import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { S3Client } from "@aws-sdk/client-s3";
import { Location } from "@prisma/client";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

export const getProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      favoriteIds,
      priceMin,
      priceMax,
      beds,
      baths,
      propertyType,
      squareFeetMin,
      squareFeetMax,
      amenities,
      availableFrom,
      latitude,
      longitude,
    } = req.query;

    let whereConditions: Prisma.Sql[] = [];

    if (favoriteIds) {
      const favoriteIdsArray = (favoriteIds as string).split(",").map(Number);
      whereConditions.push(
        Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`
      );
    }

    if (priceMin) {
      whereConditions.push(
        Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`
      );
    }

    if (priceMax) {
      whereConditions.push(
        Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`
      );
    }

    if (beds && beds !== "any") {
      whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
    }

    if (baths && baths !== "any") {
      whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`);
    }

    if (squareFeetMin) {
      whereConditions.push(
        Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
      );
    }

    if (squareFeetMax) {
      whereConditions.push(
        Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
      );
    }

    if (propertyType && propertyType !== "any") {
      whereConditions.push(
        Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`
      );
    }

    if (amenities && amenities !== "any") {
      const amenitiesArray = (amenities as string).split(",");
      whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
    }

    if (availableFrom && availableFrom !== "any") {
      const availableFromDate =
        typeof availableFrom === "string" ? availableFrom : null;
      if (availableFromDate) {
        const date = new Date(availableFromDate);
        if (!isNaN(date.getTime())) {
          whereConditions.push(
            Prisma.sql`EXISTS (
              SELECT 1 FROM "Lease" l 
              WHERE l."propertyId" = p.id 
              AND l."startDate" <= ${date.toISOString()}
            )`
          );
        }
      }
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const radiusInKilometers = 1000;
      const degrees = radiusInKilometers / 111; // Converts kilometers to degrees

      whereConditions.push(
        Prisma.sql`ST_DWithin(
          l.coordinates::geometry,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
          ${degrees}
        )`
      );
    }

    const completeQuery = Prisma.sql`
      SELECT 
        p.*,
        json_build_object(
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ${
        whereConditions.length > 0
          ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
          : Prisma.empty
      }
    `;

    const properties = await prisma.$queryRaw(completeQuery);

    res.json(properties);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving properties: ${error.message}` });
  }
};

export const getProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: {
        location: true,
        manager: {
          select: {
            cognitoId: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (property) {
      const coordinates: { coordinates: string }[] =
        await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

      const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
      const longitude = geoJSON.coordinates[0];
      const latitude = geoJSON.coordinates[1];

      const propertyWithCoordinates = {
        ...property,
        location: {
          ...property.location,
          coordinates: {
            longitude,
            latitude,
          },
        },
      };
      res.json(propertyWithCoordinates);
    }
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving property: ${err.message}` });
  }
};

export const createProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const {
      address,
      city,
      state,
      country,
      postalCode,
      managerCognitoId,
      ...propertyData
    } = req.body;

    const {
      availableDay,
      availableMonth,
      availableYear,
      ...cleanedData
    } = propertyData;

    // const photoUrls = await Promise.all(
    //   files.map(async (file) => {
    //     const uploadParams = {
    //       Bucket: process.env.S3_BUCKET_NAME!,
    //       Key: `properties/${Date.now()}-${file.originalname}`,
    //       Body: file.buffer,
    //       ContentType: file.mimetype,
    //     };

    //     const uploadResult = await new Upload({
    //       client: s3Client,
    //       params: uploadParams,
    //     }).done();

    //     return uploadResult.Location;
    //   })
    // );

    // Format the address for Mapbox
    const formattedAddress = `${address}, ${city}, ${state}, ${country}, ${postalCode}`.trim();
    const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      formattedAddress
    )}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&limit=1`;

    const geocodingResponse = await axios.get(mapboxUrl);

    if (
      !geocodingResponse.data.features ||
      geocodingResponse.data.features.length === 0
    ) {
      res.status(400).json({ message: "No results returned from geocoding service." });
      return;
    }

    const [longitude, latitude] = geocodingResponse.data.features[0].center;

    if (!longitude || !latitude) {
      res.status(400).json({ message: "Invalid geolocation data received." });
    }

    // Create location
    const [location] = await prisma.$queryRaw<Location[]>`
      INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
      VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
      RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
    `;

console.log(req.body); // see what’s actually coming in

    // Create property
    const newProperty = await prisma.property.create({
      data: {
        // ...propertyData,
        ...cleanedData,
        locationId: location.id,
        managerCognitoId,
        amenities:
          typeof propertyData.amenities === "string"
            ? propertyData.amenities.split(",")
            : [],
          roomAmenities:
          typeof propertyData.roomAmenities === "string"
            ? propertyData.roomAmenities.split(",")
            : [],
        highlights:
          typeof propertyData.highlights === "string"
            ? propertyData.highlights.split(",")
            : [],
        isPetsAllowed: propertyData.isPetsAllowed === "true",
        isParkingIncluded: propertyData.isParkingIncluded === "true",
        isOwnerOccupied: propertyData.isOwnerOccupied === "true",
        isSmokers: propertyData.isSmokers === "true",
        pricePerMonth: parseFloat(propertyData.pricePerMonth),
        roomNumber: parseInt(propertyData.roomNumber),
        securityDeposit: parseFloat(propertyData.securityDeposit),
        applicationFee: parseFloat(propertyData.applicationFee),
        roomType: propertyData.roomType, // Add roomType
        beds: parseInt(propertyData.beds),
        baths: parseFloat(propertyData.baths),
        squareFeet: parseInt(propertyData.squareFeet),
        lookingFor: propertyData.lookingFor,
        isRefNeeded: propertyData.isRefNeeded === "true",
        roomAdInfo: propertyData.roomAdInfo || "",
        minTerm: parseInt(propertyData.minTerm),
        maxTerm: propertyData.maxTerm ? parseInt(propertyData.maxTerm) : null,
        leaseLength: propertyData.leaseLength,
        availableFrom: new Date(propertyData.availableFrom),
        currentOccupantsDescription: propertyData.currentOccupantsDescription || "",
        kitchenDetails:
          typeof propertyData.kitchenDetails === "string"
            ? propertyData.kitchenDetails.split(",")
            : Array.isArray(propertyData.kitchenDetails)
            ? propertyData.kitchenDetails
            : [],

        communalAreas:
          typeof propertyData.communalAreas === "string"
            ? propertyData.communalAreas.split(",")
            : Array.isArray(propertyData.communalAreas)
            ? propertyData.communalAreas
            : [],

        laundry:
          typeof propertyData.laundry === "string"
            ? propertyData.laundry.split(",")
            : Array.isArray(propertyData.laundry)
            ? propertyData.laundry
            : [],

        securityFeatures:
          typeof propertyData.securityFeatures === "string"
            ? propertyData.securityFeatures.split(",")
            : Array.isArray(propertyData.securityFeatures)
            ? propertyData.securityFeatures
            : [],

        outdoorSpace:
          typeof propertyData.outdoorSpace === "string"
            ? propertyData.outdoorSpace.split(",")
            : Array.isArray(propertyData.outdoorSpace)
            ? propertyData.outdoorSpace
            : [],
      },
      include: {
        location: true,
        manager: true,
      },
    });

    res.status(201).json(newProperty);
  } catch (err: any) {
    console.error("Create Property Error:", err); // <- ADD THIS LINE
    res
      .status(500)
      .json({ message: `Error creating property: ${err.message}` });
  }
};


export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const propertyData = req.body;

    const updatedProperty = await prisma.property.update({
      where: { id: Number(id) },
      data: propertyData,
    });

    res.status(200).json(updatedProperty);
  } catch (error: any) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: `Error updating property: ${error.message}` });
  }
};