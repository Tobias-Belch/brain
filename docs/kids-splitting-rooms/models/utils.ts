import { type JscadObject, type AnyGeom } from "@jscad/builder";

/**
 * Merge multiple JscadObjects into one by concatenating their geometry arrays
 * and expanding bounds. No boolean CSG — each piece stays a separate solid.
 *
 * The origin of the group is inherited from the first child, which is the
 * logical anchor for the whole assembly.
 */
export function group(...objs: JscadObject[]): JscadObject {
  if (objs.length === 0) {
    return { geom: [], bounds: { min: [0, 0, 0], max: [0, 0, 0] }, origin: { x: 0, y: 0, z: 0 } };
  }
  return {
    geom: ([] as AnyGeom[]).concat(...objs.map((o) => o.geom)),
    bounds: objs.reduce(
      (acc, o) => ({
        min: [
          Math.min(acc.min[0], o.bounds.min[0]),
          Math.min(acc.min[1], o.bounds.min[1]),
          Math.min(acc.min[2], o.bounds.min[2]),
        ] as [number, number, number],
        max: [
          Math.max(acc.max[0], o.bounds.max[0]),
          Math.max(acc.max[1], o.bounds.max[1]),
          Math.max(acc.max[2], o.bounds.max[2]),
        ] as [number, number, number],
      }),
      objs[0].bounds,
    ),
    origin: objs[0].origin,
  };
}
