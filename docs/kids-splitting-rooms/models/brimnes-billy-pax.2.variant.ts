import {
  createBuilder,
  cm,
  type JscadObject,
  type Length,
  deg,
} from "@jscad/builder";
import * as ikea from "./ikea";
import { materials } from "./materials";
import { group } from "./utils";
import type { State } from "./milas-room.model";

const { translate, rotate, colorize, pipe, place } = createBuilder({
  coordinateUnit: "cm",
});

export type Measurements = {
  wall: { thickness: Length };
  room: { width: Length; depth: Length };
};

// ─── Variant: BRIMNES Bed, BILLY Desk & 1 PAX ────────────────────────────────

export function brimnesBillyPax2(
  state: State,
  measurements: Measurements,
): JscadObject {
  const closet1 = pipe(
    ikea.cabinets.Pax(state.cabinet),
    rotate({ y: deg(90) }, { around: "corner" }),
    place({
      at: { x: 0, z: cm(15) },
    }),
  );

  const closet2 = pipe(
    ikea.cabinets.Pax(state.cabinet),
    rotate({ y: deg(90) }, { around: "corner" }),
    place({ after: closet1 }),
  );

  const bed = pipe(
    ikea.beds.Brimnes(state.bed),
    rotate({ y: deg(-90) }, { around: "corner" }),
    place({ after: closet2 }),
  );

  const cabinet1 = pipe(
    ikea.cabinets.Besta(),
    place({
      at: {
        y: ikea.measurements.cabinets.Pax.height.sub(
          ikea.measurements.cabinets.Besta.height,
        ),
      },
      after: closet2,
    }),
  );

  const cabinet2 = pipe(
    ikea.cabinets.Besta(),
    place({
      at: {
        y: ikea.measurements.cabinets.Pax.height.sub(
          ikea.measurements.cabinets.Besta.height,
        ),
      },
      after: cabinet1,
    }),
  );

  const cabinet3 = pipe(
    ikea.cabinets.Besta(),
    place({
      at: {
        y: ikea.measurements.cabinets.Pax.height.sub(
          ikea.measurements.cabinets.Besta.height,
        ),
      },
      after: cabinet2,
    }),
  );

  const desk = pipe(
    ikea.desks.Billy(state.desk),
    rotate({ y: deg(-90) }, { around: "corner" }),
    translate({
      x: measurements.room.width,
      z: measurements.room.depth
        .sub(ikea.measurements.desks.Billy.width)
        .sub(cm(15)),
    }),
  );

  return pipe(
    group(closet1, closet2, bed, cabinet1, cabinet2, cabinet3, desk),
    translate({
      x: measurements.wall.thickness,
      y: measurements.wall.thickness,
      z: measurements.wall.thickness,
    }),
    colorize(materials.Furniture.color),
  );
}
