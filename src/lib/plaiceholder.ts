import "server-only";

import { getPlaiceholder } from "plaiceholder";

export const getImage = async (src: string) => {
  const buffer = await fetch(src).then(async (res) =>
    Buffer.from(await res.arrayBuffer()),
  );

  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer);

  return { ...plaiceholder, img: { src, height, width } };
};
