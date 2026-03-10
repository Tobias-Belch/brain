import modeling from "@jscad/modeling";
import type { Dim, JscadObject, AnyGeom } from "./types";
import type { Angle } from "./measure";
import { isAngle, toRad } from "./measure";
import { boundsFromGeom, type DimResolver } from "./primitives";

/** Resolve an Angle (number in radians, or a Measure in deg/rad) to radians. */
function resolveAngle(a: Angle): number {
  if (!isAngle(a)) return a;
  return toRad(a).value;
}

const {
  transforms: {
    translate: jscadTranslate,
    translateX: jscadTranslateX,
    translateY: jscadTranslateY,
    translateZ: jscadTranslateZ,
    rotate: jscadRotate,
    rotateX: jscadRotateX,
    rotateY: jscadRotateY,
    rotateZ: jscadRotateZ,
    scale: jscadScale,
    scaleX: jscadScaleX,
    scaleY: jscadScaleY,
    scaleZ: jscadScaleZ,
    mirror: jscadMirror,
    mirrorX: jscadMirrorX,
    mirrorY: jscadMirrorY,
    mirrorZ: jscadMirrorZ,
    center: jscadCenter,
    centerX: jscadCenterX,
    centerY: jscadCenterY,
    centerZ: jscadCenterZ,
    align: jscadAlign,
    transform: jscadTransform,
  },
  colors: { colorize: jscadColorize },
} = modeling;

// ---------------------------------------------------------------------------
// translate
// ---------------------------------------------------------------------------

/**
 * Returns a curried translate() function bound to the given resolver.
 *
 * translate([dx, dy, dz])(obj) shifts all geometry by the delta.
 * Bounds are updated analytically — O(1), no JSCAD measurement call.
 *
 * @example
 * const { translate } = createBuilder({ coordinateUnit: 'mm' })
 * pipe(cuboid({ size: [50, 100, 30] }), translate([10, 0, 50]))
 */
export function makeTranslate(resolve: DimResolver) {
  return function translate(
    v: [Dim, Dim, Dim],
  ): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const dx = resolve(v[0]);
      const dy = resolve(v[1]);
      const dz = resolve(v[2]);
      return {
        geom: obj.geom.map((g) => jscadTranslate([dx, dy, dz], g as any) as AnyGeom),
        bounds: {
          min: [obj.bounds.min[0] + dx, obj.bounds.min[1] + dy, obj.bounds.min[2] + dz],
          max: [obj.bounds.max[0] + dx, obj.bounds.max[1] + dy, obj.bounds.max[2] + dz],
        },
      };
    };
  };
}

/**
 * Returns a curried translateX() function.
 * Shifts all geometry along the X axis.
 */
export function makeTranslateX(resolve: DimResolver) {
  return function translateX(d: Dim): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const dx = resolve(d);
      return {
        geom: obj.geom.map((g) => jscadTranslateX(dx, g as any) as AnyGeom),
        bounds: {
          min: [obj.bounds.min[0] + dx, obj.bounds.min[1], obj.bounds.min[2]],
          max: [obj.bounds.max[0] + dx, obj.bounds.max[1], obj.bounds.max[2]],
        },
      };
    };
  };
}

/**
 * Returns a curried translateY() function.
 * Shifts all geometry along the Y axis.
 */
export function makeTranslateY(resolve: DimResolver) {
  return function translateY(d: Dim): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const dy = resolve(d);
      return {
        geom: obj.geom.map((g) => jscadTranslateY(dy, g as any) as AnyGeom),
        bounds: {
          min: [obj.bounds.min[0], obj.bounds.min[1] + dy, obj.bounds.min[2]],
          max: [obj.bounds.max[0], obj.bounds.max[1] + dy, obj.bounds.max[2]],
        },
      };
    };
  };
}

/**
 * Returns a curried translateZ() function.
 * Shifts all geometry along the Z axis.
 */
