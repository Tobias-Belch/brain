import modeling from "@jscad/modeling";
import { cm, m } from "@pocs/values";
import * as general from "./general";
import * as ikea from "./ikea";
import { materials } from "./materials";
import { box, normalize } from "./utils";

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

export function MilasRoom({ state = defaultState }: { state?: State } = {}) {
  const t = normalize(measurements.wall.thickness);
  const W = normalize(measurements.room.width);
  const H = normalize(measurements.room.height);
  const D = normalize(measurements.room.depth);

  const debugElements = DEBUG
    ? [translate([t, t, t], colorize(materials.Debug.color, box(W, H, D)))]
    : [];

  const models = [room(state), ...debugElements];

  switch (state.variant) {
    case "brimnesBillyPax":
      models.push(...brimnesBillyPax(state));
      break;
    case "highbedKallaxWall":
      models.push(...highbedKallaxWall(state));
      break;
    case "highbedCouch":
      models.push(...highbedCouch(state));
      break;
    case "highbed2Pax":
      models.push(...highbed2Pax(state));
      break;
  }

  return models;
}

function brimnesBillyPax(state: State) {
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
        normalize(cm(8)) +
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
        normalize(cm(8)) +
        normalize(ikea.measurements.cabinets.Pax.width) +
        normalize(cm(3)) +
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
        normalize(ikea.measurements.cabinets.Pax.height) -
        normalize(ikea.measurements.shelfs.Billy.height),
      normalised.wall.thickness +
        normalize(cm(8)) +
        normalize(ikea.measurements.cabinets.Pax.width) +
        normalize(cm(3)) +
        normalize(ikea.measurements.desks.Billy.width),
    ],
    rotate(
      [0, Math.PI / 2, 0],
      colorize(materials.Furniture.color, ikea.shelfs.Billy()),
    ),
  );

  const cabinets = translate(
    [
      normalised.wall.thickness,
      normalised.wall.thickness +
        normalize(ikea.measurements.cabinets.Pax.height) -
        normalize(ikea.measurements.cabinets.Besta.height),
      normalised.wall.thickness +
        normalize(cm(8)) +
        normalize(ikea.measurements.cabinets.Pax.width) +
        normalize(cm(3)) +
        normalize(ikea.measurements.desks.Billy.width),
    ],
    colorize(materials.Furniture.color, [
      ikea.cabinets.Besta(),
      translate(
        [0, 0, normalize(ikea.measurements.cabinets.Besta.width)],
        ikea.cabinets.Besta(),
      ),
      translate(
        [0, 0, 2 * normalize(ikea.measurements.cabinets.Besta.width)],
        ikea.cabinets.Besta(),
      ),
      translate(
        [0, 0, 3 * normalize(ikea.measurements.cabinets.Besta.width)],
        ikea.cabinets.Besta(),
      ),
    ]),
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

  return [bed, closet, desk, shelfOverDesk, cabinets];
}

