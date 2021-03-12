// @ts-nocheck

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import Header from "./components/Header";
import useISSCoordinates from "./hooks/useISSCoordinates";
import { REFRESH_INTERVAL, BORDEAUX_COORDINATES } from "./constants";
import { isOld, getFormattedTime } from "./utils";

export default function App() {
  const [map, setMap] = useState(null);
  const {
    timestamp,
    coordinates,
    loading,
    refreshIn,
    refresh,
  } = useISSCoordinates(REFRESH_INTERVAL);

  const isDataOld = isOld(timestamp);

  console.log(isDataOld, timestamp);

  useEffect(() => {
    if (map && coordinates) {
      map.flyTo([coordinates.latitude, coordinates.longitude]);
    }
  }, [coordinates]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      <section className="container flex flex-col justify-center flex-1 p-4 mx-auto text-center">
        <h2 className="mb-4 text-lg text-gray-500 font-brand">
          {isDataOld
            ? `AT ${getFormattedTime(timestamp)}, THE ISS WAS AT`
            : "THE ISS IS CURRENTLY AT"}
        </h2>

        <strong className="text-2xl font-normal">
          <small className="text-xs text-gray-500">LAT. </small>
          <span className="tabular-nums">{coordinates?.latitude ?? "--"}</span>,
          &nbsp;
          <small className="text-xs text-gray-500">LONG. </small>
          <span className="tabular-nums">{coordinates?.longitude ?? "--"}</span>
        </strong>

        <button
          disabled={isDataOld}
          onClick={refresh}
          className={`relative w-3/4 px-4 py-3 mx-auto mt-6 bg-${
            isDataOld ? "gray-300" : "yellow-400"
          } font-brand`}
        >
          <span className="absolute text-gray-500 tabular-nums left-4">
            {refreshIn < 10 ? "0" + refreshIn : refreshIn}s
          </span>
          <span>
            {isDataOld
              ? "CAN'T FETCH :("
              : loading
              ? "REFRESHING..."
              : "REFRESH NOW !"}{" "}
          </span>
        </button>
      </section>

      <div className="m-4 mt-auto bg-white border-2 border-yellow-400">
        <MapContainer
          center={
            coordinates
              ? [coordinates.latitude, coordinates.longitude]
              : BORDEAUX_COORDINATES
          }
          zoom={2}
          scrollWheelZoom={false}
          className="h-64"
          whenCreated={setMap}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {coordinates && (
            <CircleMarker
              center={[coordinates.latitude, coordinates.longitude]}
              pathOptions={{ color: isDataOld ? "#d1d5db" : "#FBBF24" }}
              radius={20}
            >
              <Tooltip>The ISS is here !</Tooltip>
            </CircleMarker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
