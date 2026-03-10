import modeling from "@jscad/modeling";
import type Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import type Geom2 from "@jscad/modeling/src/geometries/geom2/type";
import type Path2 from "@jscad/modeling/src/geometries/path2/type";
import type { Bounds, Dim, JscadObject, AnyGeom } from "./types";
import {
  isLength,
  toCm,
  toMm,
  toM,
  toKm,
  toμm,
  toInch,
  toFt,
  toYd,
  toMile,
  type Unit,
} from "./measure";

const {
  primitives: {
    // 3D
    cuboid: jscadCuboid,
    cube: jscadCube,
    cylinder: jscadCylinder,
    cylinderElliptic: jscadCylinderElliptic,
    ellipsoid: jscadEllipsoid,
    geodesicSphere: jscadGeodesicSphere,
    polyhedron: jscadPolyhedron,
    roundedCuboid: jscadRoundedCuboid,
    roundedCylinder: jscadRoundedCylinder,
    sphere: jscadSphere,
    torus: jscadTorus,
    // 2D
    circle: jscadCircle,
    ellipse: jscadEllipse,
    polygon: jscadPolygon,
    rectangle: jscadRectangle,
    roundedRectangle: jscadRoundedRectangle,
    square: jscadSquare,
    star: jscadStar,
    triangle: jscadTriangle,
    // Paths
    arc: jscadArc,
    line: jscadLine,
  },
  measurements: { measureBoundingBox },
} = modeling;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Remove keys with `undefined` values from an object so that JSCAD's
 * `Object.assign({}, defaults, options)` pattern can apply its own defaults
 * instead of being overridden by explicit `undefined` values.
 */
function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  return result;
}

// ---------------------------------------------------------------------------
// DimResolver
// ---------------------------------------------------------------------------

/**
 * A resolver function that converts a Dim to a plain number in the builder's
 * configured coordinate unit. Created once per builder instance by createBuilder.
 */
export type DimResolver = (d: Dim) => number;

/**
 * Convert a Dim to a plain number in the given coordinate unit.
 * Raw numbers are treated as already being in that unit.
 * `Length` values are converted precisely.
 */
export function toBaseValue(d: Dim, coordinateUnit: Unit): number {
  if (!isLength(d)) return d;
  switch (coordinateUnit) {
    case "μm":   return toμm(d).value;
    case "mm":   return toMm(d).value;
    case "cm":   return toCm(d).value;
    case "m":    return toM(d).value;
    case "km":   return toKm(d).value;
    case "inch": return toInch(d).value;
    case "ft":   return toFt(d).value;
    case "yd":   return toYd(d).value;
    case "mile": return toMile(d).value;
  }
}

/**
 * Create a DimResolver bound to a specific coordinate unit.
 * This is what each builder instance uses internally.
 */
export function createDimResolver(coordinateUnit: Unit): DimResolver {
  return (d: Dim) => toBaseValue(d, coordinateUnit);
}

// ---------------------------------------------------------------------------
// Bounds helpers
// ---------------------------------------------------------------------------

/**
 * Compute bounds from raw JSCAD 3D geometry by calling measureBoundingBox once.
 * This is the only place the expensive O(vertices) call is made for Geom3.
 */
export function boundsFromGeom3(geom: Geom3 | Geom3[]): Bounds {
  const geoms = Array.isArray(geom) ? geom : [geom];
  if (geoms.length === 0) {
    return { min: [0, 0, 0], max: [0, 0, 0] };
  }
  if (geoms.length === 1) {
    const [[minX, minY, minZ], [maxX, maxY, maxZ]] = measureBoundingBox(geoms[0]);
    return { min: [minX, minY, minZ], max: [maxX, maxY, maxZ] };
  }
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (const g of geoms) {
    const [[x0, y0, z0], [x1, y1, z1]] = measureBoundingBox(g);
    if (x0 < minX) minX = x0;
    if (y0 < minY) minY = y0;
    if (z0 < minZ) minZ = z0;
    if (x1 > maxX) maxX = x1;
    if (y1 > maxY) maxY = y1;
    if (z1 > maxZ) maxZ = z1;
  }
  return { min: [minX, minY, minZ], max: [maxX, maxY, maxZ] };
}

/**
 * Compute bounds from raw JSCAD 2D geometry. Z is always [0, 0].
 */
