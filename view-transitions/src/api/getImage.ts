import { getImages } from "./getImages";

export async function getImage(id: string) {
  const images = await getImages();

  return images.find((image) => image.id === id);
}
