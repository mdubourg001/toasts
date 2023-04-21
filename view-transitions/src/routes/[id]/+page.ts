import { error } from "@sveltejs/kit";
import { getImage } from "../../api/getImage";

export const load = async ({ params }) => {
  const image = await getImage(params.id);

  if (!image) {
    throw error(404, "Not found");
  }

  return { image };
};