export function boundsFromGeom2(geom: Geom2 | Geom2[]): Bounds {
  const geoms = Array.isArray(geom) ? geom : [geom];
  if (geoms.length === 0) return { min: [0, 0, 0], max: [0, 0, 0] };
  const [[minX, minY], [maxX, maxY]] = measureBoundingBox(geoms[0] as any);
  if (geoms.length === 1) return { min: [minX, minY, 0], max: [maxX, maxY, 0] };
  let lx = minX, ly = minY, hx = maxX, hy = maxY;
  for (let i = 1; i < geoms.length; i++) {
    const [[x0, y0], [x1, y1]] = measureBoundingBox(geoms[i] as any);
    if (x0 < lx) lx = x0;
    if (y0 < ly) ly = y0;
    if (x1 > hx) hx = x1;
    if (y1 > hy) hy = y1;
  }
  return { min: [lx, ly, 0], max: [hx, hy, 0] };
}

/**
 * Compute bounds from any JSCAD geometry (3D, 2D, or Path2).
 * For 2D/Path2 geometries, z bounds are [0, 0].
 */
export function boundsFromGeom(geom: AnyGeom | AnyGeom[]): Bounds {
  const geoms = Array.isArray(geom) ? geom : [geom];
  if (geoms.length === 0) return { min: [0, 0, 0], max: [0, 0, 0] };
  // Use measureBoundingBox for all — it handles all geometry types
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (const g of geoms) {
    const bb = measureBoundingBox(g as any);
    const x0 = bb[0][0], y0 = bb[0][1], z0 = (bb[0] as number[])[2] ?? 0;
    const x1 = bb[1][0], y1 = bb[1][1], z1 = (bb[1] as number[])[2] ?? 0;
    if (x0 < minX) minX = x0;
    if (y0 < minY) minY = y0;
    if (z0 < minZ) minZ = z0;
    if (x1 > maxX) maxX = x1;
    if (y1 > maxY) maxY = y1;
    if (z1 > maxZ) maxZ = z1;
  }
  return { min: [minX, minY, minZ], max: [maxX, maxY, maxZ] };
}

/**
 * Expand bounds to include another bounds — O(1) arithmetic.
 */
export function mergeBounds(a: Bounds, b: Bounds): Bounds {
  return {
    min: [
      Math.min(a.min[0], b.min[0]),
      Math.min(a.min[1], b.min[1]),
      Math.min(a.min[2], b.min[2]),
    ],
    max: [
      Math.max(a.max[0], b.max[0]),
      Math.max(a.max[1], b.max[1]),
      Math.max(a.max[2], b.max[2]),
    ],
  };
}

// ---------------------------------------------------------------------------
// fromGeom
// ---------------------------------------------------------------------------

/**
 * Wrap existing raw JSCAD geometry in a JscadObject.
 * `measureBoundingBox` is called once here to establish the bounds.
 * Accepts Geom3, Geom2, or Path2.
 */
export function fromGeom(geom: AnyGeom | AnyGeom[]): JscadObject {
  const geoms = Array.isArray(geom) ? geom : [geom];
  return {
    geom: geoms,
    bounds: boundsFromGeom(geoms),
  };
}

// ---------------------------------------------------------------------------
// 3D Primitives
// ---------------------------------------------------------------------------

/**
 * Create a cuboid (box). Origin is at the bottom-left-front corner.
 * The JSCAD function is `cuboid` — this matches that name exactly.
 *
 * @param size - [width, height, depth] in the builder's coordinate unit
 *
 * @example
 * const { cuboid } = createBuilder({ coordinateUnit: 'mm' })
 * cuboid({ size: [50, 100, 30] })
 */
export function makeCuboid(resolve: DimResolver) {
  return function cuboid(opts: { size: [Dim, Dim, Dim]; center?: [Dim, Dim, Dim] }): JscadObject {
    const [w, h, d] = opts.size.map(resolve) as [number, number, number];
    const cx = opts.center ? resolve(opts.center[0]) : w / 2;
    const cy = opts.center ? resolve(opts.center[1]) : h / 2;
    const cz = opts.center ? resolve(opts.center[2]) : d / 2;
    const geom = jscadCuboid({ size: [w, h, d], center: [cx, cy, cz] });
    const halfW = w / 2, halfH = h / 2, halfD = d / 2;
    return {
      geom: [geom],
      bounds: { min: [cx - halfW, cy - halfH, cz - halfD], max: [cx + halfW, cy + halfH, cz + halfD] },
    };
  };
}

