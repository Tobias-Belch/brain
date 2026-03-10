import { createBuilder, cm, m, toCm, type JscadObject, type AnyGeom } from "@jscad/builder";
import * as general from "./general";
import * as ikea from "./ikea";
import { materials } from "./materials";
import { group } from "./utils";

const { cuboid, translate, rotate, subtract, union, colorize, pipe } = createBuilder({ coordinateUnit: "cm" });

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
  brimnesBillyPax: "BRIMNES Bed, BILLY Desk & 1 PAX",
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
export function MilasRoom({ state = defaultState }: { state?: State } = {}): AnyGeom[] {
  const t = toCm(measurements.wall.thickness).value;
  const W = toCm(measurements.room.width).value;
  const H = toCm(measurements.room.height).value;

  const debugElements: JscadObject[] = DEBUG
    ? [
        translate([cm(t), cm(t), cm(t)])(
          colorize(materials.Debug.color)(cuboid({ size: [cm(W), cm(H), toCm(measurements.room.depth)] })),
        ),
      ]
    : [];

  const roomPieces = room(state);

  let variantPieces: JscadObject[] = [];
  switch (state.variant) {
    case "brimnesBillyPax":
      variantPieces = brimnesBillyPax(state);
      break;
    case "highbedKallaxWall":
      variantPieces = highbedKallaxWall(state);
      break;
    case "highbedCouch":
      variantPieces = highbedCouch(state);
      break;
    case "highbed2Pax":
      variantPieces = highbed2Pax(state);
      break;
  }

  const allPieces = [...roomPieces, ...debugElements, ...variantPieces];
  return ([] as AnyGeom[]).concat(...allPieces.map((o) => o.geom));
}

// ─── Variant: BRIMNES Bed, BILLY Desk & 1 PAX ────────────────────────────────

