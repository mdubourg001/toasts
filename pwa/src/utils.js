import { REFRESH_INTERVAL } from "./constants";

export function getCurrentTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function isOld(timestamp, threshold = (REFRESH_INTERVAL / 1000) * 1.5) {
  return getCurrentTimestamp() - timestamp > threshold;
}

export function getFormattedTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString();
}