export function makeTranslateZ(resolve: DimResolver) {
  return function translateZ(d: Dim): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const dz = resolve(d);
      return {
        geom: obj.geom.map((g) => jscadTranslateZ(dz, g as any) as AnyGeom),
        bounds: {
          min: [obj.bounds.min[0], obj.bounds.min[1], obj.bounds.min[2] + dz],
          max: [obj.bounds.max[0], obj.bounds.max[1], obj.bounds.max[2] + dz],
        },
      };
    };
  };
}

// ---------------------------------------------------------------------------
// rotate
// ---------------------------------------------------------------------------

/**
 * Returns a curried rotate() function.
 *
 * Rotates geometry around its own center by default.
 * Unlike JSCAD's raw rotate() which spins around the world origin, this
 * wrapper translates the object to the origin, rotates, then translates back.
 *
 * Bounds are remeasured after rotation because extents genuinely change
 * (a 50×200×30 box rotated 90° has different width/depth).
 *
 * @param angles - [rx, ry, rz] — each element is either a raw number in
 *   radians or a `Measure` produced by `deg()` / `rad()`.
 * @param opts.around - 'center' (default) or 'corner' (JSCAD default behaviour)
 *
 * @example
 * const { rotate } = createBuilder({ coordinateUnit: 'mm' })
 * pipe(pax, rotate([deg(90), 0, 0]))
 * pipe(pax, rotate([0, Math.PI / 2, 0]))  // raw radians still work
 */
export function makeRotate() {
  return function rotate(
    angles: [Angle, Angle, Angle],
    opts: { around?: "center" | "corner" } = {},
  ): (obj: JscadObject) => JscadObject {
    const around = opts.around ?? "center";
    return (obj) => {
      const resolved: [number, number, number] = [
        resolveAngle(angles[0]),
        resolveAngle(angles[1]),
        resolveAngle(angles[2]),
      ];
      if (around === "corner") {
        const rotated = obj.geom.map((g) => jscadRotate(resolved, g as any) as AnyGeom);
        return { geom: rotated, bounds: boundsFromGeom(rotated) };
      }

      // Rotate around center: shift to origin, rotate, shift back
      const cx = (obj.bounds.min[0] + obj.bounds.max[0]) / 2;
      const cy = (obj.bounds.min[1] + obj.bounds.max[1]) / 2;
      const cz = (obj.bounds.min[2] + obj.bounds.max[2]) / 2;

      const rotated = obj.geom.map((g) => {
        const shifted = jscadTranslate([-cx, -cy, -cz], g as any);
        const rotatedG = jscadRotate(resolved, shifted as any);
        return jscadTranslate([cx, cy, cz], rotatedG as any) as AnyGeom;
      });

      return { geom: rotated, bounds: boundsFromGeom(rotated) };
    };
  };
}

/**
 * Returns a curried rotateX() function.
 *
 * @param angle - rotation angle (raw radians or deg()/rad())
 * @param opts.around - 'center' (default) or 'corner' (JSCAD default)
 */
export function makeRotateX() {
  return function rotateX(
    angle: Angle,
    opts: { around?: "center" | "corner" } = {},
  ): (obj: JscadObject) => JscadObject {
    const around = opts.around ?? "center";
    return (obj) => {
      const rad = resolveAngle(angle);
      if (around === "corner") {
        const rotated = obj.geom.map((g) => jscadRotateX(rad, g as any) as AnyGeom);
        return { geom: rotated, bounds: boundsFromGeom(rotated) };
      }
      const cx = (obj.bounds.min[0] + obj.bounds.max[0]) / 2;
      const cy = (obj.bounds.min[1] + obj.bounds.max[1]) / 2;
      const cz = (obj.bounds.min[2] + obj.bounds.max[2]) / 2;
      const rotated = obj.geom.map((g) => {
        const shifted = jscadTranslate([-cx, -cy, -cz], g as any);
        const r = jscadRotateX(rad, shifted as any);
        return jscadTranslate([cx, cy, cz], r as any) as AnyGeom;
      });
      return { geom: rotated, bounds: boundsFromGeom(rotated) };
    };
  };
}