/**
 * Create a cube (equal side lengths). Origin is at the bottom-left-front corner.
 *
 * @param opts.size - side length (scalar)
 *
 * @example
 * cube({ size: 50 })
 */
export function makeCube(resolve: DimResolver) {
  return function cube(opts?: { size?: Dim; center?: [Dim, Dim, Dim] }): JscadObject {
    const s = resolve(opts?.size ?? 1);
    const cx = opts?.center ? resolve(opts.center[0]) : s / 2;
    const cy = opts?.center ? resolve(opts.center[1]) : s / 2;
    const cz = opts?.center ? resolve(opts.center[2]) : s / 2;
    const geom = jscadCube({ size: s, center: [cx, cy, cz] });
    const half = s / 2;
    return {
      geom: [geom],
      bounds: { min: [cx - half, cy - half, cz - half], max: [cx + half, cy + half, cz + half] },
    };
  };
}

/**
 * Create a cylinder.
 *
 * @param opts.height   - height along Y axis
 * @param opts.radius   - radius of the circular cross-section
 * @param opts.segments - number of facets (default 32)
 *
 * @example
 * cylinder({ height: 100, radius: 20 })
 */
export function makeCylinder(resolve: DimResolver) {
  return function cylinder(opts?: {
    center?: [Dim, Dim, Dim];
    height?: Dim;
    radius?: Dim;
    segments?: number;
  }): JscadObject {
    const h = resolve(opts?.height ?? 1);
    const r = resolve(opts?.radius ?? 1);
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const cz = opts?.center ? resolve(opts.center[2]) : 0;
    const geom = jscadCylinder(compact({ height: h, radius: r, segments: opts?.segments, center: [cx, cy, cz] }) as any);
    return {
      geom: [geom],
      bounds: boundsFromGeom3(geom),
    };
  };
}

/**
 * Create an elliptic cylinder (optionally tapered — can produce a cone).
 *
 * @example
 * cylinderElliptic({ height: 100, startRadius: [20, 20], endRadius: [10, 10] })
 */
export function makeCylinderElliptic(resolve: DimResolver) {
  return function cylinderElliptic(opts?: {
    center?: [Dim, Dim, Dim];
    height?: Dim;
    startRadius?: [Dim, Dim];
    endRadius?: [Dim, Dim];
    startAngle?: number;
    endAngle?: number;
    segments?: number;
  }): JscadObject {
    const h = resolve(opts?.height ?? 1);
    const sr = opts?.startRadius ? [resolve(opts.startRadius[0]), resolve(opts.startRadius[1])] as [number, number] : [1, 1] as [number, number];
    const er = opts?.endRadius   ? [resolve(opts.endRadius[0]),   resolve(opts.endRadius[1])]   as [number, number] : [1, 1] as [number, number];
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const cz = opts?.center ? resolve(opts.center[2]) : 0;
    const geom = jscadCylinderElliptic(compact({
      height: h,
      startRadius: sr,
      endRadius: er,
      startAngle: opts?.startAngle,
      endAngle: opts?.endAngle,
      segments: opts?.segments,
      center: [cx, cy, cz],
    }) as any);
    return { geom: [geom], bounds: boundsFromGeom3(geom) };
  };
}

/**
 * Create an ellipsoid.
 *
 * @param opts.radius - [rx, ry, rz] radii
 *
 * @example
 * ellipsoid({ radius: [50, 30, 20] })
 */
export function makeEllipsoid(resolve: DimResolver) {
  return function ellipsoid(opts?: {
    center?: [Dim, Dim, Dim];
    radius?: [Dim, Dim, Dim];
    segments?: number;
  }): JscadObject {
    const r = opts?.radius
      ? (opts.radius.map(resolve) as [number, number, number])
      : ([1, 1, 1] as [number, number, number]);
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const cz = opts?.center ? resolve(opts.center[2]) : 0;
    const geom = jscadEllipsoid(compact({ radius: r, segments: opts?.segments, center: [cx, cy, cz] }) as any);
    return { geom: [geom], bounds: boundsFromGeom3(geom) };
  };
}

/**
 * Create a geodesic sphere (triangle-mesh approximation).
 *
 * @param opts.radius    - sphere radius
 * @param opts.frequency - subdivision frequency (higher = smoother)
 *
 * @example
 * geodesicSphere({ radius: 50, frequency: 4 })
 */
