import { materialId, type Materials } from "@jscad/types";

const roomAlpha = 0.7;

export const materials = {
  Debug: {
    id: materialId([1, 0, 0]),
    color: [1, 0, 0, roomAlpha],
    outline: [0, 0, 0, 0.3],
    three: {
      threeType: "MeshPhongMaterial" as const,
      color: 0xff0000,
      specular: 0x222222,
      shininess: 10,
    },
  },
  Wall: {
    id: materialId([0.85, 0.82, 0.78]),
    color: [0.85, 0.82, 0.78, roomAlpha],
    outline: { color: [0, 0, 0, 0.1], thickness: 3 },
    three: {
      threeType: "MeshPhongMaterial" as const,
      color: 0xd9d1c7,
      specular: 0x222222,
      shininess: 10,
    },
  },
  Floor: {
    id: materialId([0.6, 0.45, 0.3]),
    color: [0.6, 0.45, 0.3, roomAlpha],
    three: {
      threeType: "MeshPhongMaterial" as const,
      color: 0x996633,
      specular: 0x111111,
      shininess: 5,
    },
  },
  Furniture: {
    id: materialId([1, 1, 1]),
    color: [1, 1, 1],
    outline: { color: [0, 0, 0], thickness: 3 },
    three: {
      threeType: "MeshPhongMaterial" as const,
      color: 0xffffff,
      specular: 0x111111,
      shininess: 5,
    },
  },
} as const satisfies Materials;