/**
 * Returns a curried rotateY() function.
 *
 * @param angle - rotation angle (raw radians or deg()/rad())
 * @param opts.around - 'center' (default) or 'corner' (JSCAD default)
 */
export function makeRotateY() {
  return function rotateY(
    angle: Angle,
    opts: { around?: "center" | "corner" } = {},
  ): (obj: JscadObject) => JscadObject {
    const around = opts.around ?? "center";
    return (obj) => {
      const rad = resolveAngle(angle);
      if (around === "corner") {
        const rotated = obj.geom.map((g) => jscadRotateY(rad, g as any) as AnyGeom);
        return { geom: rotated, bounds: boundsFromGeom(rotated) };
      }
      const cx = (obj.bounds.min[0] + obj.bounds.max[0]) / 2;
      const cy = (obj.bounds.min[1] + obj.bounds.max[1]) / 2;
      const cz = (obj.bounds.min[2] + obj.bounds.max[2]) / 2;
      const rotated = obj.geom.map((g) => {
        const shifted = jscadTranslate([-cx, -cy, -cz], g as any);
        const r = jscadRotateY(rad, shifted as any);
        return jscadTranslate([cx, cy, cz], r as any) as AnyGeom;
      });
      return { geom: rotated, bounds: boundsFromGeom(rotated) };
    };
  };
}

/**
 * Returns a curried rotateZ() function.
 *
 * @param angle - rotation angle (raw radians or deg()/rad())
 * @param opts.around - 'center' (default) or 'corner' (JSCAD default)
 */
export function makeRotateZ() {
  return function rotateZ(
    angle: Angle,
    opts: { around?: "center" | "corner" } = {},
  ): (obj: JscadObject) => JscadObject {
    const around = opts.around ?? "center";
    return (obj) => {
      const rad = resolveAngle(angle);
      if (around === "corner") {
        const rotated = obj.geom.map((g) => jscadRotateZ(rad, g as any) as AnyGeom);
        return { geom: rotated, bounds: boundsFromGeom(rotated) };
      }
      const cx = (obj.bounds.min[0] + obj.bounds.max[0]) / 2;
      const cy = (obj.bounds.min[1] + obj.bounds.max[1]) / 2;
      const cz = (obj.bounds.min[2] + obj.bounds.max[2]) / 2;
      const rotated = obj.geom.map((g) => {
        const shifted = jscadTranslate([-cx, -cy, -cz], g as any);
        const r = jscadRotateZ(rad, shifted as any);
        return jscadTranslate([cx, cy, cz], r as any) as AnyGeom;
      });
      return { geom: rotated, bounds: boundsFromGeom(rotated) };
    };
  };
}

// ---------------------------------------------------------------------------
// scale
// ---------------------------------------------------------------------------

/**
 * Returns a curried scale() function.
 *
 * Scales geometry by [sx, sy, sz]. Bounds are updated analytically from the
 * scale factors — O(1). Note: scale is applied relative to the world origin,
 * so [0,0,0] stays fixed. If your object is already translated, consider
 * scaling before translating.
 *
 * @example
 * const { scale } = createBuilder({ coordinateUnit: 'mm' })
 * pipe(myBox, scale([2, 1, 1]))  // double the width
 */
export function makeScale() {
  return function scale(
    v: [number, number, number],
  ): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const [sx, sy, sz] = v;
      return {
        geom: obj.geom.map((g) => jscadScale([sx, sy, sz], g as any) as AnyGeom),
        bounds: {
          min: [obj.bounds.min[0] * sx, obj.bounds.min[1] * sy, obj.bounds.min[2] * sz],
          max: [obj.bounds.max[0] * sx, obj.bounds.max[1] * sy, obj.bounds.max[2] * sz],
        },
      };
    };
  };
}

