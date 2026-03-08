import modeling from "@jscad/modeling";
import { cm, isNumberWithUnit, type NumberWithUnit, toCm } from "@pocs/values";
import { box, normalize } from "./utils";

const {
  booleans: { subtract },
  transforms: { translate },
} = modeling;

export const measurements = {
  Mattress: {
    width: cm(80),
    height: cm(10),
    depth: cm(200),
  },
};

export const mattress = box(
  normalize(measurements.Mattress.width),
  normalize(measurements.Mattress.height),
  normalize(measurements.Mattress.depth),
);

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
  platform?: { thickness: NumberWithUnit };
  guards?:
    | NumberWithUnit
    | {
        top?: NumberWithUnit;
        bottom?: NumberWithUnit;
        left?: NumberWithUnit;
        right?: NumberWithUnit;
        thickness?: NumberWithUnit;
        cutout?:
          | "bottom"
          | "bottom-right"
          | "bottom-left"
          | "top"
          | "top-right"
          | "top-left";
      };
  padding?:
    | NumberWithUnit
    | {
        top?: NumberWithUnit;
        bottom?: NumberWithUnit;
        left?: NumberWithUnit;
        right?: NumberWithUnit;
      };
} = {}) {
  const normalisedGuards = isNumberWithUnit(guards)
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

  const normalisedPadding = isNumberWithUnit(padding)
    ? { top: padding, bottom: padding, left: padding, right: padding }
    : {
        top: padding.top ?? cm(0),
        bottom: padding.bottom ?? cm(0),
        left: padding.left ?? cm(0),
        right: padding.right ?? cm(0),
      };

  const bedMeasurements = {
    width: cm(
      toCm(normalisedGuards.thickness).value +
        toCm(normalisedPadding.left).value +
        toCm(measurements.Mattress.width).value +
        toCm(normalisedPadding.right).value +
        toCm(normalisedGuards.thickness).value,
    ),
    height: cm(
      toCm(platform.thickness).value +
        Math.max(
          toCm(measurements.Mattress.height).value,
          toCm(normalisedGuards.top).value,
          toCm(normalisedGuards.bottom).value,
          toCm(normalisedPadding.top).value,
          toCm(normalisedPadding.bottom).value,
        ),
    ),
    depth: cm(
      toCm(normalisedGuards.thickness).value +
        toCm(normalisedPadding.bottom).value +
        toCm(measurements.Mattress.depth).value +
        toCm(normalisedPadding.top).value +
        toCm(normalisedGuards.thickness).value,
    ),
  };

  const model = [
    // platform
    box(
      normalize(bedMeasurements.width),
      normalize(platform.thickness),
      normalize(bedMeasurements.depth),
    ),
    // guards
    translate(
      [0, normalize(platform.thickness), 0],
      [
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
        translate(
          [
            normalize(bedMeasurements.width) -
              normalize(normalisedGuards.thickness),
            0,
            0,
          ],
          BedGuard({
            width: normalisedGuards.thickness,
            height: normalisedGuards.left,
            depth: bedMeasurements.depth,
            cutout: cutout.guard === "left" ? cutout.position : undefined,
          }),
        ),
        // top
        translate(
          [
            0,
            0,
            normalize(bedMeasurements.depth) -
              normalize(normalisedGuards.thickness),
          ],
          BedGuard({
            width: bedMeasurements.width,
            height: normalisedGuards.top,
            depth: normalisedGuards.thickness,
            cutout: cutout.guard === "top" ? cutout.position : undefined,
          }),
        ),
      ],
    ),
    // mattress
    translate(
      [
        normalize(normalisedGuards.thickness) +
          normalize(normalisedPadding.right),
        normalize(platform.thickness),
        normalize(normalisedGuards.thickness) +
          normalize(normalisedPadding.bottom),
      ],
      mattress,
    ),
  ];

  function BedGuard({
    width,
    height,
    depth,
    cutout,
  }: {
    width: NumberWithUnit;
    height: NumberWithUnit;
    depth: NumberWithUnit;
    cutout?: "left" | "center" | "right";
  }) {
    if (!cutout) {
      return box(normalize(width), normalize(height), normalize(depth));
    }

    const depthIsThickness = normalize(depth) < normalize(width);
    const w = depthIsThickness ? width : depth;
    const t = depthIsThickness ? depth : width;

    const coutoutMeasurements = {
      width: depthIsThickness ? cm(40) : t,
      height,
      depth: depthIsThickness ? t : cm(40),
    };

    let cutoutOffset = 0;
    switch (cutout) {
      case "left":
        cutoutOffset = normalize(w) - 2 * normalize(cm(40));
        break;
      case "center":
        cutoutOffset = (normalize(w) - normalize(cm(40))) / 2;
        break;
      case "right":
        cutoutOffset = normalize(cm(40));
        break;
    }

    const offset = [
      depthIsThickness ? cutoutOffset : 0,
      0,
      depthIsThickness ? 0 : cutoutOffset,
    ];

    return subtract(
      box(normalize(width), normalize(height), normalize(depth)),
      translate(
        offset,
        box(
          normalize(coutoutMeasurements.width),
          normalize(coutoutMeasurements.height),
          normalize(coutoutMeasurements.depth),
        ),
      ),
    );
  }

  return { measurements: bedMeasurements, model };
}
