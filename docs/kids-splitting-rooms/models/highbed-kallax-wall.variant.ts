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

// ─── Variant: High Bed, 2 PAX, Desk & KALLAX Wall ────────────────────────────

export function highbedKallaxWall(
  state: State,
  measurements: Measurements,
): JscadObject[] {
  const wT = cm(measurements.wall.thickness).value;
  const roomW = cm(measurements.room.width).value;
  const roomD = cm(measurements.room.depth).value;
  const paxW = cm(ikea.measurements.cabinets.Pax.width).value;

  const closet = translate({ z: cm(10 + paxW) })(
    rotate({ y: Math.PI / 2 }, { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const cabinet = translate({ z: cm(10 + 2 * paxW) })(
    rotate({ y: Math.PI / 2 }, { around: "corner" })(
      colorize(materials.Furniture.color)(ikea.cabinets.Pax(state.cabinet)),
    ),
  );

  const { model: bedModel } = general.Bed({
    guards: { right: cm(0), cutout: "bottom-left" },
    padding: { right: cm(10) },
  });

  const bed = translate({ y: cm(180), z: cm(10 + 2 * paxW) })(
    colorize(materials.Furniture.color)(bedModel),
  );

  const pieces: JscadObject[] = [closet, cabinet, bed];

  if (state.bed.variant === "double") {
    const mW = cm(general.measurements.Mattress.width).value;
    pieces.push(
      translate({ x: cm(roomW - mW), z: cm(2 * paxW) })(
        colorize(materials.Furniture.color)(general.mattress),
      ),
    );
  }

  const desk = translate({ x: cm(roomW - 200), y: cm(70), z: cm(roomD - 60) })(
    colorize(materials.Furniture.color)(
      cuboid({ size: { x: cm(200), y: cm(5), z: cm(60) } }),
    ),
  );

  const kallaxWall = translate({ z: cm(10 + 2 * paxW) })(
    colorize(materials.Furniture.color)(
      ikea.shelfs.Kallax({ rows: 4, columns: 5 }),
    ),
  );

  pieces.push(desk, kallaxWall);

  return [translate({ x: cm(wT), y: cm(wT), z: cm(wT) })(group(...pieces))];
}