export function makeGeodesicSphere(resolve: DimResolver) {
  return function geodesicSphere(opts?: {
    radius?: Dim;
    frequency?: number;
  }): JscadObject {
    const r = resolve(opts?.radius ?? 1);
    const geom = jscadGeodesicSphere({ radius: r, frequency: opts?.frequency });
    return { geom: [geom], bounds: boundsFromGeom3(geom) };
  };
}

/**
 * Create a polyhedron from explicit points and faces.
 *
 * @example
 * polyhedron({
 *   points: [[0,0,0],[10,0,0],[5,10,0],[5,5,10]],
 *   faces: [[0,1,2],[0,1,3],[1,2,3],[0,2,3]],
 * })
 */
export function makePolyhedron(resolve: DimResolver) {
  return function polyhedron(opts: {
    points: [Dim, Dim, Dim][];
    faces: number[][];
    colors?: ([number, number, number] | [number, number, number, number])[];
    orientation?: "outward" | "inward";
  }): JscadObject {
    const resolvedPoints = opts.points.map(([x, y, z]) => [resolve(x), resolve(y), resolve(z)] as [number, number, number]);
    const geom = jscadPolyhedron({
      points: resolvedPoints,
      faces: opts.faces,
      colors: opts.colors as any,
      orientation: opts.orientation,
    });
    return { geom: [geom], bounds: boundsFromGeom3(geom) };
  };
}

/**
 * Create a rounded cuboid (box with rounded edges).
 *
 * @param opts.size        - [width, height, depth]
 * @param opts.roundRadius - radius of the edge rounding
 * @param opts.segments    - number of facets for rounding
 *
 * @example
 * roundedCuboid({ size: [50, 50, 50], roundRadius: 5 })
 */
export function makeRoundedCuboid(resolve: DimResolver) {
  return function roundedCuboid(opts?: {
    center?: [Dim, Dim, Dim];
    size?: [Dim, Dim, Dim];
    roundRadius?: Dim;
    segments?: number;
  }): JscadObject {
    const s = opts?.size
      ? (opts.size.map(resolve) as [number, number, number])
      : ([1, 1, 1] as [number, number, number]);
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const cz = opts?.center ? resolve(opts.center[2]) : 0;
    const geom = jscadRoundedCuboid(compact({
      size: s,
      roundRadius: opts?.roundRadius !== undefined ? resolve(opts.roundRadius) : undefined,
      segments: opts?.segments,
      center: [cx, cy, cz],
    }) as any);
    return { geom: [geom], bounds: boundsFromGeom3(geom) };
  };
}

/**
 * Create a cylinder with rounded (hemispherical) caps.
 *
 * @example
 * roundedCylinder({ height: 100, radius: 20, roundRadius: 5 })
 */
export function makeRoundedCylinder(resolve: DimResolver) {
  return function roundedCylinder(opts?: {
    center?: [Dim, Dim, Dim];
    height?: Dim;
    radius?: Dim;
    roundRadius?: Dim;
    segments?: number;
  }): JscadObject {
    const h = resolve(opts?.height ?? 1);
    const r = resolve(opts?.radius ?? 1);
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const cz = opts?.center ? resolve(opts.center[2]) : 0;
    const geom = jscadRoundedCylinder(compact({
      height: h,
      radius: r,
      roundRadius: opts?.roundRadius !== undefined ? resolve(opts.roundRadius) : undefined,
      segments: opts?.segments,
      center: [cx, cy, cz],
    }) as any);
    return { geom: [geom], bounds: boundsFromGeom3(geom) };
  };
}

/**
 * Create a UV sphere.
 *
 * @param opts.radius   - sphere radius
 * @param opts.segments - number of facets (default 32)
 *
 * @example
 * sphere({ radius: 50 })
 */
export function makeSphere(resolve: DimResolver) {
  return function sphere(opts?: {
    center?: [Dim, Dim, Dim];
    radius?: Dim;
    segments?: number;
  }): JscadObject {
    const r = resolve(opts?.radius ?? 1);
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const cz = opts?.center ? resolve(opts.center[2]) : 0;
    const geom = jscadSphere(compact({ radius: r, segments: opts?.segments, center: [cx, cy, cz] }) as any);
    return { geom: [geom], bounds: boundsFromGeom3(geom) };
  };
}

