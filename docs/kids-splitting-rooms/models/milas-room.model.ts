import {
  createBuilder,
  cm,
  m,
  toCm,
  type JscadObject,
  type AnyGeom,
} from "@jscad/builder";
import { materials } from "./materials";
import { brimnesBillyPax } from "./brimnes-billy-pax.variant";
import { highbedKallaxWall } from "./highbed-kallax-wall.variant";
import { highbedCouch } from "./highbed-couch.variant";
import { highbed2Pax } from "./highbed-2pax.variant";
import { brimnesBillyPax2 } from "./brimnes-billy-pax.2.variant";

const { cuboid, translate, subtract, union, colorize, pipe } = createBuilder({
  coordinateUnit: "cm",
});

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

export const variants = {
  brimnesBillyPax2: "v2: BRIMNES Bed, BILLY Desk & 1 PAX",
  brimnesBillyPax: "v1: BRIMNES Bed, BILLY Desk & 1 PAX",
  highbedKallaxWall: "High Bed, 2 PAX, Desk & KALLAX Wall",
  highbedCouch: "High Bed, 1.5 PAX, KALLAX Tower, NORDEN Desk & Couch",
  highbed2Pax: "High Bed, 2 PAX, NORDEN Desk & Couch",
};

export type Variant = keyof typeof variants;

export type State = {
  variant: Variant;
  bed: {
    drawers: "closed" | "opened";
    variant: "single" | "double";
  };
  cabinet: {
    variant: "closed" | "opened";
  };
  desk: {
    variant: "closed" | "partially" | "fully";
  };
  surfaces: {
    frontWall: boolean;
    backWall: boolean;
    leftWall: boolean;
    rightWall: boolean;
    floor: boolean;
    ceiling: boolean;
  };
};

const defaultState = {
  variant: "brimnesBillyPax",
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
  surfaces: {
    frontWall: true,
    backWall: true,
    leftWall: true,
    rightWall: true,
    floor: true,
    ceiling: true,
  },
} satisfies State;

const DEBUG = false;

/**
 * Build Mila's room model and return raw JSCAD geometry suitable for the viewer.
 */
export function MilasRoom({
  state = defaultState,
}: { state?: State } = {}): AnyGeom[] {
  const t = toCm(measurements.wall.thickness).value;
  const W = toCm(measurements.room.width).value;
  const H = toCm(measurements.room.height).value;

  const debugElements: JscadObject[] = DEBUG
    ? [
        translate({ x: cm(t), y: cm(t), z: cm(t) })(
          colorize(materials.Debug.color)(
            cuboid({
              size: { x: cm(W), y: cm(H), z: toCm(measurements.room.depth) },
            }),
          ),
        ),
      ]
    : [];

  const roomPieces = room(state);

  let variantPieces: JscadObject[] = [];
  switch (state.variant) {
    case "brimnesBillyPax":
      variantPieces = brimnesBillyPax(state, measurements);
      break;
    case "brimnesBillyPax2":
      variantPieces = [brimnesBillyPax2(state, measurements)];
      break;
    case "highbedKallaxWall":
      variantPieces = highbedKallaxWall(state, measurements);
      break;
    case "highbedCouch":
      variantPieces = highbedCouch(state, measurements);
      break;
    case "highbed2Pax":
      variantPieces = highbed2Pax(state, measurements);
      break;
  }

  const allPieces = [...roomPieces, ...debugElements, ...variantPieces];
  return ([] as AnyGeom[]).concat(...allPieces.map((o) => o.geom));
}

// ─── Room geometry ────────────────────────────────────────────────────────────

function room(state: State): JscadObject[] {
  const t = toCm(measurements.wall.thickness).value;
  const W = toCm(measurements.room.width).value;
  const H = toCm(measurements.room.height).value;
  const D = toCm(measurements.room.depth).value;

  // Window
  const wW = toCm(measurements.room.window.width).value;
  const wH = toCm(measurements.room.window.height).value;
  const wD = toCm(measurements.room.window.depth).value;
  const wRight = toCm(measurements.room.window.right).value;
  const wBottom = toCm(measurements.room.window.bottom).value;

  const wbW = toCm(measurements.room.window.board.width).value;
  const wbH = toCm(measurements.room.window.board.height).value;
  const wbD = toCm(measurements.room.window.board.depth).value;
  const wbRight = toCm(measurements.room.window.board.right).value;
  const wbBottom = toCm(measurements.room.window.board.bottom).value;

  // Door
  const dW = toCm(measurements.room.door.width).value;
  const dH = toCm(measurements.room.door.height).value;
  const dD = toCm(measurements.room.door.depth).value;
  const dRight = toCm(measurements.room.door.right).value;

  const surfaces = state.surfaces;
  const result: JscadObject[] = [];

  // Front wall (Z = 0 to t) with door cutout
  if (surfaces.frontWall) {
    result.push(
      translate({ x: cm(t), y: cm(t) })(
        colorize(materials.Wall.color)(
          pipe(
            cuboid({ size: { x: cm(W), y: cm(H + t), z: cm(t) } }),
            subtract(
              translate({ x: cm(dRight), z: cm(t - dD) })(
                cuboid({ size: { x: cm(dW), y: cm(dH), z: cm(dD) } }),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // Back wall (Z = D + t to D + 2t) with window cutout
  if (surfaces.backWall) {
    result.push(
      translate({ x: cm(t), z: cm(D + t), y: cm(t) })(
        colorize(materials.Wall.color)(
          pipe(
            cuboid({ size: { x: cm(W), y: cm(H + t), z: cm(t) } }),
            subtract(
              translate({ x: cm(wRight), y: cm(wBottom) })(
                cuboid({ size: { x: cm(wW), y: cm(wH), z: cm(wD) } }),
              ),
            ),
            union(
              translate({ x: cm(wbRight), y: cm(wbBottom), z: cm(-wbD) })(
                cuboid({ size: { x: cm(wbW), y: cm(wbH), z: cm(wbD) } }),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // Right wall (X = 0 to t)
  if (surfaces.rightWall) {
    result.push(
      translate({ y: cm(t) })(
        colorize(materials.Wall.color)(
          cuboid({ size: { x: cm(t), y: cm(H + t), z: cm(D + 2 * t) } }),
        ),
      ),
    );
  }

  // Left wall (X = W + t to W + 2t)
  if (surfaces.leftWall) {
    result.push(
      translate({ x: cm(t + W), y: cm(t) })(
        colorize(materials.Wall.color)(
          cuboid({ size: { x: cm(t), y: cm(H + t), z: cm(D + 2 * t) } }),
        ),
      ),
    );
  }

  // Floor
  if (surfaces.floor) {
    result.push(
      translate({ x: cm(t), z: cm(t) })(
        colorize(materials.Wall.color)(
          cuboid({ size: { x: cm(W), y: cm(t), z: cm(D) } }),
        ),
      ),
    );
  }

  // Ceiling
  if (surfaces.ceiling) {
    result.push(
      translate({ y: cm(H + t) })(
        colorize(materials.Wall.color)(
          cuboid({ size: { x: cm(W + 2 * t), y: cm(t), z: cm(D + 2 * t) } }),
        ),
      ),
    );
  }

  return result;
}
