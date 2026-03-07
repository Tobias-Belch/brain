import modeling from "@jscad/modeling";
import { calculateVolume, cm, l, m, mm } from "@pocs/values";
import { box, normalize } from "./utils";

const {
  transforms: { rotate, translate },
} = modeling;

export const measurements = {
  beds: {
    Mattress: {
      width: cm(80),
      height: cm(10),
      depth: cm(200),
    },
    // https://www.ikea.com/de/de/p/brimnes-tagesbettgestell-2-schubladen-weiss-00228705/
    Brimnes: {
      storage: l(2 * calculateVolume(cm(85), cm(16), cm(54)).value),
      width: cm(205),
      height: cm(58),
      depth: cm(87),
      boards: {
        thickness: cm(1.8),
        side: {
          height: cm(58),
          depth: cm(87),
        },
        back: {
          width: cm(205 - 2 * 1.8),
          height: cm(58),
        },
        front: {
          width: cm(205 - 2 * 1.8),
          height: cm(42),
        },
      },
      drawer: {
        boards: {
          thickness: cm(1.8),
          height: cm(12),
          back: {
            width: cm(85),
          },
          side: {
            depth: cm(54),
          },
          front: {
            width: cm(85 + 2 * 1.8),
            height: cm(16),
          },
        },
      },
    },
  },
  cabinets: {
    // https://www.ikea.com/de/de/p/pax-forsand-kleiderschrank-weiss-weiss-s49502665/
    Pax: {
      storage: calculateVolume(cm(96), cm(200), cm(58)),
      boards: {
        thickness: mm(18),
        back: {
          width: cm(100),
          height: cm(236),
          thickness: mm(3),
        },
        side: {
          height: cm(236 - 2 * 1.8),
          depth: cm(58),
        },
        bottomTop: {
          width: cm(100),
          depth: cm(58),
        },
        door: {
          width: cm(50),
          height: cm(229),
        },
      },
      width: cm(100),
      height: cm(236),
      closed: {
        depth: cm(60),
      },
      opened: {
        depth: cm(60 + 50),
      },
    },
  },
  desks: {
    // https://www.ikea.com/de/de/p/billy-buecherregal-mit-klapptisch-weiss-00579755/
    Billy: {
      storage: l(
        // top shelf
        calculateVolume(cm(76), cm(24), cm(26)).value +
          // middle shelf
          calculateVolume(cm(72), cm(31), cm(24)).value +
          // bottom shelf
          calculateVolume(cm(72), cm(30), cm(24)).value,
      ),
      boards: {
        thickness: cm(1.8),
        outer: {
          side: {
            height: cm(106),
            depth: cm(28),
          },
          shelf: {
            width: cm(80 - 2 * 1.8),
            depth: cm(28),
            fromTop: cm(23.9),
          },
        },
        inner: {
          back: {
            thickness: mm(3),
            width: cm(71.9 + 2 * 1.8),
            height: cm(74.3 - 1.8),
          },
          side: {
            height: cm(74.3 - 1.8),
            depth: cm(24),
          },
          top: {
            width: cm(71.9 + 2 * 1.8),
            depth: cm(24),
          },
          shelf: {
            width: cm(71.9),
            depth: cm(24),
            fromTop: cm(31),
            fromBottom: cm(74.3 - 2 * 1.8 - 31 - 29.8),
          },
        },
        desk: {
          width: cm(71.9 + 2 * 1.8),
          depth: cm(28 + 54.5),
        },
      },
      width: cm(80),
      height: cm(106),
      closed: {
        depth: cm(32.5),
      },
      opened: {
        depth: cm(112.4),
      },
    },
  },
  shelfs: {
    // https://www.ikea.com/de/de/p/billy-buecherregal-weiss-30263844/
    Billy: {
      storage: l(3 * calculateVolume(cm(76), cm(33), cm(28)).value),
      width: cm(80),
      height: cm(106),
      depth: cm(28),
      boards: {
        thickness: cm(1.8),
        back: {
          thickness: mm(3),
          width: cm(80),
          height: cm(106),
        },
        side: {
          height: cm(106),
          depth: cm(28),
        },
        shelf: {
          width: cm(80 - 2 * 1.8),
          depth: cm(28),
        },
      },
    },
    // https://www.ikea.com/de/de/p/kallax-regal-weiss-20301554/
    Kallax: {
      width: cm(39),
      height: cm(40.7),
      depth: cm(41.5),
      boards: {
        thickness: mm(35.5),
        side: {
          height: cm(33.5),
          depth: cm(39),
        },
        bottomTop: {
          width: cm(41.5),
          depth: cm(39),
        },
      },
      storage: l(2 * calculateVolume(cm(39), cm(33.5), cm(33.5)).value),
    },
  },
};

