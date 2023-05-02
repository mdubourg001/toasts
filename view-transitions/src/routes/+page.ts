import { getImages } from "../api/getImages";

function shuffle(array: any[], seed: number) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  seed = seed || 1;
  let random = function () {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

export const load = async () => {
  const images = await getImages();
  const seed = Math.floor(Math.random() * 1000);

  if (!window.__seed) {
    window.__seed = seed;
  }

  return { images: shuffle(images, window.__seed) };
};
