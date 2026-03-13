import modeling from "@jscad/modeling";
import { materials } from "./materials";
import { move, normaliseUnits } from "./utils";
import type { Length } from "@fea-lib/jscad";

const {
  colors: { colorize },
  primitives: { cylinder },
} = modeling;

export function BassPort({
  depth,
  diameter,
}: {
  diameter: Length;
  depth: Length;
}) {
  const normalised = {
    depth: normaliseUnits(depth),
    diameter: normaliseUnits(diameter),
  };

  return colorize(
    [...materials.Hole.color, 1],
    cylinder({
      height: normalised.depth,
      radius: normalised.diameter / 2,
      segments: 32,
    }),
  );
}