/**
 * Returns a curried scaleX() function.
 * Scales geometry along the X axis only.
 */
export function makeScaleX() {
  return function scaleX(factor: number): (obj: JscadObject) => JscadObject {
    return (obj) => ({
      geom: obj.geom.map((g) => jscadScaleX(factor, g as any) as AnyGeom),
      bounds: {
        min: [obj.bounds.min[0] * factor, obj.bounds.min[1], obj.bounds.min[2]],
        max: [obj.bounds.max[0] * factor, obj.bounds.max[1], obj.bounds.max[2]],
      },
    });
  };
}

/**
 * Returns a curried scaleY() function.
 * Scales geometry along the Y axis only.
 */
export function makeScaleY() {
  return function scaleY(factor: number): (obj: JscadObject) => JscadObject {
    return (obj) => ({
      geom: obj.geom.map((g) => jscadScaleY(factor, g as any) as AnyGeom),
      bounds: {
        min: [obj.bounds.min[0], obj.bounds.min[1] * factor, obj.bounds.min[2]],
        max: [obj.bounds.max[0], obj.bounds.max[1] * factor, obj.bounds.max[2]],
      },
    });
  };
}

/**
 * Returns a curried scaleZ() function.
 * Scales geometry along the Z axis only.
 */
export function makeScaleZ() {
  return function scaleZ(factor: number): (obj: JscadObject) => JscadObject {
    return (obj) => ({
      geom: obj.geom.map((g) => jscadScaleZ(factor, g as any) as AnyGeom),
      bounds: {
        min: [obj.bounds.min[0], obj.bounds.min[1], obj.bounds.min[2] * factor],
        max: [obj.bounds.max[0], obj.bounds.max[1], obj.bounds.max[2] * factor],
      },
    });
  };
}

// ---------------------------------------------------------------------------
// mirror
// ---------------------------------------------------------------------------

/**
 * Returns a curried mirror() function.
 * Mirrors geometry across an arbitrary plane defined by origin and normal.
 * Bounds are remeasured after mirroring.
 *
 * @example
 * mirror({ normal: [1, 0, 0] })(obj)  // mirror across YZ plane
 */
export function makeMirror() {
  return function mirror(opts: {
    origin?: [number, number, number];
    normal?: [number, number, number];
  }): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const mirrored = obj.geom.map((g) => jscadMirror(opts, g as any) as AnyGeom);
      return { geom: mirrored, bounds: boundsFromGeom(mirrored) };
    };
  };
}

/**
 * Returns a curried mirrorX() function.
 * Mirrors geometry across the YZ plane (negates X coordinates).
 */
export function makeMirrorX() {
  return function mirrorX(): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const mirrored = obj.geom.map((g) => jscadMirrorX(g as any) as AnyGeom);
      return { geom: mirrored, bounds: boundsFromGeom(mirrored) };
    };
  };
}

/**
 * Returns a curried mirrorY() function.
 * Mirrors geometry across the XZ plane (negates Y coordinates).
 */
export function makeMirrorY() {
  return function mirrorY(): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const mirrored = obj.geom.map((g) => jscadMirrorY(g as any) as AnyGeom);
      return { geom: mirrored, bounds: boundsFromGeom(mirrored) };
    };
  };
}

/**
 * Returns a curried mirrorZ() function.
 * Mirrors geometry across the XY plane (negates Z coordinates).
 */
export function makeMirrorZ() {
  return function mirrorZ(): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const mirrored = obj.geom.map((g) => jscadMirrorZ(g as any) as AnyGeom);
      return { geom: mirrored, bounds: boundsFromGeom(mirrored) };
    };
  };
}

// ---------------------------------------------------------------------------
// center
// ---------------------------------------------------------------------------

/**
 * Returns a curried center() function.
 * Centers the object at the world origin on the specified axes.
 * Bounds are remeasured after centering.
 *
 * @example
 * center({ axes: [true, true, true] })(obj)  // center on all axes
 */
