import {
  createBuilder,
  cm,
  toCm,
  type JscadObject,
  type Length,
} from "@jscad/builder";
import * as general from "./general";
import * as ikea from "./ikea";
import { materials } from "./materials";
import { group } from "./utils";
import type { State } from "./milas-room.model";

const { cuboid, translate, rotate, colorize } = createBuilder({
  coordinateUnit: "cm",
});

export type Measurements = {
  wall: { thickness: Length };
  room: { width: Length; depth: Length };
};

// ─── Variant: High Bed, 2 PAX, NORDEN Desk & Couch ───────────────────────────

export function highbed2Pax(
  state: State,
  measurements: Measurements,
): JscadObject[] {
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

  const closet1 = translate({ z: cm(10 + paxW) })(
    rotate({ y: Math.PI / 2 }, { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const closet2 = translate({ x: cm(paxW + paxD), z: cm(10 + paxW + paxD) })(
    rotate({ y: Math.PI }, { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const { model: bedModel } = general.Bed({
    guards: { right: cm(0), cutout: "bottom-left" },
    padding: { right: cm(10) },
  });

  const bed = translate({ y: cm(160), z: cm(10 + 2 * paxW) })(
    colorize(materials.Furniture.color)(bedModel),
  );

  const desk = translate({ x: cm(roomW - nordenW), z: cm(roomD - nordenD) })(
    colorize(materials.Furniture.color)(ikea.desks.Nordern(state.desk)),
  );

  const couch = translate({ z: cm(roomD - mD - 2 * armrestSize) })(
    colorize(materials.Furniture.color)(
      group(
        // back rest
        cuboid({ size: { x: cm(armrestSize), y: cm(90), z: cm(mD + 2 * armrestSize) } }),
        translate({ x: cm(armrestSize) })(
          group(
            // left armrest
            cuboid({ size: { x: cm(mW), y: cm(72), z: cm(armrestSize) } }),
            // seat box
            translate({ z: cm(armrestSize) })(
              cuboid({ size: { x: cm(mW), y: cm(45), z: cm(mD) } }),
            ),
            // mattress
            translate({ y: cm(45), z: cm(armrestSize) })(general.mattress),
            // right armrest
            translate({ z: cm(armrestSize + mD) })(
              cuboid({ size: { x: cm(mW), y: cm(72), z: cm(armrestSize) } }),
            ),
          ),
        ),
      ),
    ),
  );

  return [
    translate({ x: cm(wT), y: cm(wT), z: cm(wT) })(
      group(closet1, closet2, bed, couch, desk),
    ),
  ];
}
