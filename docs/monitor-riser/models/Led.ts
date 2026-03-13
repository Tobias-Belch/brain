import modeling from "@jscad/modeling";
import { materials } from "./materials";
import { mm, type Length } from "@fea-lib/jscad";
import { normaliseUnits } from "./utils";

const {
  colors: { colorize },
  booleans: { union },
  primitives: { cylinder, sphere },
  transforms: { translate },
} = modeling;

export function Led({ diameter = mm(5) }: { diameter?: Length } = {}) {
  const normalisedDiameter = normaliseUnits(diameter);
  const radius = normalisedDiameter / 2;

  const led = colorize(
    [...materials.Led.color, 1],
    union(
      cylinder({
        height: normalisedDiameter,
        radius: radius,
        segments: 32,
      }),
      translate(
        [0, 0, radius],
        sphere({
          radius,
          segments: 32,
        }),
      ),
    ),
  );

  return led;
}
