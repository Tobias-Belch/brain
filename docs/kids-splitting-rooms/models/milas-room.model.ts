import modeling from "@jscad/modeling";
import { cm, m } from "@pocs/values";
import { materials } from "./materials";
import { box, normalize } from "./utils";
import * as ikea from "./ikea";

const {
  colors: { colorize },
  booleans: { union, subtract },
  transforms: { rotate, translate },
} = modeling;

export const measurements = {
  wall: {
    thickness: cm(26),
  },
  room: {
    width: m(2.13),
    depth: m(4.33),
    height: m(2.67),
    window: {
      width: cm(193),
      height: cm(159),
      depth: cm(13),
      left: cm(7),
      right: cm(13),
      bottom: cm(77 + 3.5),
      board: {
        width: cm(213),
        height: cm(3.5),
        depth: cm(4.5),
        left: cm(0),
        right: cm(0),
        bottom: cm(77),
      },
    },
    door: {
      width: cm(106.7),
      height: cm(206.1),
      depth: cm(12),
      left: cm(36.2),
      right: cm(68.3),
      bottom: cm(0),
    },
  },
};

export type State = {
  bed: {
    drawers: "closed" | "opened";
    variant: "single" | "double";
  };
  cabinet: {
    variant: "closed" | "opened";
  };
  desk: {
    variant: "closed" | "opened";
  };
};

const defaultState = {
  bed: {
    drawers: "closed",
    variant: "single",
  },
  cabinet: {
    variant: "closed",
  },
  desk: {
    variant: "closed",
  },
} satisfies State;

const DEBUG = false;

export function MilasRoom({
  state = defaultState,
  variant = "A",
}: { state?: State; variant?: "A" } = {}) {
  const t = normalize(measurements.wall.thickness);
  const W = normalize(measurements.room.width);
  const H = normalize(measurements.room.height);
  const D = normalize(measurements.room.depth);

  const debugElements = DEBUG
    ? [translate([t, t, t], colorize(materials.Debug.color, box(W, H, D)))]
    : [];

  const furniture = variant === "A" ? furnitureVariantA(state) : [];

  return [room(), ...furniture, ...debugElements];
}

function furnitureVariantA(state: State) {
  const normalised = {
    wall: {
      thickness: normalize(measurements.wall.thickness),
    },
    room: {
      width: normalize(measurements.room.width),
      height: normalize(measurements.room.height),
      depth: normalize(measurements.room.depth),
    },
  };

  const closet = translate(
    [
      normalised.wall.thickness,
      normalised.wall.thickness,
      normalised.wall.thickness +
        normalize(cm(10)) +
        normalize(ikea.measurements.cabinets.Pax.width),
    ],
    rotate(
      [0, Math.PI / 2, 0],
      colorize(materials.Furniture.color, ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const desk = translate(
    [
      normalised.wall.thickness,
      normalised.wall.thickness,
      normalised.wall.thickness +
        normalize(cm(10)) +
        normalize(ikea.measurements.cabinets.Pax.width) +
        normalize(cm(5)) +
        normalize(ikea.measurements.desks.Billy.width),
    ],
    rotate(
      [0, Math.PI / 2, 0],
      colorize(materials.Furniture.color, ikea.desks.Billy(state.desk)),
    ),
  );

  const shelfOverDesk = translate(
    [
      normalised.wall.thickness,
      normalised.wall.thickness +
        normalize(ikea.measurements.desks.Billy.height) +
        normalize(cm(24)),
      normalised.wall.thickness +
        normalize(cm(10)) +
        normalize(ikea.measurements.cabinets.Pax.width) +
        normalize(cm(5)) +
        normalize(ikea.measurements.desks.Billy.width),
    ],
    rotate(
      [0, Math.PI / 2, 0],
      colorize(materials.Furniture.color, ikea.shelfs.Billy()),
    ),
  );

  const bed = translate(
    [
      normalised.wall.thickness,
      normalised.wall.thickness,
      normalised.wall.thickness +
        normalised.room.depth -
        normalize(ikea.measurements.beds.Brimnes.depth) -
        normalize(cm(10)),
    ],
    colorize(materials.Furniture.color, ikea.beds.Brimnes(state.bed)),
  );

  return [bed, closet, desk, shelfOverDesk];
}

function room() {
  const t = normalize(measurements.wall.thickness);
  const W = normalize(measurements.room.width);
  const H = normalize(measurements.room.height);
  const D = normalize(measurements.room.depth);

  // Window (on back wall, at Z = D - t … D)
  const wW = normalize(measurements.room.window.width);
  const wH = normalize(measurements.room.window.height);
  const wD = normalize(measurements.room.window.depth);
  const wRight = normalize(measurements.room.window.right);
  const wBottom = normalize(measurements.room.window.bottom);

  const wbW = normalize(measurements.room.window.board.width);
  const wbH = normalize(measurements.room.window.board.height);
  const wbD = normalize(measurements.room.window.board.depth);
  const wbRight = normalize(measurements.room.window.board.right);
  const wbBottom = normalize(measurements.room.window.board.bottom);

  // Door (on front wall, at Z = 0 … t)
  const dW = normalize(measurements.room.door.width);
  const dH = normalize(measurements.room.door.height);
  const dD = normalize(measurements.room.door.depth);
  const dRight = normalize(measurements.room.door.right);
  const dBottom = normalize(measurements.room.door.bottom);

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
  const floor = colorize(materials.Wall.color, box(W + 2 * t, t, D + 2 * t));

  // --- Ceiling ---
  /*const ceiling = translate(
    [0, H + t, 0],
    colorize(materials.Wall.color, box(W + 2 * t, t, D + 2 * t)),
  );*/

  return [frontWall, backWall, leftWall, rightWall, floor /*ceiling*/];
}
