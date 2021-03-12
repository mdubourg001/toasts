import { useState, useRef, useEffect, useCallback } from "react";

import { getCurrentTimestamp } from "../utils";

export default function useISSCoordinates(refreshInterval) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const fetchInterval = useRef(null);

  const fetchISSCoordinates = useCallback(() => {
    setLoading(true);

    return fetch(`http://api.open-notify.org/iss-now.json`)
      .then((response) => response.json())
      .then((coordinates) => {
        setLoading(false);

        clearInterval(fetchInterval.current);
        fetchInterval.current = setInterval(fetchAndSet, refreshInterval);

        return coordinates;
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
    refresh: () => fetchAndSet(),
  };
}
