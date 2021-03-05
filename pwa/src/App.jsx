import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import Header from "./components/Header";
import useISSCoordinates from "./hooks/useISSCoordinates";
import { REFRESH_INTERVAL } from "./constants";

export default function App() {
  const [refreshIn, setRefreshIn] = useState(REFRESH_INTERVAL / 1000);
  const [map, setMap] = useState(null);
  const { coordinates, loading, refresh } = useISSCoordinates(REFRESH_INTERVAL);

  const handleRefresh = useCallback(() => {
    refresh();
    setRefreshIn(REFRESH_INTERVAL / 1000);
  }, [refresh]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshIn > 1) {
        setRefreshIn(refreshIn - 1);
      } else {
        setRefreshIn(REFRESH_INTERVAL / 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [refreshIn]);

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

        <button
          onClick={handleRefresh}
          className="w-3/4 relative mt-6 mx-auto bg-yellow-400 px-4 py-3 font-brand"
        >
          <span className="tabular-nums absolute left-4 text-gray-500">
            {refreshIn < 10 ? "0" + refreshIn : refreshIn}s
          </span>
          <span>{loading ? "REFRESHING..." : "REFRESH NOW !"} </span>
        </button>
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