function brimnesBillyPax(state: State): JscadObject[] {
  const wT = toCm(measurements.wall.thickness).value;
  const paxW = toCm(ikea.measurements.cabinets.Pax.width).value;
  const paxH = toCm(ikea.measurements.cabinets.Pax.height).value;
  const billyDeskW = toCm(ikea.measurements.desks.Billy.width).value;
  const billyShelfH = toCm(ikea.measurements.shelfs.Billy.height).value;
  const bestaH = toCm(ikea.measurements.cabinets.Besta.height).value;
  const bestaW = toCm(ikea.measurements.cabinets.Besta.width).value;
  const brimnesD = toCm(ikea.measurements.beds.Brimnes.depth).value;
  const roomD = toCm(measurements.room.depth).value;

  const closet = translate([cm(wT), cm(wT), cm(wT + 8 + paxW)])(
    rotate([0, Math.PI / 2, 0], { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const desk = translate([
    cm(wT),
    cm(wT),
    cm(wT + 8 + paxW + 3 + billyDeskW),
  ])(
    rotate([0, Math.PI / 2, 0], { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.desks.Billy(state.desk)),
    ),
  );

  const shelfOverDesk = translate([
    cm(wT),
    cm(wT + paxH - billyShelfH),
    cm(wT + 8 + paxW + 3 + billyDeskW),
  ])(
    rotate([0, Math.PI / 2, 0], { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.shelfs.Billy()),
    ),
  );

  const cabinets = translate([
    cm(wT),
    cm(wT + paxH - bestaH),
    cm(wT + 8 + paxW + 3 + billyDeskW),
  ])(
    colorize(materials.Furniture.color)(
      group(
        ikea.cabinets.Besta(),
        translate([cm(0), cm(0), cm(bestaW)])(ikea.cabinets.Besta()),
        translate([cm(0), cm(0), cm(2 * bestaW)])(ikea.cabinets.Besta()),
        translate([cm(0), cm(0), cm(3 * bestaW)])(ikea.cabinets.Besta()),
      ),
    ),
  );

  const bed = translate([
    cm(wT),
    cm(wT),
    cm(wT + roomD - brimnesD - 10),
  ])(
    colorize(materials.Furniture.color)(ikea.beds.Brimnes(state.bed)),
  );

  return [bed, closet, desk, shelfOverDesk, cabinets];
}

// ─── Variant: High Bed, 2 PAX, Desk & KALLAX Wall ────────────────────────────

function highbedKallaxWall(state: State): JscadObject[] {
  const wT = toCm(measurements.wall.thickness).value;
  const roomW = toCm(measurements.room.width).value;
  const roomD = toCm(measurements.room.depth).value;
  const paxW = toCm(ikea.measurements.cabinets.Pax.width).value;

  const closet = translate([cm(0), cm(0), cm(10 + paxW)])(
    rotate([0, Math.PI / 2, 0], { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const cabinet = translate([cm(0), cm(0), cm(10 + 2 * paxW)])(
    rotate([0, Math.PI / 2, 0], { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const { model: bedModel } = general.Bed({
    guards: { right: cm(0), cutout: "bottom-left" },
    padding: { right: cm(10) },
  });

  const bed = translate([cm(0), cm(180), cm(10 + 2 * paxW)])(
    colorize(materials.Furniture.color)(bedModel),
  );

  const pieces: JscadObject[] = [closet, cabinet, bed];

  if (state.bed.variant === "double") {
    const mW = toCm(general.measurements.Mattress.width).value;
    pieces.push(
      translate([cm(roomW - mW), cm(0), cm(2 * paxW)])(
        colorize(materials.Furniture.color)(general.mattress),
      ),
    );
  }

  const desk = translate([
    cm(roomW - 200),
    cm(70),
    cm(roomD - 60),
  ])(
    colorize(materials.Furniture.color)(cuboid({ size: [cm(200), cm(5), cm(60)] })),
  );

  const kallaxWall = translate([cm(0), cm(0), cm(10 + 2 * paxW)])(
    colorize(materials.Furniture.color)(ikea.shelfs.Kallax({ rows: 4, columns: 5 })),
  );

  pieces.push(desk, kallaxWall);

  return [
    translate([cm(wT), cm(wT), cm(wT)])(group(...pieces)),
  ];
}

// ─── Variant: High Bed, 1.5 PAX, KALLAX Tower, NORDEN Desk & Couch ───────────

function highbedCouch(state: State): JscadObject[] {
  const wT = toCm(measurements.wall.thickness).value;
  const roomW = toCm(measurements.room.width).value;
  const roomD = toCm(measurements.room.depth).value;
  const paxW = toCm(ikea.measurements.cabinets.Pax.width).value;
  const nordenW = toCm(ikea.measurements.desks.Norden.closed.width).value;
  const nordenD = toCm(ikea.measurements.desks.Norden.depth).value;
  const kH = toCm(ikea.measurements.shelfs.Kallax.height).value;
  const kD = toCm(ikea.measurements.shelfs.Kallax.depth).value;
  const mW = toCm(general.measurements.Mattress.width).value;
  const mD = toCm(general.measurements.Mattress.depth).value;
  const armrestSize = toCm(cm(14)).value;

  const closet = translate([cm(0), cm(0), cm(10 + paxW)])(
    rotate([0, Math.PI / 2, 0], { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const cabinet = translate([cm(0), cm(0), cm(10 + paxW * 1.5)])(
    rotate([0, Math.PI / 2, 0], { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const { model: bedModel } = general.Bed({
    guards: { right: cm(0), cutout: "bottom-left" },
    padding: { right: cm(10) },
  });

  const bed = translate([cm(0), cm(160), cm(10 + 2 * paxW)])(
    colorize(materials.Furniture.color)(bedModel),
  );

  const desk = translate([
    cm(roomW - nordenW),
    cm(0),
    cm(roomD - nordenD),
  ])(
    colorize(materials.Furniture.color)(ikea.desks.Nordern(state.desk)),
  );

  const kallaxTower = colorize(materials.Furniture.color)(
    translate([cm(0), cm(0), cm(10 + paxW * 1.5)])(
      group(
        ikea.shelfs.Kallax({ rows: 2, columns: 1 }),
        translate([cm(kD), cm(0), cm(0)])(
          ikea.shelfs.Kallax({ rows: 2, columns: 1 }),
        ),
        translate([cm(2 * kD), cm(2 * kH), cm(0)])(
          rotate([0, -Math.PI / 2, 0], { around: "corner" })(
            ikea.shelfs.Kallax({ rows: 1, columns: 2 }),
          ),
        ),
        translate([cm(0), cm(3 * kH), cm(0)])(
          group(
            ikea.shelfs.Kallax({ rows: 2, columns: 1 }),
            translate([cm(kD), cm(0), cm(0)])(
              ikea.shelfs.Kallax({ rows: 2, columns: 1 }),
            ),
          ),
        ),
        translate([cm(2 * kD), cm(5 * kH), cm(0)])(
          rotate([0, -Math.PI / 2, 0], { around: "corner" })(
            ikea.shelfs.Kallax({ rows: 1, columns: 2 }),
          ),
        ),
      ),
    ),
  );

  const couch = translate([
    cm(0),
    cm(0),
    cm(roomD - mD - 2 * armrestSize),
  ])(
    colorize(materials.Furniture.color)(
      group(
        // back rest
        cuboid({ size: [cm(armrestSize), cm(90), cm(mD + 2 * armrestSize)] }),
        translate([cm(armrestSize), cm(0), cm(0)])(
          group(
            // left armrest
            cuboid({ size: [cm(mW), cm(72), cm(armrestSize)] }),
            // seat box
            translate([cm(0), cm(0), cm(armrestSize)])(
              cuboid({ size: [cm(mW), cm(45), cm(mD)] }),
            ),
            // mattress
            translate([cm(0), cm(45), cm(armrestSize)])(general.mattress),
            // right armrest
            translate([cm(0), cm(0), cm(armrestSize + mD)])(
              cuboid({ size: [cm(mW), cm(72), cm(armrestSize)] }),
            ),
          ),
        ),
      ),
    ),
  );

  return [
    translate([cm(wT), cm(wT), cm(wT)])(
      group(closet, cabinet, kallaxTower, bed, couch, desk),
    ),
  ];
}

// ─── Variant: High Bed, 2 PAX, NORDEN Desk & Couch ───────────────────────────

function highbed2Pax(state: State): JscadObject[] {
  const wT = toCm(measurements.wall.thickness).value;
  const roomW = toCm(measurements.room.width).value;
  const roomD = toCm(measurements.room.depth).value;
  const paxW = toCm(ikea.measurements.cabinets.Pax.width).value;
  const paxD = toCm(ikea.measurements.cabinets.Pax.closed.depth).value;
  const nordenW = toCm(ikea.measurements.desks.Norden.closed.width).value;
  const nordenD = toCm(ikea.measurements.desks.Norden.depth).value;
  const mW = toCm(general.measurements.Mattress.width).value;
  const mD = toCm(general.measurements.Mattress.depth).value;
  const armrestSize = toCm(cm(14)).value;

  const closet1 = translate([cm(0), cm(0), cm(10 + paxW)])(
    rotate([0, Math.PI / 2, 0], { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const closet2 = translate([cm(paxW + paxD), cm(0), cm(10 + paxW + paxD)])(
    rotate([0, Math.PI, 0], { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const { model: bedModel } = general.Bed({
    guards: { right: cm(0), cutout: "bottom-left" },
    padding: { right: cm(10) },
  });

  const bed = translate([cm(0), cm(160), cm(10 + 2 * paxW)])(
    colorize(materials.Furniture.color)(bedModel),
  );

  const desk = translate([
    cm(roomW - nordenW),
    cm(0),
    cm(roomD - nordenD),
  ])(
    colorize(materials.Furniture.color)(ikea.desks.Nordern(state.desk)),
  );

  const couch = translate([
    cm(0),
    cm(0),
    cm(roomD - mD - 2 * armrestSize),
  ])(
    colorize(materials.Furniture.color)(
      group(
        // back rest
        cuboid({ size: [cm(armrestSize), cm(90), cm(mD + 2 * armrestSize)] }),
        translate([cm(armrestSize), cm(0), cm(0)])(
          group(
            // left armrest
            cuboid({ size: [cm(mW), cm(72), cm(armrestSize)] }),
            // seat box
            translate([cm(0), cm(0), cm(armrestSize)])(
              cuboid({ size: [cm(mW), cm(45), cm(mD)] }),
            ),
            // mattress
            translate([cm(0), cm(45), cm(armrestSize)])(general.mattress),
            // right armrest
            translate([cm(0), cm(0), cm(armrestSize + mD)])(
              cuboid({ size: [cm(mW), cm(72), cm(armrestSize)] }),
            ),
          ),
        ),
      ),
    ),
  );

  return [
    translate([cm(wT), cm(wT), cm(wT)])(
      group(closet1, closet2, bed, couch, desk),
    ),
  ];
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
      translate([cm(t), cm(0), cm(0)])(
        colorize(materials.Wall.color)(
          pipe(
            cuboid({ size: [cm(W), cm(H + t), cm(t)] }),
            subtract(
              translate([cm(dRight), cm(0), cm(t - dD)])(
                cuboid({ size: [cm(dW), cm(dH), cm(dD)] }),
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
      translate([cm(t), cm(0), cm(D + t)])(
        colorize(materials.Wall.color)(
          pipe(
            cuboid({ size: [cm(W), cm(H + t), cm(t)] }),
            subtract(
              translate([cm(wRight), cm(wBottom), cm(0)])(
                cuboid({ size: [cm(wW), cm(wH), cm(wD)] }),
              ),
            ),
            union(
              translate([cm(wbRight), cm(wbBottom), cm(-wbD)])(
                cuboid({ size: [cm(wbW), cm(wbH), cm(wbD)] }),
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
        colorize(materials.Wall.color)(cuboid({ size: [cm(t), cm(H + t), cm(D + 2 * t)] })),
    );
  }

  // Left wall (X = W + t to W + 2t)
  if (surfaces.leftWall) {
    result.push(
      translate([cm(t + W), cm(0), cm(0)])(
      colorize(materials.Wall.color)(cuboid({ size: [cm(t), cm(H + t), cm(D + 2 * t)] })),
      ),
    );
  }

  // Floor
  if (surfaces.floor) {
    result.push(
      translate([cm(t), cm(0), cm(t)])(
        colorize(materials.Wall.color)(cuboid({ size: [cm(W), cm(t), cm(D)] })),
      ),
    );
  }

  // Ceiling
  if (surfaces.ceiling) {
    result.push(
      translate([cm(0), cm(H + t), cm(0)])(
        colorize(materials.Wall.color)(cuboid({ size: [cm(W + 2 * t), cm(t), cm(D + 2 * t)] })),
      ),
    );
  }

  return result;
}