export function makeCenter() {
  return function center(opts: {
    axes?: [boolean, boolean, boolean];
    relativeTo?: [number, number, number];
  }): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const centered = obj.geom.map((g) => jscadCenter(opts, g as any) as AnyGeom);
      return { geom: centered, bounds: boundsFromGeom(centered) };
    };
  };
}

/**
 * Returns a curried centerX() function.
 * Centers geometry on the X axis.
 */
export function makeCenterX() {
  return function centerX(): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const centered = obj.geom.map((g) => jscadCenterX(g as any) as AnyGeom);
      return { geom: centered, bounds: boundsFromGeom(centered) };
    };
  };
}

/**
 * Returns a curried centerY() function.
 * Centers geometry on the Y axis.
 */
export function makeCenterY() {
  return function centerY(): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const centered = obj.geom.map((g) => jscadCenterY(g as any) as AnyGeom);
      return { geom: centered, bounds: boundsFromGeom(centered) };
    };
  };
}

/**
 * Returns a curried centerZ() function.
 * Centers geometry on the Z axis.
 */
export function makeCenterZ() {
  return function centerZ(): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const centered = obj.geom.map((g) => jscadCenterZ(g as any) as AnyGeom);
      return { geom: centered, bounds: boundsFromGeom(centered) };
    };
  };
}

// ---------------------------------------------------------------------------
// align
// ---------------------------------------------------------------------------

/**
 * Returns a curried align() function.
 *
 * Aligns one or more objects relative to each other or to an absolute position.
 *
 * @param opts.modes      - alignment mode per axis: 'min', 'center', 'max', 'none'
 * @param opts.relativeTo - optional absolute [x, y, z] target coordinates
 * @param opts.grouped    - if true, treats all geometries as a single group
 *
 * @example
 * align({ modes: ['center', 'min', 'none'] })(obj)  // center on X, align min on Y
 */
export function makeAlign() {
  return function align(opts: {
    modes?: Array<"center" | "max" | "min" | "none">;
    relativeTo?: [number | null, number | null, number | null];
    grouped?: boolean;
  }): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const aligned = obj.geom.map((g) => jscadAlign(opts as any, g as any) as AnyGeom);
      return { geom: aligned, bounds: boundsFromGeom(aligned) };
    };
  };
}

// ---------------------------------------------------------------------------
// transform (raw matrix)
// ---------------------------------------------------------------------------

/**
 * Returns a curried transform() function.
 * Applies a raw 4×4 column-major matrix to all geometry.
 * Bounds are remeasured after the transform.
 *
 * @param matrix - 16-element column-major matrix (row-major from the user's perspective)
 *
 * @example
 * import { mat4 } from '@jscad/modeling'
 * transform(mat4.fromXRotation(mat4.create(), Math.PI / 4))(obj)
 */
export function makeTransform() {
  return function transform(
    matrix: readonly number[],
  ): (obj: JscadObject) => JscadObject {
    return (obj) => {
      const transformed = obj.geom.map((g) => jscadTransform(matrix as any, g as any) as AnyGeom);
      return { geom: transformed, bounds: boundsFromGeom(transformed) };
    };
  };
}

// ---------------------------------------------------------------------------
// colorize
// ---------------------------------------------------------------------------

/**
 * Returns a curried colorize() function.
 *
 * Applies a color to all geometry. Bounds are unchanged — O(1).
 *
 * @param color - RGB or RGBA array, e.g. [1, 0, 0, 0.7]
 *
 * @example
 * const { colorize } = createBuilder({ coordinateUnit: 'mm' })
 * pipe(myBox, colorize([1, 1, 1]))
 */
export function makeColorize() {
  return function colorize(
    color: [number, number, number] | [number, number, number, number],
  ): (obj: JscadObject) => JscadObject {
    return (obj) => ({
      geom: obj.geom.map((g) => jscadColorize(color, g as any) as AnyGeom),
      bounds: obj.bounds,
    });
  };
}
