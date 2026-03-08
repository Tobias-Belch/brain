import modeling from "@jscad/modeling";
import { type NumberWithUnit, toCm } from "@pocs/values";

const {
  primitives: { cuboid },
} = modeling;

export function box(w: number, h: number, d: number) {
  return cuboid({
    size: [w, h, d],
    center: [w / 2, h / 2, d / 2],
  });
}

export function normalize(value: NumberWithUnit): number {
  return toCm(value).value;
}