const mattress = box(
  normalize(measurements.beds.Mattress.depth),
  normalize(measurements.beds.Mattress.height),
  normalize(measurements.beds.Mattress.width),
);

const brimnesBed = {
  back: translate(
    [
      normalize(measurements.beds.Brimnes.boards.thickness),
      0,
      normalize(measurements.beds.Brimnes.depth) -
        normalize(measurements.beds.Brimnes.boards.thickness),
    ],
    box(
      normalize(measurements.beds.Brimnes.boards.back.width),
      normalize(measurements.beds.Brimnes.boards.back.height),
      normalize(measurements.beds.Brimnes.boards.thickness),
    ),
  ),
  right: translate(
    [0, 0, 0],
    box(
      normalize(measurements.beds.Brimnes.boards.thickness),
      normalize(measurements.beds.Brimnes.boards.side.height),
      normalize(measurements.beds.Brimnes.boards.side.depth),
    ),
  ),
  left: translate(
    [
      normalize(measurements.beds.Brimnes.boards.thickness) +
        normalize(measurements.beds.Brimnes.boards.back.width),
      0,
      0,
    ],
    box(
      normalize(measurements.beds.Brimnes.boards.thickness),
      normalize(measurements.beds.Brimnes.boards.side.height),
      normalize(measurements.beds.Brimnes.boards.side.depth),
    ),
  ),
  front: translate(
    [normalize(measurements.beds.Brimnes.boards.thickness), 0, 0],
    [
      // front
      box(
        normalize(measurements.beds.Brimnes.boards.front.width),
        normalize(measurements.beds.Brimnes.boards.front.height),
        normalize(measurements.beds.Brimnes.boards.thickness),
      ),
      // right
      box(
        normalize(measurements.beds.Brimnes.boards.thickness),
        normalize(measurements.beds.Brimnes.boards.front.height) -
          normalize(cm(3)),
        normalize(measurements.beds.Mattress.width),
      ),
      // left
      translate(
        [
          normalize(measurements.beds.Brimnes.boards.front.width) -
            normalize(measurements.beds.Brimnes.boards.thickness),
          0,
          0,
        ],
        box(
          normalize(measurements.beds.Brimnes.boards.thickness),
          normalize(measurements.beds.Brimnes.boards.front.height) -
            normalize(cm(3)),
          normalize(measurements.beds.Mattress.width),
        ),
      ),
    ],
  ),
  drawer: translate(
    [0, 0, 0],
    [
      // front
      box(
        normalize(measurements.beds.Brimnes.drawer.boards.front.width),
        normalize(measurements.beds.Brimnes.drawer.boards.front.height),
        normalize(measurements.beds.Brimnes.drawer.boards.thickness),
      ),
      // right
      translate(
        [0, 0, normalize(measurements.beds.Brimnes.drawer.boards.thickness)],
        box(
          normalize(measurements.beds.Brimnes.drawer.boards.thickness),
          normalize(measurements.beds.Brimnes.drawer.boards.height),
          normalize(measurements.beds.Brimnes.drawer.boards.side.depth),
        ),
      ),
      // left
      translate(
        [
          normalize(measurements.beds.Brimnes.drawer.boards.front.width) -
            normalize(measurements.beds.Brimnes.drawer.boards.thickness),
          0,
          normalize(measurements.beds.Brimnes.drawer.boards.thickness),
        ],
        box(
          normalize(measurements.beds.Brimnes.drawer.boards.thickness),
          normalize(measurements.beds.Brimnes.drawer.boards.height),
          normalize(measurements.beds.Brimnes.drawer.boards.side.depth),
        ),
      ),
      // bottom
      translate(
        [0, 0, normalize(measurements.beds.Brimnes.drawer.boards.thickness)],
        box(
          normalize(measurements.beds.Brimnes.drawer.boards.front.width),
          normalize(measurements.beds.Brimnes.drawer.boards.thickness),
          normalize(measurements.beds.Brimnes.drawer.boards.side.depth),
        ),
      ),
    ],
  ),
};

