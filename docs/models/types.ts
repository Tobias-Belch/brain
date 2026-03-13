import type { Length } from "@fea-lib/jscad";

export type Dimensions = Record<
  | "space"
  | "heatingControl"
  | "bestaBottom"
  | "bestaTop"
  | "gapShelfBottom"
  | "gapShelfTop"
  | "nordli",
  {
    width: Length;
    height: Length;
    depth: Length;
  }
> & {
  benchBoard: {
    width: Length;
    depth: Length;
    thickness: Length;
  };
  wallMount: {
    width: Length;
    thickness: Length;
  };
  bottomRail: {
    thickness: Length;
  };
  wallMountExtension: {
    height: Length;
    thickness: Length;
  };
  valance: {
    thickness: Length;
  };
};

export type CalculatedDimensions = Record<
  keyof Dimensions,
  {
    width: Length;
    height: Length;
    depth: Length;
  }
>;
