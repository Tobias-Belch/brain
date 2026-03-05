import { materialId, type Materials } from "@jscad/types";

const roomAlpha = 0.3;

export const materials = {
  Debug: {
    id: materialId([1, 0, 0, roomAlpha]),
    color: [1, 0, 0, roomAlpha] as [number, number, number, number],
    outline: [0, 0, 0, 0.3] as [number, number, number, number],
    three: {
      threeType: "MeshPhongMaterial" as const,
      color: 0xff0000,
      specular: 0x222222,
      shininess: 10,
    },
  },
  Wall: {
    id: materialId([0.85, 0.82, 0.78, roomAlpha]),
    color: [0.85, 0.82, 0.78, roomAlpha] as [number, number, number, number],
    outline: [0, 0, 0, 0.3] as [number, number, number, number],
    three: {
      threeType: "MeshPhongMaterial" as const,
      color: 0xd9d1c7,
      specular: 0x222222,
      shininess: 10,
    },
  },
  Floor: {
    id: materialId([0.6, 0.45, 0.3, roomAlpha]),
    color: [0.6, 0.45, 0.3, roomAlpha] as [number, number, number, number],
    outline: [0, 0, 0, 0.2] as [number, number, number, number],
    three: {
      threeType: "MeshPhongMaterial" as const,
      color: 0x996633,
      specular: 0x111111,
      shininess: 5,
    },
  },
  Furniture: {
    id: materialId([0, 0.4, 0.6]),
    color: [0, 0.4, 0.6] as [number, number, number],
    outline: [0, 0.2, 0.2, 0.5] as [number, number, number, number],
    three: {
      threeType: "MeshPhongMaterial" as const,
      color: 0x006699,
      specular: 0x111111,
      shininess: 5,
    },
  },
} as const satisfies Materials;