export const beds = {
  Brimnes: (state: {
    drawers: "closed" | "opened";
    variant: "single" | "double";
  }) => {
    const frontDepthCorrection =
      state.variant === "double"
        ? -normalize(measurements.beds.Mattress.width)
        : 0;

    const box = [
      brimnesBed.back,
      brimnesBed.right,
      brimnesBed.left,
      translate([0, 0, frontDepthCorrection], brimnesBed.front),
    ];

    const drawerGap =
      (normalize(measurements.beds.Brimnes.boards.front.width) -
        2 * normalize(measurements.beds.Brimnes.drawer.boards.front.width)) /
      3;

    const drawerDepthCorrection =
      state.drawers === "opened" ? -normalize(cm(50)) : 0;

    const drawers = translate(
      [drawerGap, drawerGap, frontDepthCorrection + drawerDepthCorrection],
      [
        brimnesBed.drawer,
        translate(
          [
            normalize(measurements.beds.Brimnes.drawer.boards.front.width) +
              drawerGap,
            0,
            0,
          ],
          brimnesBed.drawer,
        ),
      ],
    );

    const mattresses =
      state.variant === "double"
        ? [
            translate(
              [
                normalize(measurements.beds.Brimnes.boards.thickness),
                normalize(measurements.beds.Brimnes.boards.front.height) -
                  normalize(cm(3)),
                normalize(measurements.beds.Brimnes.boards.thickness),
              ],
              [
                mattress,
                translate(
                  [0, 0, -normalize(measurements.beds.Mattress.width)],
                  mattress,
                ),
              ],
            ),
          ]
        : [
            translate(
              [
                normalize(measurements.beds.Brimnes.boards.thickness),
                normalize(measurements.beds.Brimnes.boards.front.height) -
                  normalize(cm(3)),
                normalize(measurements.beds.Brimnes.boards.thickness),
              ],
              [
                mattress,
                translate(
                  [0, normalize(measurements.beds.Mattress.height), 0],
                  mattress,
                ),
              ],
            ),
          ];

    return [...box, drawers, ...mattresses];
  },
};

