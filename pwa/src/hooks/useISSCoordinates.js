import { useState, useRef, useEffect, useCallback } from "react";

import { REFRESH_INTERVAL } from "../constants";
import { getCurrentTimestamp } from "../utils";

export default function useISSCoordinates(refreshInterval) {
  const [refreshIn, setRefreshIn] = useState(REFRESH_INTERVAL / 1000);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const fetchInterval = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (loading) return;

      if (refreshIn > 1) {
        setRefreshIn(refreshIn - 1);
      } else {
        setRefreshIn(REFRESH_INTERVAL / 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [refreshIn, loading]);

  const fetchISSCoordinates = useCallback(() => {
    setLoading(true);
    setRefreshIn(0);

    return fetch(`http://api.open-notify.org/iss-now.json`)
      .then((response) => response.json())
      .finally(() => {
        setLoading(false);
        setRefreshIn(REFRESH_INTERVAL / 1000);

        clearInterval(fetchInterval.current);
        fetchInterval.current = setInterval(fetchAndSet, refreshInterval);
      });
  }, [fetchInterval]);

  const fetchAndSet = useCallback(
    () => fetchISSCoordinates().then(setData),
    []
  );

  useEffect(() => {
    fetchAndSet();

    () => clearInterval(fetchInterval.current);
  }, []);

  return {
    timestamp: data?.timestamp ?? getCurrentTimestamp(),
    coordinates: data?.iss_position
      ? {
          latitude: Number.parseFloat(data?.iss_position.latitude),
          longitude: Number.parseFloat(data?.iss_position.longitude),
        }
      : undefined,
    loading,
    refreshIn,
    refresh: fetchAndSet,
  };
}