/**
 * Create a torus (donut shape).
 *
 * @param opts.innerRadius - radius of the tube
 * @param opts.outerRadius - radius from the center of the torus to the center of the tube
 *
 * @example
 * torus({ outerRadius: 60, innerRadius: 15 })
 */
export function makeTorus(resolve: DimResolver) {
  return function torus(opts?: {
    innerRadius?: Dim;
    outerRadius?: Dim;
    innerSegments?: number;
    outerSegments?: number;
    innerRotation?: number;
    outerRotation?: number;
    startAngle?: number;
  }): JscadObject {
    const geom = jscadTorus(compact({
      innerRadius: opts?.innerRadius !== undefined ? resolve(opts.innerRadius) : undefined,
      outerRadius: opts?.outerRadius !== undefined ? resolve(opts.outerRadius) : undefined,
      innerSegments: opts?.innerSegments,
      outerSegments: opts?.outerSegments,
      innerRotation: opts?.innerRotation,
      outerRotation: opts?.outerRotation,
      startAngle: opts?.startAngle,
    }) as any);
    return { geom: [geom], bounds: boundsFromGeom3(geom) };
  };
}

// ---------------------------------------------------------------------------
// 2D Primitives
// ---------------------------------------------------------------------------

/**
 * Create a 2D circle.
 *
 * @example
 * circle({ radius: 50 })
 */
export function makeCircle(resolve: DimResolver) {
  return function circle(opts?: {
    center?: [Dim, Dim];
    radius?: Dim;
    startAngle?: number;
    endAngle?: number;
    segments?: number;
  }): JscadObject {
    const r = resolve(opts?.radius ?? 1);
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const geom = jscadCircle(compact({ radius: r, center: [cx, cy], startAngle: opts?.startAngle, endAngle: opts?.endAngle, segments: opts?.segments }) as any);
    return { geom: [geom], bounds: boundsFromGeom2(geom) };
  };
}

/**
 * Create a 2D ellipse.
 *
 * @example
 * ellipse({ radius: [50, 30] })
 */
export function makeEllipse(resolve: DimResolver) {
  return function ellipse(opts?: {
    center?: [Dim, Dim];
    radius?: [Dim, Dim];
    startAngle?: number;
    endAngle?: number;
    segments?: number;
  }): JscadObject {
    const r = opts?.radius
      ? ([resolve(opts.radius[0]), resolve(opts.radius[1])] as [number, number])
      : ([1, 1] as [number, number]);
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const geom = jscadEllipse(compact({ radius: r, center: [cx, cy], startAngle: opts?.startAngle, endAngle: opts?.endAngle, segments: opts?.segments }) as any);
    return { geom: [geom], bounds: boundsFromGeom2(geom) };
  };
}

/**
 * Create a 2D polygon from an array of points (or multiple contours).
 *
 * @example
 * polygon({ points: [[0,0],[10,0],[5,10]] })
 */
export function makePolygon(resolve: DimResolver) {
  return function polygon(opts: {
    points: [Dim, Dim][] | [Dim, Dim][][];
    paths?: number[] | number[][];
    orientation?: "counterclockwise" | "clockwise";
  }): JscadObject {
    // Resolve all points regardless of single-contour or multi-contour format
    const resolvedPoints = (opts.points as [Dim, Dim][][]).map((p) =>
      Array.isArray(p[0])
        ? (p as [Dim, Dim][]).map(([x, y]) => [resolve(x), resolve(y)] as [number, number])
        : ([resolve(p[0] as Dim), resolve(p[1] as Dim)] as [number, number])
    );
    const geom = jscadPolygon({ points: resolvedPoints as any, paths: opts.paths as any, orientation: opts.orientation });
    return { geom: [geom], bounds: boundsFromGeom2(geom) };
  };
}

/**
 * Create a 2D rectangle.
 *
 * @example
 * rectangle({ size: [50, 30] })
 */
export function makeRectangle(resolve: DimResolver) {
  return function rectangle(opts?: {
    center?: [Dim, Dim];
    size?: [Dim, Dim];
  }): JscadObject {
    const s = opts?.size
      ? ([resolve(opts.size[0]), resolve(opts.size[1])] as [number, number])
      : ([1, 1] as [number, number]);
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const geom = jscadRectangle({ size: s, center: [cx, cy] });
    return { geom: [geom], bounds: boundsFromGeom2(geom) };
  };
}

/**
 * Create a 2D rectangle with rounded corners.
 *
 * @example
 * roundedRectangle({ size: [50, 30], roundRadius: 5 })
 */
