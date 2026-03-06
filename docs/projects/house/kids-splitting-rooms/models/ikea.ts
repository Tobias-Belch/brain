import modeling from "@jscad/modeling";
import { cm, mm } from "@pocs/values";
import { box, normalize } from "./utils";

const {
  booleans: { union, subtract },
  transforms: { translate },
} = modeling;

export const measurements = {
  beds: {
    Mattress: {
      width: cm(80),
      height: cm(10),
      depth: cm(200),
    },
    Brimnes: {
      boards: {
        thickness: mm(16),
        side: {
          height: cm(58),
          depth: cm(87),
        },
        back: {
          width: cm(205 - 2 * 1.6),
          height: cm(58),
        },
        front: {
          width: cm(205 - 2 * 1.6),
          height: cm(42),
        },
      },
      closed: {
        width: cm(205),
        height: cm(58),
        depth: cm(87),
      },
      storage: {},
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
      normalize(measurements.beds.Brimnes.closed.depth) -
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
};

export const beds = {
  Brimnes: ({ variant }: { variant: "single" | "double" }) => {
    const box =
      variant === "double"
        ? [
            brimnesBed.back,
            brimnesBed.right,
            brimnesBed.left,
            translate(
              [0, 0, -normalize(measurements.beds.Mattress.width)],
              brimnesBed.front,
            ),
          ]
        : [
            brimnesBed.back,
            brimnesBed.right,
            brimnesBed.left,
            brimnesBed.front,
          ];

    const mattresses =
      variant === "double"
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

    return [...box, ...mattresses];
  },
};
