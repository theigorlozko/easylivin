"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import { Property } from "@/types/prismaTypes";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Map = () => {
  const mapContainerRef = useRef(null);
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  useEffect(() => {
    if (isLoading || isError || !properties) return;
  
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/igorlozkodev/cmb11sta200f501qxbrru6dxp",
      center: filters.coordinates || [-6.2603, 53.3498],
      zoom: 9,
    });
  
    map.on("load", () => {
      // Only resize after the map is fully loaded
      setTimeout(() => map.resize(), 700);
  
      properties.forEach((property) => {
        const marker = createPropertyMarker(property, map);
        const markerElement = marker.getElement();
        const path = markerElement.querySelector("path[fill='#3FB1CE']");
        if (path) path.setAttribute("fill", "#000000");
      });
    });
  
    return () => map.remove();
  }, [isLoading, isError, properties, filters.coordinates]);

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  return (
    <div className="basis-5/12 grow relative rounded-xl pb-3">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const photo = property.photoUrls?.[0] || '/placeholder.jpg';
  const address = property.location?.address || '—';
  const city = property.location?.city || '—';
  const rating = property.averageRating?.toFixed(1) ?? '–';
  const type = property.propertyType || 'Property';

  const popupHtml = `
  <div style="
    width: 220px;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    cursor: pointer;
  " onclick="if (!event.target.closest('button')) window.open('/search/${property.id}', '_blank')">
    <div style="position: relative; height: 110px;">
      <img src="${photo}" alt="${property.name}" style="
        width: 100%;
        height: 100px;
        object-fit: cover;
        border-top-left-radius: 12px;
          border-top-right-radius: 12px;
      "/>
      <button style="
      position: absolute;
      top: 6px;
      right: 8px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 9999px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    " onclick="this.closest('.mapboxgl-popup').remove()" aria-label="Close popup">×</button>
    </div>
    <div style="padding: 10px 12px;">
      <h3 style="font-size: 15px; font-weight: 600; margin: 0 0 4px 0;">${property.name}</h3>
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${type} · ${city}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
        <span style="font-weight: 600; color: #22c55e;">€${property.pricePerMonth} <span style="font-weight: 400; color: #aaa;">/month</span></span>
        <span style="color: #facc15;">★ ${rating}</span>
      </div>
    </div>
  </div>
`;

  const marker = new mapboxgl.Marker({ color: '#22c55e' })
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude,
    ])
    .setPopup(
      new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: true,
        className: 'custom-popup', // optional, for CSS enhancements
      }).setHTML(popupHtml)
    )
    .addTo(map);

  return marker;
};

export default Map;
