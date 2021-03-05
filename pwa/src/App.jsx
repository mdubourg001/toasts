import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import Header from "./components/Header";
import useISSCoordinates from "./hooks/useISSCoordinates";

export default function App() {
  const [map, setMap] = useState(null);
  const { coordinates } = useISSCoordinates(3000);

  useEffect(() => {
    if (map && coordinates) {
      map.flyTo([coordinates.latitude, coordinates.longitude]);
    }
  }, [coordinates]);

  if (!coordinates) {
    return "Loading...";
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />

      <section className="flex flex-col flex-1 container mx-auto p-4 text-center justify-center">
        <h2 className="font-brand text-lg text-gray-500 mb-4">
          THE ISS IS CURRENTLY AT
        </h2>
        <strong className="font-normal text-2xl">
          <small className="text-gray-500 text-xs">LAT. </small>
          <span className="tabular-nums">{coordinates?.latitude}</span>, &nbsp;
          <small className="text-gray-500 text-xs">LONG. </small>
          <span className="tabular-nums">{coordinates?.longitude}</span>
        </strong>
      </section>

      <div className="m-4 border-2 border-yellow-400 mt-auto bg-white">
        <MapContainer
          center={[coordinates.latitude, coordinates.longitude]}
          zoom={2}
          scrollWheelZoom={false}
          className="h-64"
          whenCreated={setMap}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <CircleMarker
            center={[coordinates.latitude, coordinates.longitude]}
            pathOptions={{ color: "#FBBF24" }}
            radius={20}
          >
            <Tooltip>Tooltip for CircleMarker</Tooltip>
          </CircleMarker>
        </MapContainer>
      </div>
    </div>
  );
}
