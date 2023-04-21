import { getImages } from "../api/getImages";

export const load = async () => {
  const images = await getImages();
  const shuffled = [...images].slice(0, 20);

  // for (let i = shuffled.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  // }

  return { images: shuffled };
};