export const cabinets = {
  Pax: (state: { variant: "closed" | "opened" }) => {
    const corpus = [
      // back
      box(
        normalize(measurements.cabinets.Pax.boards.back.width),
        normalize(measurements.cabinets.Pax.boards.back.height),
        normalize(measurements.cabinets.Pax.boards.back.thickness),
      ),
      // right
      translate(
        [0, normalize(measurements.cabinets.Pax.boards.thickness), 0],
        box(
          normalize(measurements.cabinets.Pax.boards.thickness),
          normalize(measurements.cabinets.Pax.boards.side.height),
          normalize(measurements.cabinets.Pax.boards.side.depth),
        ),
      ),
      // left
      translate(
        [
          normalize(measurements.cabinets.Pax.boards.back.width) -
            normalize(measurements.cabinets.Pax.boards.thickness),
          normalize(measurements.cabinets.Pax.boards.thickness),
          0,
        ],
        box(
          normalize(measurements.cabinets.Pax.boards.thickness),
          normalize(measurements.cabinets.Pax.boards.side.height),
          normalize(measurements.cabinets.Pax.boards.side.depth),
        ),
      ),
      // bottom
      translate(
        [0, 0, 0],
        box(
          normalize(measurements.cabinets.Pax.boards.bottomTop.width),
          normalize(measurements.cabinets.Pax.boards.thickness),
          normalize(measurements.cabinets.Pax.boards.bottomTop.depth),
        ),
      ),
      // top
      translate(
        [
          0,
          normalize(measurements.cabinets.Pax.boards.side.height) +
            normalize(measurements.cabinets.Pax.boards.thickness),
          0,
        ],
        box(
          normalize(measurements.cabinets.Pax.boards.bottomTop.width),
          normalize(measurements.cabinets.Pax.boards.thickness),
          normalize(measurements.cabinets.Pax.boards.bottomTop.depth),
        ),
      ),
    ];

    const rightDoor = translate(
      [
        normalize(measurements.cabinets.Pax.boards.door.width) +
          (state.variant === "opened"
            ? normalize(measurements.cabinets.Pax.boards.door.width)
            : 0),
        0,
        0,
      ],
      rotate(
        [0, state.variant === "opened" ? -Math.PI / 2 : 0, 0],
        box(
          normalize(measurements.cabinets.Pax.boards.door.width),
          normalize(measurements.cabinets.Pax.boards.door.height),
          normalize(measurements.cabinets.Pax.boards.thickness),
        ),
      ),
    );

    const leftDoor = translate(
      [
        state.variant === "opened"
          ? normalize(measurements.cabinets.Pax.boards.thickness)
          : 0,
        0,
        0,
      ],
      rotate(
        [0, state.variant === "opened" ? -Math.PI / 2 : 0, 0],
        box(
          normalize(measurements.cabinets.Pax.boards.door.width),
          normalize(measurements.cabinets.Pax.boards.door.height),
          normalize(measurements.cabinets.Pax.boards.thickness),
        ),
      ),
    );

    const doors = translate(
      [
        0,
        2 * normalize(measurements.cabinets.Pax.boards.thickness) +
          normalize(measurements.cabinets.Pax.boards.side.height) -
          normalize(measurements.cabinets.Pax.boards.door.height),
        normalize(measurements.cabinets.Pax.boards.side.depth),
      ],
      [leftDoor, rightDoor],
    );

    return [...corpus, doors];
  },
};