export function makeRoundedRectangle(resolve: DimResolver) {
  return function roundedRectangle(opts?: {
    center?: [Dim, Dim];
    size?: [Dim, Dim];
    roundRadius?: Dim;
    segments?: number;
  }): JscadObject {
    const s = opts?.size
      ? ([resolve(opts.size[0]), resolve(opts.size[1])] as [number, number])
      : ([1, 1] as [number, number]);
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const geom = jscadRoundedRectangle(compact({
      size: s,
      center: [cx, cy],
      roundRadius: opts?.roundRadius !== undefined ? resolve(opts.roundRadius) : undefined,
      segments: opts?.segments,
    }) as any);
    return { geom: [geom], bounds: boundsFromGeom2(geom) };
  };
}

/**
 * Create a 2D square (equal side lengths).
 *
 * @example
 * square({ size: 50 })
 */
export function makeSquare(resolve: DimResolver) {
  return function square(opts?: {
    center?: [Dim, Dim];
    size?: Dim;
  }): JscadObject {
    const s = resolve(opts?.size ?? 1);
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const geom = jscadSquare({ size: s, center: [cx, cy] });
    return { geom: [geom], bounds: boundsFromGeom2(geom) };
  };
}

/**
 * Create a 2D star polygon.
 *
 * @example
 * star({ outerRadius: 50, innerRadius: 25, vertices: 5 })
 */
export function makeStar(resolve: DimResolver) {
  return function star(opts?: {
    center?: [Dim, Dim];
    vertices?: number;
    density?: number;
    outerRadius?: Dim;
    innerRadius?: Dim;
    startAngle?: number;
  }): JscadObject {
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const geom = jscadStar(compact({
      center: [cx, cy],
      vertices: opts?.vertices,
      density: opts?.density,
      outerRadius: opts?.outerRadius !== undefined ? resolve(opts.outerRadius) : undefined,
      innerRadius: opts?.innerRadius !== undefined ? resolve(opts.innerRadius) : undefined,
      startAngle: opts?.startAngle,
    }) as any);
    return { geom: [geom], bounds: boundsFromGeom2(geom) };
  };
}

/**
 * Create a 2D triangle using the specified construction method.
 *
 * @param opts.type   - construction type: 'SSS', 'SSA', 'SAS', 'ASA', 'AAS', 'AAA'
 * @param opts.values - three numeric values matching the chosen type
 *
 * @example
 * triangle({ type: 'SSS', values: [30, 40, 50] })
 */
export function makeTriangle() {
  return function triangle(opts?: {
    type?: "AAA" | "AAS" | "ASA" | "SAS" | "SSA" | "SSS";
    values?: [number, number, number];
  }): JscadObject {
    const geom = jscadTriangle({ type: opts?.type, values: opts?.values });
    return { geom: [geom], bounds: boundsFromGeom2(geom) };
  };
}

// ---------------------------------------------------------------------------
// Path Primitives
// ---------------------------------------------------------------------------

/**
 * Create a 2D arc path.
 *
 * @example
 * arc({ radius: 50, startAngle: 0, endAngle: Math.PI })
 */
export function makeArc(resolve: DimResolver) {
  return function arc(opts?: {
    center?: [Dim, Dim];
    radius?: Dim;
    startAngle?: number;
    endAngle?: number;
    segments?: number;
    makeTangent?: boolean;
  }): JscadObject {
    const r = resolve(opts?.radius ?? 1);
    const cx = opts?.center ? resolve(opts.center[0]) : 0;
    const cy = opts?.center ? resolve(opts.center[1]) : 0;
    const geom = jscadArc(compact({ radius: r, center: [cx, cy], startAngle: opts?.startAngle, endAngle: opts?.endAngle, segments: opts?.segments, makeTangent: opts?.makeTangent }) as any);
    return { geom: [geom], bounds: boundsFromGeom(geom) };
  };
}

/**
 * Create a 2D straight line path from an ordered array of 2D points.
 *
 * @example
 * line([[0, 0], [50, 50], [100, 0]])
 */
export function makeLine(resolve: DimResolver) {
  return function line(points: [Dim, Dim][]): JscadObject {
    const resolved = points.map(([x, y]) => [resolve(x), resolve(y)] as [number, number]);
    const geom = jscadLine(resolved);
    return { geom: [geom], bounds: boundsFromGeom(geom) };
  };
}
