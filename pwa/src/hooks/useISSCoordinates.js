import { useState, useEffect, useCallback } from "react";

export default function useISSCoordinates(refreshInterval) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [fetchInterval, setFetchInterval] = useState(null);

  const fetchISSCoordinates = useCallback(() => {
    setLoading(true);

    return fetch(`http://api.open-notify.org/iss-now.json`)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        return data;
      });
  }, []);

  const activateInterval = useCallback(() => {
    const interval = setInterval(fetchAndSet, refreshInterval);
    setFetchInterval(interval);

    return interval;
  }, [refreshInterval]);

  const fetchAndSet = useCallback(
    (force = false) => {
      if (force) {
        clearInterval(fetchInterval);
        activateInterval();
      }

      fetchISSCoordinates().then(setData);
    },
    [fetchInterval]
  );

  useEffect(() => {
    fetchAndSet();
    const interval = activateInterval();

    () => clearInterval(interval);
  }, []);

  return {
    coordinates: data?.iss_position
      ? {
          latitude: Number.parseFloat(data?.iss_position.latitude),
          longitude: Number.parseFloat(data?.iss_position.longitude),
        }
      : undefined,
    loading,
    refresh: () => fetchAndSet(true),
  };
}