export const desks = {
  Billy: (state: { variant: "closed" | "opened" }) => {
    const outer = [
      // right
      box(
        normalize(measurements.desks.Billy.boards.thickness),
        normalize(measurements.desks.Billy.boards.outer.side.height),
        normalize(measurements.desks.Billy.boards.outer.side.depth),
      ),
      // left
      translate(
        [
          normalize(measurements.desks.Billy.boards.outer.shelf.width) +
            normalize(measurements.desks.Billy.boards.thickness),
          0,
          0,
        ],
        box(
          normalize(measurements.desks.Billy.boards.thickness),
          normalize(measurements.desks.Billy.boards.outer.side.height),
          normalize(measurements.desks.Billy.boards.outer.side.depth),
        ),
      ),
      // top
      translate(
        [
          normalize(measurements.desks.Billy.boards.thickness),
          normalize(measurements.desks.Billy.boards.outer.side.height) -
            normalize(measurements.desks.Billy.boards.thickness),
          0,
        ],
        box(
          normalize(measurements.desks.Billy.boards.outer.shelf.width),
          normalize(measurements.desks.Billy.boards.thickness),
          normalize(measurements.desks.Billy.boards.outer.shelf.depth),
        ),
      ),
      // shelf
      translate(
        [
          normalize(measurements.desks.Billy.boards.thickness),
          normalize(measurements.desks.Billy.boards.outer.side.height) -
            normalize(measurements.desks.Billy.boards.thickness) -
            normalize(measurements.desks.Billy.boards.outer.shelf.fromTop),
          0,
        ],
        box(
          normalize(measurements.desks.Billy.boards.outer.shelf.width),
          normalize(measurements.desks.Billy.boards.thickness),
          normalize(measurements.desks.Billy.boards.outer.shelf.depth),
        ),
      ),
    ];

    const inner = translate(
      [
        normalize(measurements.desks.Billy.boards.thickness),
        0,
        state.variant === "opened"
          ? normalize(measurements.desks.Billy.boards.desk.depth)
          : 0,
      ],
      [
        //back
        box(
          normalize(measurements.desks.Billy.boards.inner.back.width),
          normalize(measurements.desks.Billy.boards.inner.back.height),
          normalize(measurements.desks.Billy.boards.inner.back.thickness),
        ),
        // right
        box(
          normalize(measurements.desks.Billy.boards.thickness),
          normalize(measurements.desks.Billy.boards.inner.side.height),
          normalize(measurements.desks.Billy.boards.inner.side.depth),
        ),
        // left
        translate(
          [
            normalize(measurements.desks.Billy.boards.inner.shelf.width) +
              normalize(measurements.desks.Billy.boards.thickness),
            0,
            0,
          ],
          box(
            normalize(measurements.desks.Billy.boards.thickness),
            normalize(measurements.desks.Billy.boards.inner.side.height),
            normalize(measurements.desks.Billy.boards.inner.side.depth),
          ),
        ),
        // top
        translate(
          [0, normalize(measurements.desks.Billy.boards.inner.side.height), 0],
          box(
            normalize(measurements.desks.Billy.boards.inner.top.width),
            normalize(measurements.desks.Billy.boards.thickness),
            normalize(measurements.desks.Billy.boards.inner.top.depth),
          ),
        ),
        // shelf
        translate(
          [
            normalize(measurements.desks.Billy.boards.thickness),
            normalize(measurements.desks.Billy.boards.inner.side.height) -
              normalize(measurements.desks.Billy.boards.thickness) -
              normalize(measurements.desks.Billy.boards.inner.shelf.fromTop),
            0,
          ],
          box(
            normalize(measurements.desks.Billy.boards.inner.shelf.width),
            normalize(measurements.desks.Billy.boards.thickness),
            normalize(measurements.desks.Billy.boards.inner.shelf.depth),
          ),
        ),
        // shelf bottom
        translate(
          [
            normalize(measurements.desks.Billy.boards.thickness),
            normalize(measurements.desks.Billy.boards.inner.shelf.fromBottom),
            0,
          ],
          box(
            normalize(measurements.desks.Billy.boards.inner.shelf.width),
            normalize(measurements.desks.Billy.boards.thickness),
            normalize(measurements.desks.Billy.boards.inner.shelf.depth),
          ),
        ),
      ],
    );

    const desk =
      state.variant === "opened"
        ? [
            translate(
              [
                normalize(measurements.desks.Billy.boards.thickness),
                normalize(measurements.desks.Billy.boards.inner.side.height),
                0,
              ],
              box(
                normalize(measurements.desks.Billy.boards.desk.width),
                normalize(measurements.desks.Billy.boards.thickness),
                normalize(measurements.desks.Billy.boards.desk.depth),
              ),
            ),
          ]
        : [];

    return [...outer, ...inner, ...desk];
  },
};

