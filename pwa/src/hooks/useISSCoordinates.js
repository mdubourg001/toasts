import useSWR from "swr";

export default function useISSCoordinates(refreshInterval = 1000) {
  const { data, isValidating } = useSWR(
    `http://api.open-notify.org/iss-now.json`,
    {
      refreshInterval,
    }
  );

  return {
    coordinates: data?.iss_position
      ? {
          latitude: Number.parseFloat(data?.iss_position.latitude),
          longitude: Number.parseFloat(data?.iss_position.longitude),
        }
      : undefined,
    loading: isValidating,
  };
}
