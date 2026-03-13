import {
  createBuilder,
  cm,
  type JscadObject,
  type Length,
} from "@fea-lib/jscad";
import * as ikea from "./ikea";
import { materials } from "./materials";
import { group } from "./utils";
import type { State } from "./milas-room.model";

const { cuboid, translate, rotate, colorize } = createBuilder({
  coordinateUnit: "cm",
});

export type Measurements = {
  wall: { thickness: Length };
  room: { depth: Length };
};

// ─── Variant: BRIMNES Bed, BILLY Desk & 1 PAX ────────────────────────────────

export function brimnesBillyPax(
  state: State,
  measurements: Measurements,
): JscadObject[] {
  const wT = cm(measurements.wall.thickness).value;
  const paxW = cm(ikea.measurements.cabinets.Pax.width).value;
  const paxH = cm(ikea.measurements.cabinets.Pax.height).value;
  const billyDeskW = cm(ikea.measurements.desks.Billy.width).value;
  const billyShelfH = cm(ikea.measurements.shelfs.Billy.height).value;
  const bestaH = cm(ikea.measurements.cabinets.Besta.height).value;
  const bestaW = cm(ikea.measurements.cabinets.Besta.width).value;
  const brimnesD = cm(ikea.measurements.beds.Brimnes.depth).value;
  const roomD = cm(measurements.room.depth).value;

  const closet = translate({ x: cm(wT), y: cm(wT), z: cm(wT + 8 + paxW) })(
    rotate({ y: Math.PI / 2 }, { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const desk = translate({ x: cm(wT), y: cm(wT), z: cm(wT + 8 + paxW + 3 + billyDeskW) })(
    rotate({ y: Math.PI / 2 }, { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.desks.Billy(state.desk)),
    ),
  );

  const shelfOverDesk = translate({
    x: cm(wT),
    y: cm(wT + paxH - billyShelfH),
    z: cm(wT + 8 + paxW + 3 + billyDeskW),
  })(
    rotate({ y: Math.PI / 2 }, { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.shelfs.Billy()),
    ),
  );

  const cabinets = translate({
    x: cm(wT),
    y: cm(wT + paxH - bestaH),
    z: cm(wT + 8 + paxW + 3 + billyDeskW),
  })(
    colorize(materials.Furniture.color)(
      group(
        ikea.cabinets.Besta(),
        translate({ z: cm(bestaW) })(ikea.cabinets.Besta()),
        translate({ z: cm(2 * bestaW) })(ikea.cabinets.Besta()),
        translate({ z: cm(3 * bestaW) })(ikea.cabinets.Besta()),
      ),
    ),
  );

  const bed = translate({ x: cm(wT), y: cm(wT), z: cm(wT + roomD - brimnesD - 10) })(
    colorize(materials.Furniture.color)(ikea.beds.Brimnes(state.bed)),
  );

  return [bed, closet, desk, shelfOverDesk, cabinets];
}
