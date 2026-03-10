import type Geom3 from "@jscad/modeling/src/geometries/geom3/type";
import type Geom2 from "@jscad/modeling/src/geometries/geom2/type";
import type Path2 from "@jscad/modeling/src/geometries/path2/type";
import type { Length } from "./measure";

/**
 * A scalar dimension — either a raw number (interpreted as the builder's
 * configured coordinate unit) or a unit-tagged `Length` value that is
 * normalised to the configured unit internally.
 *
 * Angle values (`deg()`, `rad()`) are intentionally excluded: passing an
 * angle where a length is expected is a compile-time type error.
 *
 * @example
 * cuboid({ size: [50, 100, cm(3)] })   // mix raw and explicit units freely
 */
export type Dim = number | Length;

/**
 * Axis-aligned bounding box stored in the builder's coordinate unit.
 * `min` = bottom-left-front corner, `max` = top-right-back corner.
 */
export type Bounds = {
  readonly min: readonly [number, number, number];
  readonly max: readonly [number, number, number];
};

/**
 * The underlying raw JSCAD geometry — 3D solid, 2D shape, or 2D path.
 */
export type AnyGeom = Geom3 | Geom2 | Path2;

/**
 * Core wrapper type. All builder functions accept and return `JscadObject`.
 * - `geom`  : the underlying JSCAD geometry (one or more pieces, any type)
 * - `bounds`: cached bounding box, updated analytically on every operation
 *             so `measureBoundingBox()` is only called at construction time.
 *
 * 2D geometries (Geom2, Path2) store z-bounds as [0, 0].
 */
export type JscadObject = {
  readonly geom: AnyGeom[];
  readonly bounds: Bounds;
};
