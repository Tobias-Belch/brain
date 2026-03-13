import {
  createBuilder,
  cm,
  type JscadObject,
  type Length,
} from "@fea-lib/jscad";
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

// ─── Variant: High Bed, 1.5 PAX, KALLAX Tower, NORDEN Desk & Couch ───────────

export function highbedCouch(
  state: State,
  measurements: Measurements,
): JscadObject[] {
  const wT = cm(measurements.wall.thickness).value;
  const roomW = cm(measurements.room.width).value;
  const roomD = cm(measurements.room.depth).value;
  const paxW = cm(ikea.measurements.cabinets.Pax.width).value;
  const nordenW = cm(ikea.measurements.desks.Norden.closed.width).value;
  const nordenD = cm(ikea.measurements.desks.Norden.depth).value;
  const kH = cm(ikea.measurements.shelfs.Kallax.height).value;
  const kD = cm(ikea.measurements.shelfs.Kallax.depth).value;
  const mW = cm(general.measurements.Mattress.width).value;
  const mD = cm(general.measurements.Mattress.depth).value;
  const armrestSize = cm(cm(14)).value;

  const closet = translate({ z: cm(10 + paxW) })(
    rotate({ y: Math.PI / 2 }, { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const cabinet = translate({ z: cm(10 + paxW * 1.5) })(
    rotate({ y: Math.PI / 2 }, { around: "corner" })(
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

  const kallaxTower = colorize(materials.Furniture.color)(
    translate({ z: cm(10 + paxW * 1.5) })(
      group(
        ikea.shelfs.Kallax({ rows: 2, columns: 1 }),
        translate({ x: cm(kD) })(
          ikea.shelfs.Kallax({ rows: 2, columns: 1 }),
        ),
        translate({ x: cm(2 * kD), y: cm(2 * kH) })(
          rotate({ y: -Math.PI / 2 }, { around: "corner" })(
            ikea.shelfs.Kallax({ rows: 1, columns: 2 }),
          ),
        ),
        translate({ y: cm(3 * kH) })(
          group(
            ikea.shelfs.Kallax({ rows: 2, columns: 1 }),
            translate({ x: cm(kD) })(
              ikea.shelfs.Kallax({ rows: 2, columns: 1 }),
            ),
          ),
        ),
        translate({ x: cm(2 * kD), y: cm(5 * kH) })(
          rotate({ y: -Math.PI / 2 }, { around: "corner" })(
            ikea.shelfs.Kallax({ rows: 1, columns: 2 }),
          ),
        ),
      ),
    ),
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
      group(closet, cabinet, kallaxTower, bed, couch, desk),
    ),
  ];
}