export const shelfs = {
  Billy: () => {
    return [
      // back
      box(
        normalize(measurements.shelfs.Billy.boards.back.width),
        normalize(measurements.shelfs.Billy.boards.back.height),
        normalize(measurements.shelfs.Billy.boards.back.thickness),
      ),
      // right
      box(
        normalize(measurements.shelfs.Billy.boards.thickness),
        normalize(measurements.shelfs.Billy.boards.side.height),
        normalize(measurements.shelfs.Billy.boards.side.depth),
      ),
      // left
      translate(
        [
          normalize(measurements.shelfs.Billy.boards.back.width) -
            normalize(measurements.shelfs.Billy.boards.thickness),
          0,
          0,
        ],
        box(
          normalize(measurements.shelfs.Billy.boards.thickness),
          normalize(measurements.shelfs.Billy.boards.side.height),
          normalize(measurements.shelfs.Billy.boards.side.depth),
        ),
      ),
      // bottom
      translate(
        [
          normalize(measurements.shelfs.Billy.boards.thickness),
          normalize(cm(5)),
          0,
        ],
        box(
          normalize(measurements.shelfs.Billy.boards.shelf.width),
          normalize(measurements.shelfs.Billy.boards.thickness),
          normalize(measurements.shelfs.Billy.boards.shelf.depth),
        ),
      ),
      translate(
        [
          normalize(measurements.shelfs.Billy.boards.thickness),
          normalize(cm(38)),
          0,
        ],
        box(
          normalize(measurements.shelfs.Billy.boards.shelf.width),
          normalize(measurements.shelfs.Billy.boards.thickness),
          normalize(measurements.shelfs.Billy.boards.shelf.depth),
        ),
      ),
      translate(
        [
          normalize(measurements.shelfs.Billy.boards.thickness),
          normalize(cm(72)),
          0,
        ],
        box(
          normalize(measurements.shelfs.Billy.boards.shelf.width),
          normalize(measurements.shelfs.Billy.boards.thickness),
          normalize(measurements.shelfs.Billy.boards.shelf.depth),
        ),
      ),
      // top
      translate(
        [
          normalize(measurements.shelfs.Billy.boards.thickness),
          normalize(measurements.shelfs.Billy.boards.side.height) -
            normalize(measurements.shelfs.Billy.boards.thickness),
          0,
        ],
        box(
          normalize(measurements.shelfs.Billy.boards.shelf.width),
          normalize(measurements.shelfs.Billy.boards.thickness),
          normalize(measurements.shelfs.Billy.boards.shelf.depth),
        ),
      ),
    ];
  },
  Kallax: () => {
    const bottom = box(
      normalize(measurements.shelfs.Kallax.boards.bottomTop.depth),
      normalize(measurements.shelfs.Kallax.boards.thickness),
      normalize(measurements.shelfs.Kallax.boards.bottomTop.width),
    );

    const left = translate(
      [0, normalize(measurements.shelfs.Kallax.boards.thickness), 0],
      box(
        normalize(measurements.shelfs.Kallax.boards.side.depth),
        normalize(measurements.shelfs.Kallax.boards.side.height),
        normalize(measurements.shelfs.Kallax.boards.thickness),
      ),
    );

    const right = translate(
      [
        0,
        normalize(measurements.shelfs.Kallax.boards.thickness),
        normalize(measurements.shelfs.Kallax.boards.bottomTop.width) -
          normalize(measurements.shelfs.Kallax.boards.thickness),
      ],
      box(
        normalize(measurements.shelfs.Kallax.boards.side.depth),
        normalize(measurements.shelfs.Kallax.boards.side.height),
        normalize(measurements.shelfs.Kallax.boards.thickness),
      ),
    );

    const top = translate(
      [
        0,
        normalize(measurements.shelfs.Kallax.boards.thickness) +
          normalize(measurements.shelfs.Kallax.boards.side.height),
        0,
      ],
      box(
        normalize(measurements.shelfs.Kallax.boards.bottomTop.depth),
        normalize(measurements.shelfs.Kallax.boards.thickness),
        normalize(measurements.shelfs.Kallax.boards.bottomTop.width),
      ),
    );

    return [bottom, left, right, top];
  },
};
