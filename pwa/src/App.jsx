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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      {!coordinates ? (
        <>"Loading..."</>
      ) : (
        <>
          <section className="container flex flex-col justify-center flex-1 p-4 mx-auto text-center">
            <h2 className="mb-4 text-lg text-gray-500 font-brand">
              THE ISS IS CURRENTLY AT
            </h2>
            <strong className="text-2xl font-normal">
              <small className="text-xs text-gray-500">LAT. </small>
              <span className="tabular-nums">{coordinates?.latitude}</span>,
              &nbsp;
              <small className="text-xs text-gray-500">LONG. </small>
              <span className="tabular-nums">{coordinates?.longitude}</span>
            </strong>

            <button
              onClick={handleRefresh}
              className="relative w-3/4 px-4 py-3 mx-auto mt-6 bg-yellow-400 font-brand"
            >
              <span className="absolute text-gray-500 tabular-nums left-4">
                {refreshIn < 10 ? "0" + refreshIn : refreshIn}s
              </span>
              <span>{loading ? "REFRESHING..." : "REFRESH NOW !"} </span>
            </button>
          </section>

          <div className="m-4 mt-auto bg-white border-2 border-yellow-400">
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
        </>
      )}
    </div>
  );
}
