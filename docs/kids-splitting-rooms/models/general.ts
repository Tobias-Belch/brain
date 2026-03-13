import { createBuilder, cm, isMeasure, type Length, type Dim, type JscadObject } from "@fea-lib/jscad";
import { group } from "./utils";

const { cuboid, translate, subtract, pipe } = createBuilder({ coordinateUnit: "cm" });

export const measurements = {
  Mattress: {
    width: cm(80),
    height: cm(10),
    depth: cm(200),
  },
};

export const mattress = cuboid({
  size: { x: measurements.Mattress.width, y: measurements.Mattress.height, z: measurements.Mattress.depth },
});

export function Bed({
  platform = { thickness: cm(3) },
  guards = {
    top: cm(50),
    bottom: cm(50),
    left: cm(50),
    right: cm(50),
    thickness: cm(2),
  },
  padding = { top: cm(0), bottom: cm(0), left: cm(0), right: cm(0) },
}: {
  platform?: { thickness: Length };
  guards?:
    | Length
    | {
        top?: Length;
        bottom?: Length;
        left?: Length;
        right?: Length;
        thickness?: Length;
        cutout?:
          | "bottom"
          | "bottom-right"
          | "bottom-left"
          | "top"
          | "top-right"
          | "top-left";
      };
  padding?:
    | Length
    | {
        top?: Length;
        bottom?: Length;
        left?: Length;
        right?: Length;
      };
} = {}) {
  const normalisedGuards = isMeasure(guards)
    ? {
        top: guards,
        bottom: guards,
        left: guards,
        right: guards,
        thickness: cm(2),
      }
    : {
        top: guards.top ?? cm(50),
        bottom: guards.bottom ?? cm(50),
        left: guards.left ?? cm(50),
        right: guards.right ?? cm(50),
        thickness: guards.thickness ?? cm(2),
        cutout: guards.cutout,
      };

  let cutout:
    | {
        guard: "top" | "bottom" | "left" | "right";
        position: "left" | "center" | "right";
      }
    | { guard?: never; position?: never } = {};
  switch (normalisedGuards.cutout) {
    case "bottom":
      cutout = { guard: "bottom", position: "center" };
      break;
    case "bottom-right":
      cutout = { guard: "right", position: "right" };
      break;
    case "bottom-left":
      cutout = { guard: "left", position: "right" };
      break;
    case "top":
      cutout = { guard: "top", position: "center" };
      break;
    case "top-right":
      cutout = { guard: "right", position: "left" };
      break;
    case "top-left":
      cutout = { guard: "left", position: "left" };
      break;
  }

  const normalisedPadding = isMeasure(padding)
    ? { top: padding, bottom: padding, left: padding, right: padding }
    : {
        top: padding.top ?? cm(0),
        bottom: padding.bottom ?? cm(0),
        left: padding.left ?? cm(0),
        right: padding.right ?? cm(0),
      };

  // All arithmetic on physical values uses .value in cm
  const gT = cm(normalisedGuards.thickness).value;
  const pL = cm(normalisedPadding.left).value;
  const pR = cm(normalisedPadding.right).value;
  const pT = cm(normalisedPadding.top).value;
  const pB = cm(normalisedPadding.bottom).value;
  const mW = cm(measurements.Mattress.width).value;
  const mH = cm(measurements.Mattress.height).value;
  const mD = cm(measurements.Mattress.depth).value;
  const pltT = cm(platform.thickness).value;
  const gTop = cm(normalisedGuards.top).value;
  const gBot = cm(normalisedGuards.bottom).value;

  const bedMeasurements = {
    width: cm(gT + pL + mW + pR + gT),
    height: cm(pltT + Math.max(mH, gTop, gBot, pT, pB)),
    depth: cm(gT + pB + mD + pT + gT),
  };

  const bW = cm(bedMeasurements.width).value;
  const bD = cm(bedMeasurements.depth).value;

  const model = group(
    // platform
    cuboid({ size: { x: bedMeasurements.width, y: platform.thickness, z: bedMeasurements.depth } }),
    // guards
    translate({ y: platform.thickness })(
      group(
        // bottom
        BedGuard({
          width: bedMeasurements.width,
          height: normalisedGuards.bottom,
          depth: normalisedGuards.thickness,
          cutout: cutout.guard === "bottom" ? cutout.position : undefined,
        }),
        // right
        BedGuard({
          width: normalisedGuards.thickness,
          height: normalisedGuards.right,
          depth: bedMeasurements.depth,
          cutout: cutout.guard === "right" ? cutout.position : undefined,
        }),
        // left
        translate({ x: cm(bW - gT) })(
          BedGuard({
            width: normalisedGuards.thickness,
            height: normalisedGuards.left,
            depth: bedMeasurements.depth,
            cutout: cutout.guard === "left" ? cutout.position : undefined,
          }),
        ),
        // top
        translate({ z: cm(bD - gT) })(
          BedGuard({
            width: bedMeasurements.width,
            height: normalisedGuards.top,
            depth: normalisedGuards.thickness,
            cutout: cutout.guard === "top" ? cutout.position : undefined,
          }),
        ),
      ),
    ),
    // mattress
    translate({ x: cm(gT + pL), y: platform.thickness, z: cm(gT + pB) })(mattress),
  );

  function BedGuard({
    width,
    height,
    depth,
    cutout: c,
  }: {
    width: Length;
    height: Length;
    depth: Length;
    cutout?: "left" | "center" | "right";
  }): JscadObject {
    if (!c) {
      return cuboid({ size: { x: width, y: height, z: depth } });
    }

    const wVal = cm(width).value;
    const dVal = cm(depth).value;
    const depthIsThickness = dVal < wVal;
    const w = depthIsThickness ? width : depth;
    const t = depthIsThickness ? depth : width;

    const cutoutMeasurements = {
      width: depthIsThickness ? cm(40) : t,
      height,
      depth: depthIsThickness ? t : cm(40),
    };

    const wDim = cm(w).value;
    let cutoutOffset = 0;
    switch (c) {
      case "left":
        cutoutOffset = wDim - 2 * 40;
        break;
      case "center":
        cutoutOffset = (wDim - 40) / 2;
        break;
      case "right":
        cutoutOffset = 40;
        break;
    }

    const offset = {
      x: depthIsThickness ? cm(cutoutOffset) : cm(0),
      z: depthIsThickness ? cm(0) : cm(cutoutOffset),
    };

    return pipe(
      cuboid({ size: { x: width, y: height, z: depth } }),
      subtract(translate(offset)(cuboid({ size: { x: cutoutMeasurements.width, y: cutoutMeasurements.height, z: cutoutMeasurements.depth } }))),
    );
  }

  return { measurements: bedMeasurements, model };
}
