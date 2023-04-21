import { getImages } from "../api/getImages";

export const load = async () => {
  const images = await getImages();

  return { images };
};