function highbedKallaxWall(state: State) {
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
    [0, 0, normalize(cm(10)) + normalize(ikea.measurements.cabinets.Pax.width)],
    rotate(
      [0, Math.PI / 2, 0],
      colorize(materials.Furniture.color, ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const cabinet = translate(
    [
      0,
      0,
      normalize(cm(10)) +
        normalize(ikea.measurements.cabinets.Pax.width) +
        normalize(ikea.measurements.cabinets.Pax.width),
    ],
    rotate(
      [0, Math.PI / 2, 0],
      colorize(materials.Furniture.color, ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const { model: bedModel } = general.Bed({
    guards: { right: cm(0), cutout: "bottom-left" },
    padding: { right: cm(10) },
  });

  const bed = [
    translate(
      [
        0,
        normalize(cm(180)),
        normalize(cm(10)) +
          normalize(ikea.measurements.cabinets.Pax.width) +
          normalize(ikea.measurements.cabinets.Pax.width),
      ],
      colorize(materials.Furniture.color, bedModel),
    ),
  ];

  if (state.bed.variant === "double") {
    bed.push([
      translate(
        [
          normalised.room.width -
            normalize(general.measurements.Mattress.width),
          0,
          normalize(ikea.measurements.cabinets.Pax.width) +
            normalize(ikea.measurements.cabinets.Pax.width),
        ],
        colorize(materials.Furniture.color, general.mattress),
      ),
    ]);
  }

  const desk = translate(
    [
      normalised.room.width - normalize(cm(200)),
      normalize(cm(70)),
      normalised.room.depth - normalize(cm(60)),
    ],
    colorize(
      materials.Furniture.color,
      box(normalize(cm(200)), normalize(cm(5)), normalize(cm(60))),
    ),
  );

  const kallaxWall = translate(
    [
      0,
      0,
      normalize(cm(10)) +
        normalize(ikea.measurements.cabinets.Pax.width) +
        normalize(ikea.measurements.cabinets.Pax.width),
    ],
    colorize(
      materials.Furniture.color,
      ikea.shelfs.Kallax({ rows: 4, columns: 5 }),
    ),
  );

  return translate(
    [
      normalised.wall.thickness,
      normalised.wall.thickness,
      normalised.wall.thickness,
    ],
    [closet, cabinet, ...bed, desk, kallaxWall],
  );
}

function highbedCouch(state: State) {
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
    [0, 0, normalize(cm(10)) + normalize(ikea.measurements.cabinets.Pax.width)],
    rotate(
      [0, Math.PI / 2, 0],
      colorize(materials.Furniture.color, ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const cabinet = translate(
    [
      0,
      0,
      normalize(cm(10)) +
        normalize(ikea.measurements.cabinets.Pax.width) +
        normalize(ikea.measurements.cabinets.Pax.width) / 2,
    ],
    rotate(
      [0, Math.PI / 2, 0],
      colorize(materials.Furniture.color, ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const { model: bedModel } = general.Bed({
    guards: { right: cm(0), cutout: "bottom-left" },
    padding: { right: cm(10) },
  });

  const bed = [
    translate(
      [
        0,
        normalize(cm(160)),
        normalize(cm(10)) +
          normalize(ikea.measurements.cabinets.Pax.width) +
          normalize(ikea.measurements.cabinets.Pax.width),
      ],
      colorize(materials.Furniture.color, bedModel),
    ),
  ];

  const desk = translate(
    [
      normalised.room.width -
        normalize(ikea.measurements.desks.Norden.closed.width),
      0,
      normalised.room.depth - normalize(ikea.measurements.desks.Norden.depth),
    ],
    colorize(materials.Furniture.color, ikea.desks.Nordern(state.desk)),
  );

  const kallaxTower = colorize(
    materials.Furniture.color,
    translate(
      [
        0,
        0,
        normalize(cm(10)) +
          normalize(ikea.measurements.cabinets.Pax.width) * 1.5,
      ],
      [
        ikea.shelfs.Kallax({ rows: 2, columns: 1 }),
        translate(
          [normalize(ikea.measurements.shelfs.Kallax.depth), 0, 0],
          ikea.shelfs.Kallax({ rows: 2, columns: 1 }),
        ),
        translate(
          [
            2 * normalize(ikea.measurements.shelfs.Kallax.depth),
            2 * normalize(ikea.measurements.shelfs.Kallax.height),
            0,
          ],
          rotate(
            [0, -Math.PI / 2, 0],
            ikea.shelfs.Kallax({ rows: 1, columns: 2 }),
          ),
        ),
        translate(
          [0, 3 * normalize(ikea.measurements.shelfs.Kallax.height), 0],
          [
            ikea.shelfs.Kallax({ rows: 2, columns: 1 }),
            translate(
              [normalize(ikea.measurements.shelfs.Kallax.depth), 0, 0],
              ikea.shelfs.Kallax({ rows: 2, columns: 1 }),
            ),
          ],
        ),
        translate(
          [
            2 * normalize(ikea.measurements.shelfs.Kallax.depth),
            5 * normalize(ikea.measurements.shelfs.Kallax.height),
            0,
          ],
          rotate(
            [0, -Math.PI / 2, 0],
            ikea.shelfs.Kallax({ rows: 1, columns: 2 }),
          ),
        ),
      ],
    ),
  );

  const armrestSize = cm(14);
  const couch = translate(
    [
      0,
      0,
      normalised.room.depth -
        normalize(general.measurements.Mattress.depth) -
        2 * normalize(armrestSize),
    ],
    colorize(materials.Furniture.color, [
      // back rest
      box(
        normalize(armrestSize),
        normalize(cm(90)),
        normalize(general.measurements.Mattress.depth) +
          2 * normalize(armrestSize),
      ),
      translate(
        [normalize(armrestSize), 0, 0],
        [
          // left armrest
          box(
            normalize(general.measurements.Mattress.width),
            normalize(cm(72)),
            normalize(armrestSize),
          ),
          // box
          translate(
            [0, 0, normalize(armrestSize)],
            box(
              normalize(general.measurements.Mattress.width),
              normalize(cm(45)),
              normalize(general.measurements.Mattress.depth),
            ),
          ),
          // mattress
          translate(
            [0, normalize(cm(45)), normalize(armrestSize)],
            general.mattress,
          ),
          // right armrest
          translate(
            [
              0,
              0,
              normalize(armrestSize) +
                normalize(general.measurements.Mattress.depth),
            ],
            box(
              normalize(general.measurements.Mattress.width),
              normalize(cm(72)),
              normalize(armrestSize),
            ),
          ),
        ],
      ),
    ]),
  );

  return translate(
    [
      normalised.wall.thickness,
      normalised.wall.thickness,
      normalised.wall.thickness,
    ],
    [closet, cabinet, ...kallaxTower, ...bed, couch, desk],
  );
}

function highbed2Pax(state: State) {
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

  const closets = [
    translate(
      [
        0,
        0,
        normalize(cm(10)) + normalize(ikea.measurements.cabinets.Pax.width),
      ],
      rotate(
        [0, Math.PI / 2, 0],
        colorize(materials.Furniture.color, ikea.cabinets.Pax(state.cabinet)),
      ),
    ),
    translate(
      [
        normalize(ikea.measurements.cabinets.Pax.width) +
          normalize(ikea.measurements.cabinets.Pax.closed.depth),
        0,
        normalize(cm(10)) +
          normalize(ikea.measurements.cabinets.Pax.width) +
          normalize(ikea.measurements.cabinets.Pax.closed.depth),
      ],
      rotate(
        [0, Math.PI, 0],
        colorize(materials.Furniture.color, ikea.cabinets.Pax(state.cabinet)),
      ),
    ),
  ];

  const { model: bedModel } = general.Bed({
    guards: { right: cm(0), cutout: "bottom-left" },
    padding: { right: cm(10) },
  });

  const bed = [
    translate(
      [
        0,
        normalize(cm(160)),
        normalize(cm(10)) +
          normalize(ikea.measurements.cabinets.Pax.width) +
          normalize(ikea.measurements.cabinets.Pax.width),
      ],
      colorize(materials.Furniture.color, bedModel),
    ),
  ];

  const desk = translate(
    [
      normalised.room.width -
        normalize(ikea.measurements.desks.Norden.closed.width),
      0,
      normalised.room.depth - normalize(ikea.measurements.desks.Norden.depth),
    ],
    colorize(materials.Furniture.color, ikea.desks.Nordern(state.desk)),
  );

  const armrestSize = cm(14);
  const couch = translate(
    [
      0,
      0,
      normalised.room.depth -
        normalize(general.measurements.Mattress.depth) -
        2 * normalize(armrestSize),
    ],
    colorize(materials.Furniture.color, [
      // back rest
      box(
        normalize(armrestSize),
        normalize(cm(90)),
        normalize(general.measurements.Mattress.depth) +
          2 * normalize(armrestSize),
      ),
      translate(
        [normalize(armrestSize), 0, 0],
        [
          // left armrest
          box(
            normalize(general.measurements.Mattress.width),
            normalize(cm(72)),
            normalize(armrestSize),
          ),
          // box
          translate(
            [0, 0, normalize(armrestSize)],
            box(
              normalize(general.measurements.Mattress.width),
              normalize(cm(45)),
              normalize(general.measurements.Mattress.depth),
            ),
          ),
          // mattress
          translate(
            [0, normalize(cm(45)), normalize(armrestSize)],
            general.mattress,
          ),
          // right armrest
          translate(
            [
              0,
              0,
              normalize(armrestSize) +
                normalize(general.measurements.Mattress.depth),
            ],
            box(
              normalize(general.measurements.Mattress.width),
              normalize(cm(72)),
              normalize(armrestSize),
            ),
          ),
        ],
      ),
    ]),
  );

  return translate(
    [
      normalised.wall.thickness,
      normalised.wall.thickness,
      normalised.wall.thickness,
    ],
    [...closets, ...bed, couch, desk],
  );
}

function room(state: State) {
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

  const surfaces = state.surfaces;

  // --- Front wall (Z = 0 to t), full width, with door cutout ---
  const frontWall = surfaces.frontWall
    ? translate(
        [t, 0, 0],
        colorize(
          materials.Wall.color,
          subtract(
            box(W, H + t, t),
            translate([dRight, dBottom, t - dD], box(dW, dH, dD)),
          ),
        ),
      )
    : null;

  // --- Back wall (Z = D - t to D), full width, with window cutout ---
  const backWall = surfaces.backWall
    ? translate(
        [t, 0, D + t],
        colorize(
          materials.Wall.color,
          union(
            subtract(
              box(W, H + t, t),
              translate([wRight, wBottom, 0], box(wW, wH, wD)),
            ),
            translate([wbRight, wbBottom, -wbD], box(wbW, wbH, wbD)),
          ),
        ),
      )
    : null;

  // --- Right wall (X = 0 to t), between front and back walls ---
  const rightWall = surfaces.rightWall
    ? colorize(materials.Wall.color, box(t, H + t, D + 2 * t))
    : null;

  // --- Left wall (X = W - t to W), between front and back walls ---
  const leftWall = surfaces.leftWall
    ? translate(
        [t + W, 0, 0],
        colorize(materials.Wall.color, box(t, H + t, D + 2 * t)),
      )
    : null;

  // --- Floor ---
  const floor = surfaces.floor
    ? translate([t, 0, t], colorize(materials.Wall.color, box(W, t, D)))
    : null;

  // --- Ceiling ---
  const ceiling = surfaces.ceiling
    ? translate(
        [0, H + t, 0],
        colorize(materials.Wall.color, box(W + 2 * t, t, D + 2 * t)),
      )
    : null;

  return [frontWall, backWall, leftWall, rightWall, floor, ceiling].filter(
    Boolean,
  );
}
