import modeling from "@jscad/modeling";
import { type NumberWithUnit, toCm } from "@pocs/values";
import { materials } from "./materials";

const {
  colors: { colorize },
  primitives: { cuboid },
  booleans: { union, subtract },
  transforms: { translate },
} = modeling;

type Measurements = {
  wall: { thickness: NumberWithUnit };
  room: {
    width: NumberWithUnit;
    depth: NumberWithUnit;
    height: NumberWithUnit;
    window: {
      width: NumberWithUnit;
      height: NumberWithUnit;
      depth: NumberWithUnit;
      left: NumberWithUnit;
      right: NumberWithUnit;
      bottom: NumberWithUnit;
      board: {
        width: NumberWithUnit;
        height: NumberWithUnit;
        depth: NumberWithUnit;
        left: NumberWithUnit;
        right: NumberWithUnit;
        bottom: NumberWithUnit;
      };
    };
    door: {
      width: NumberWithUnit;
      height: NumberWithUnit;
      depth: NumberWithUnit;
      left: NumberWithUnit;
      right: NumberWithUnit;
      bottom: NumberWithUnit;
    };
  };
  brimnes: {
    width: NumberWithUnit;
    height: NumberWithUnit;
    depth: NumberWithUnit;
  };
};

const DEBUG = false;

export function MilasRoom({
  measurements,
  variant = "A",
}: {
  measurements: Measurements;
  variant?: "A";
}) {
  const t = u(measurements.wall.thickness);
  const W = u(measurements.room.width);
  const H = u(measurements.room.height);
  const D = u(measurements.room.depth);

  const debugElements = DEBUG
    ? [translate([t, t, t], colorize(materials.Debug.color, box(W, H, D)))]
    : [];

  const furniture = variant === "A" ? furnitureVariantA(measurements) : [];

  return [room(measurements), ...furniture, ...debugElements];
}

function furnitureVariantA(measurements: Measurements) {
  const normalised = {
    wall: {
      thickness: u(measurements.wall.thickness),
    },
    room: {
      width: u(measurements.room.width),
      height: u(measurements.room.height),
      depth: u(measurements.room.depth),
    },
    brimnes: {
      width: u(measurements.brimnes.width),
      height: u(measurements.brimnes.height),
      depth: u(measurements.brimnes.depth),
    },
  };

  const brimnes = translate(
    [
      normalised.wall.thickness,
      normalised.wall.thickness,
      normalised.wall.thickness +
        normalised.room.depth -
        normalised.brimnes.depth,
    ],
    colorize(
      materials.Furniture.color,
      box(
        normalised.brimnes.width,
        normalised.brimnes.height,
        normalised.brimnes.depth,
      ),
    ),
  );

  return [brimnes];
}

function room(measurements: Measurements) {
  const t = u(measurements.wall.thickness);
  const W = u(measurements.room.width);
  const H = u(measurements.room.height);
  const D = u(measurements.room.depth);

  // Window (on back wall, at Z = D - t … D)
  const wW = u(measurements.room.window.width);
  const wH = u(measurements.room.window.height);
  const wD = u(measurements.room.window.depth);
  const wRight = u(measurements.room.window.right);
  const wBottom = u(measurements.room.window.bottom);

  const wbW = u(measurements.room.window.board.width);
  const wbH = u(measurements.room.window.board.height);
  const wbD = u(measurements.room.window.board.depth);
  const wbRight = u(measurements.room.window.board.right);
  const wbBottom = u(measurements.room.window.board.bottom);

  // Door (on front wall, at Z = 0 … t)
  const dW = u(measurements.room.door.width);
  const dH = u(measurements.room.door.height);
  const dD = u(measurements.room.door.depth);
  const dRight = u(measurements.room.door.right);
  const dBottom = u(measurements.room.door.bottom);

  // --- Front wall (Z = 0 to t), full width, with door cutout ---
  const frontWall = translate(
    [0, t, 0],
    colorize(
      materials.Wall.color,
      subtract(
        box(W + 2 * t, H, t),
        translate([t + dRight, dBottom, t - dD], box(dW, dH, dD)),
      ),
    ),
  );

  // --- Back wall (Z = D - t to D), full width, with window cutout ---
  const backWall = translate(
    [0, t, D + t],
    colorize(
      materials.Wall.color,
      union(
        subtract(
          box(W + 2 * t, H, t),
          translate([t + wRight, wBottom, 0], box(wW, wH, wD)),
        ),
        translate([t + wbRight, wbBottom, -wbD], box(wbW, wbH, wbD)),
      ),
    ),
  );

  // --- Left wall (X = 0 to t), between front and back walls ---
  const leftWall = translate(
    [0, t, t],
    colorize(materials.Wall.color, box(t, H, D)),
  );

  // --- Right wall (X = W - t to W), between front and back walls ---
  const rightWall = translate(
    [t + W, t, t],
    colorize(materials.Wall.color, box(t, H, D)),
  );

  // --- Floor ---
  const floor = colorize(materials.Floor.color, box(W + 2 * t, t, D + 2 * t));

  // --- Ceiling ---
  /*const ceiling = translate(
    [0, H + t, 0],
    colorize(materials.Wall.color, box(W + 2 * t, t, D + 2 * t)),
  );*/

  return [frontWall, backWall, leftWall, rightWall, floor /*ceiling*/];
}

function box(w: number, h: number, d: number) {
  return cuboid({
    size: [w, h, d],
    center: [w / 2, h / 2, d / 2],
  });
}

function u(value: NumberWithUnit): number {
  return toCm(value).value;
}
