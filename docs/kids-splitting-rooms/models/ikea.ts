import { calculateVolume, l } from "@pocs/values";
import { createBuilder, cm, toCm, mm, type JscadObject } from "@jscad/builder";
import * as general from "./general";
import { group } from "./utils";

const { cuboid, translate, rotate } = createBuilder({ coordinateUnit: "cm" });

export const measurements = {
  beds: {
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
    // https://www.ikea.com/de/de/p/besta-schrankkombination-fuer-wandmontage-weiss-lappviken-weiss-s19431858/
    Besta: {
      width: cm(60),
      height: cm(64),
      depth: cm(42),
      storage: calculateVolume(cm(60), cm(64), cm(42)),
    },
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
    // https://www.ikea.com/de/de/p/norden-klapptisch-weiss-10423886/
    Norden: {
      storage: l(6 * calculateVolume(cm(20), cm(25), cm(38)).value),
      height: cm(74),
      depth: cm(80),
      closed: {
        width: cm(29),
      },
      opened: {
        partially: {
          width: cm(89),
        },
        fully: {
          width: cm(152),
        },
      },
      boards: {
        thickness: cm(2),
        width: cm(73),
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

// ─── Brimnes bed pieces ───────────────────────────────────────────────────────

const b = measurements.beds.Brimnes;
const bT = () => toCm(b.boards.thickness).value;

const brimnesBed = {
  back: translate({ x: b.boards.thickness, z: cm(toCm(b.depth).value - bT()) })(
    cuboid({ size: { x: b.boards.back.width, y: b.boards.back.height, z: b.boards.thickness } }),
  ),
  right: cuboid({ size: { x: b.boards.thickness, y: b.boards.side.height, z: b.boards.side.depth } }),
  left: translate({ x: cm(bT() + toCm(b.boards.back.width).value) })(
    cuboid({ size: { x: b.boards.thickness, y: b.boards.side.height, z: b.boards.side.depth } }),
  ),
  front: translate({ x: b.boards.thickness })(
    group(
      // front board
      cuboid({ size: { x: b.boards.front.width, y: b.boards.front.height, z: b.boards.thickness } }),
      // right inner
      cuboid({
        size: {
          x: b.boards.thickness,
          y: cm(toCm(b.boards.front.height).value - 3),
          z: general.measurements.Mattress.width,
        },
      }),
      // left inner
      translate({ x: cm(toCm(b.boards.front.width).value - bT()) })(
        cuboid({
          size: {
            x: b.boards.thickness,
            y: cm(toCm(b.boards.front.height).value - 3),
            z: general.measurements.Mattress.width,
          },
        }),
      ),
    ),
  ),
  drawer: group(
    // front
    cuboid({ size: { x: b.drawer.boards.front.width, y: b.drawer.boards.front.height, z: b.drawer.boards.thickness } }),
    // right
    translate({ z: b.drawer.boards.thickness })(
      cuboid({ size: { x: b.drawer.boards.thickness, y: b.drawer.boards.height, z: b.drawer.boards.side.depth } }),
    ),
    // left
    translate({
      x: cm(toCm(b.drawer.boards.front.width).value - toCm(b.drawer.boards.thickness).value),
      z: b.drawer.boards.thickness,
    })(
      cuboid({ size: { x: b.drawer.boards.thickness, y: b.drawer.boards.height, z: b.drawer.boards.side.depth } }),
    ),
    // bottom
    translate({ z: b.drawer.boards.thickness })(
      cuboid({ size: { x: b.drawer.boards.front.width, y: b.drawer.boards.thickness, z: b.drawer.boards.side.depth } }),
    ),
  ),
};

export const beds = {
  Brimnes: (state: {
    drawers: "closed" | "opened";
    variant: "single" | "double";
  }): JscadObject => {
    const mW = toCm(general.measurements.Mattress.width).value;
    const mH = toCm(general.measurements.Mattress.height).value;
    const frontBoardH = toCm(b.boards.front.height).value;
    const boardT = bT();
    const frontW = toCm(b.boards.front.width).value;
    const drawerFrontW = toCm(b.drawer.boards.front.width).value;

    const frontDepthCorrection =
      state.variant === "double" ? -mW : 0;

    const frame = group(
      brimnesBed.back,
      brimnesBed.right,
      brimnesBed.left,
      translate({ z: cm(frontDepthCorrection) })(brimnesBed.front),
    );

    const drawerGap =
      (frontW - 2 * drawerFrontW) / 3;

    const drawerDepthCorrection =
      state.drawers === "opened" ? -50 : 0;

    const drawers = translate({
      x: cm(drawerGap),
      y: cm(drawerGap),
      z: cm(frontDepthCorrection + drawerDepthCorrection),
    })(
      group(
        brimnesBed.drawer,
        translate({ x: cm(drawerFrontW + drawerGap) })(brimnesBed.drawer),
      ),
    );

    const mattressBase = {
      x: boardT,
      y: frontBoardH - 3,
      z: boardT + mW,
    };

    const mattresses =
      state.variant === "double"
        ? // Two mattresses side-by-side (rotated 90° around Y at corner)
          translate({ x: cm(mattressBase.x), y: cm(mattressBase.y), z: cm(mattressBase.z) })(
            rotate({ y: Math.PI / 2 }, { around: "corner" })(
              group(
                general.mattress,
                translate({ x: cm(mW) })(general.mattress),
              ),
            ),
          )
        : // Single mattress + pillow offset
          translate({ x: cm(mattressBase.x), y: cm(mattressBase.y), z: cm(mattressBase.z) })(
            rotate({ y: Math.PI / 2 }, { around: "corner" })(
              group(
                general.mattress,
                translate({ y: cm(mH) })(general.mattress),
              ),
            ),
          );

    return group(frame, drawers, mattresses);
  },
};

export const cabinets = {
  Besta: (): JscadObject => {
    const p = measurements.cabinets.Besta;
    return cuboid({ size: { x: p.depth, y: p.height, z: p.width } });
  },

  Pax: (state: { variant: "closed" | "opened" }): JscadObject => {
    const p = measurements.cabinets.Pax;
    const pT = toCm(p.boards.thickness).value;
    const sideH = toCm(p.boards.side.height).value;
    const sideD = toCm(p.boards.side.depth).value;
    const backW = toCm(p.boards.back.width).value;
    const btW = toCm(p.boards.bottomTop.width).value;
    const doorW = toCm(p.boards.door.width).value;
    const doorH = toCm(p.boards.door.height).value;

    const corpus = group(
      // back
      cuboid({ size: { x: p.boards.back.width, y: p.boards.back.height, z: p.boards.back.thickness } }),
      // right
      translate({ y: p.boards.thickness })(
        cuboid({ size: { x: p.boards.thickness, y: p.boards.side.height, z: p.boards.side.depth } }),
      ),
      // left
      translate({ x: cm(backW - pT), y: p.boards.thickness })(
        cuboid({ size: { x: p.boards.thickness, y: p.boards.side.height, z: p.boards.side.depth } }),
      ),
      // bottom
      cuboid({ size: { x: p.boards.bottomTop.width, y: p.boards.thickness, z: p.boards.bottomTop.depth } }),
      // top
      translate({ y: cm(sideH + pT) })(
        cuboid({ size: { x: p.boards.bottomTop.width, y: p.boards.thickness, z: p.boards.bottomTop.depth } }),
      ),
    );

    const doorBox = cuboid({ size: { x: p.boards.door.width, y: p.boards.door.height, z: p.boards.thickness } });

    const rightDoor = translate({
      x: cm(doorW + (state.variant === "opened" ? doorW : 0)),
    })(
      rotate({ y: state.variant === "opened" ? -Math.PI / 2 : 0 }, { around: "corner" })(
        doorBox,
      ),
    );

    const leftDoor = translate({
      x: cm(state.variant === "opened" ? pT : 0),
    })(
      rotate({ y: state.variant === "opened" ? -Math.PI / 2 : 0 }, { around: "corner" })(
        doorBox,
      ),
    );

    const doors = translate({
      x: cm(0),
      y: cm(2 * pT + sideH - doorH),
      z: cm(sideD),
    })(group(leftDoor, rightDoor));

    return group(corpus, doors);
  },
};

export const desks = {
  Billy: (state: { variant: "closed" | "partially" | "fully" }): JscadObject => {
    const d = measurements.desks.Billy;
    const bdsT = toCm(d.boards.thickness).value;
    const outerSideH = toCm(d.boards.outer.side.height).value;
    const outerShelfW = toCm(d.boards.outer.shelf.width).value;
    const innerSideH = toCm(d.boards.inner.side.height).value;
    const innerShelfW = toCm(d.boards.inner.shelf.width).value;
    const innerFromTop = toCm(d.boards.inner.shelf.fromTop).value;
    const innerFromBot = toCm(d.boards.inner.shelf.fromBottom).value;
    const deskDepth = toCm(d.boards.desk.depth).value;

    const outer = group(
      // right
      cuboid({ size: { x: d.boards.thickness, y: d.boards.outer.side.height, z: d.boards.outer.side.depth } }),
      // left
      translate({ x: cm(outerShelfW + bdsT) })(
        cuboid({ size: { x: d.boards.thickness, y: d.boards.outer.side.height, z: d.boards.outer.side.depth } }),
      ),
      // top
      translate({ x: d.boards.thickness, y: cm(outerSideH - bdsT) })(
        cuboid({ size: { x: d.boards.outer.shelf.width, y: d.boards.thickness, z: d.boards.outer.shelf.depth } }),
      ),
      // shelf
      translate({ x: d.boards.thickness, y: cm(outerSideH - bdsT - toCm(d.boards.outer.shelf.fromTop).value) })(
        cuboid({ size: { x: d.boards.outer.shelf.width, y: d.boards.thickness, z: d.boards.outer.shelf.depth } }),
      ),
    );

    const innerZOffset =
      state.variant === "fully" || state.variant === "partially" ? deskDepth : 0;

    const inner = translate({ x: d.boards.thickness, z: cm(innerZOffset) })(
      group(
        // back
        cuboid({ size: { x: d.boards.inner.back.width, y: d.boards.inner.back.height, z: d.boards.inner.back.thickness } }),
        // right
        cuboid({ size: { x: d.boards.thickness, y: d.boards.inner.side.height, z: d.boards.inner.side.depth } }),
        // left
        translate({ x: cm(innerShelfW + bdsT) })(
          cuboid({ size: { x: d.boards.thickness, y: d.boards.inner.side.height, z: d.boards.inner.side.depth } }),
        ),
        // top
        translate({ y: cm(innerSideH) })(
          cuboid({ size: { x: d.boards.inner.top.width, y: d.boards.thickness, z: d.boards.inner.top.depth } }),
        ),
        // shelf top
        translate({ x: d.boards.thickness, y: cm(innerSideH - bdsT - innerFromTop) })(
          cuboid({ size: { x: d.boards.inner.shelf.width, y: d.boards.thickness, z: d.boards.inner.shelf.depth } }),
        ),
        // shelf bottom
        translate({ x: d.boards.thickness, y: cm(innerFromBot) })(
          cuboid({ size: { x: d.boards.inner.shelf.width, y: d.boards.thickness, z: d.boards.inner.shelf.depth } }),
        ),
      ),
    );

    const desk =
      state.variant === "fully" || state.variant === "partially"
        ? [
            translate({ x: d.boards.thickness, y: cm(innerSideH) })(
              cuboid({ size: { x: d.boards.desk.width, y: d.boards.thickness, z: d.boards.desk.depth } }),
            ),
          ]
        : [];

    return group(outer, inner, ...desk);
  },

  Nordern: (state: { variant: "closed" | "partially" | "fully" }): JscadObject => {
    const n = measurements.desks.Norden;
    const closedW = toCm(n.closed.width).value;
    const boardW = toCm(n.boards.width).value;

    const cabinet = cuboid({ size: { x: n.closed.width, y: n.height, z: n.depth } });
    const board = cuboid({ size: { x: n.boards.width, y: n.boards.thickness, z: n.depth } });

    const boards: JscadObject[] = [];
    switch (state.variant) {
      case "partially":
        boards.push(
          translate({
            x: cm(-boardW),
            y: cm(toCm(n.height).value - toCm(n.boards.thickness).value),
          })(board),
        );
        break;
      case "fully":
        boards.push(
          translate({
            x: cm(-boardW),
            y: cm(toCm(n.height).value - toCm(n.boards.thickness).value),
          })(board),
        );
        boards.push(
          translate({
            x: n.closed.width,
            y: cm(toCm(n.height).value - toCm(n.boards.thickness).value),
          })(board),
        );
        break;
    }

    const deskGroup = group(cabinet, ...boards);

    const zOffset =
      state.variant === "fully"
        ? -closedW
        : boardW - closedW;

    return translate({ x: n.closed.width, z: cm(zOffset) })(
      rotate({ y: -Math.PI / 2 }, { around: "corner" })(deskGroup),
    );
  },
};

export const shelfs = {
  Billy: (): JscadObject => {
    const s = measurements.shelfs.Billy;
    const sT = toCm(s.boards.thickness).value;
    const backW = toCm(s.boards.back.width).value;
    const sideH = toCm(s.boards.side.height).value;

    return group(
      // back
      cuboid({ size: { x: s.boards.back.width, y: s.boards.back.height, z: s.boards.back.thickness } }),
      // right
      cuboid({ size: { x: s.boards.thickness, y: s.boards.side.height, z: s.boards.side.depth } }),
      // left
      translate({ x: cm(backW - sT) })(
        cuboid({ size: { x: s.boards.thickness, y: s.boards.side.height, z: s.boards.side.depth } }),
      ),
      // bottom shelf
      translate({ x: s.boards.thickness, y: cm(5) })(
        cuboid({ size: { x: s.boards.shelf.width, y: s.boards.thickness, z: s.boards.shelf.depth } }),
      ),
      // mid shelf
      translate({ x: s.boards.thickness, y: cm(38) })(
        cuboid({ size: { x: s.boards.shelf.width, y: s.boards.thickness, z: s.boards.shelf.depth } }),
      ),
      // upper shelf
      translate({ x: s.boards.thickness, y: cm(72) })(
        cuboid({ size: { x: s.boards.shelf.width, y: s.boards.thickness, z: s.boards.shelf.depth } }),
      ),
      // top
      translate({ x: s.boards.thickness, y: cm(sideH - sT) })(
        cuboid({ size: { x: s.boards.shelf.width, y: s.boards.thickness, z: s.boards.shelf.depth } }),
      ),
    );
  },

  Kallax: (
    { rows = 1, columns = 1 }: { rows?: number; columns?: number } = {},
  ): JscadObject => {
    const k = measurements.shelfs.Kallax;
    const kT = toCm(k.boards.thickness).value;
    const sideH = toCm(k.boards.side.height).value;
    const btW = toCm(k.boards.bottomTop.width).value;
    const kH = toCm(k.height).value;
    const kD = toCm(k.depth).value;

    const bottom = cuboid({ size: { x: k.boards.bottomTop.depth, y: k.boards.thickness, z: k.boards.bottomTop.width } });
    const left = translate({ y: k.boards.thickness })(
      cuboid({ size: { x: k.boards.side.depth, y: k.boards.side.height, z: k.boards.thickness } }),
    );
    const right = translate({ y: k.boards.thickness, z: cm(btW - kT) })(
      cuboid({ size: { x: k.boards.side.depth, y: k.boards.side.height, z: k.boards.thickness } }),
    );
    const top = translate({ y: cm(kT + sideH) })(
      cuboid({ size: { x: k.boards.bottomTop.depth, y: k.boards.thickness, z: k.boards.bottomTop.width } }),
    );

    const kallax = group(bottom, left, right, top);

    const cells: JscadObject[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        cells.push(translate({ y: cm(r * kH), z: cm(c * kD) })(kallax));
      }
    }

    return group(...cells);
  },
};
