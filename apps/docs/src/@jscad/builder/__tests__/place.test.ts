import { describe, it, expect } from "vitest";
import { createBuilder } from "../factory";
import { cm } from "../measure";

const { cuboid, translate, place } = createBuilder({ coordinateUnit: "cm" });

describe("place()", () => {
  // A reference object sitting at [10, 0, 20] → [60, 100, 50]
  const ref = translate([10, 0, 20])(cuboid({ size: [50, 100, 30] }));

  describe("at: absolute positioning", () => {
    it("places object min corner at the given position", () => {
      const obj = cuboid({ size: [20, 20, 20] });
      const placed = place({ at: [cm(5), cm(10), cm(15)] })(obj);

      expect(placed.bounds.min[0]).toBeCloseTo(5);
      expect(placed.bounds.min[1]).toBeCloseTo(10);
      expect(placed.bounds.min[2]).toBeCloseTo(15);
    });

    it("null axis values leave that axis unchanged", () => {
      const obj = translate([5, 5, 5])(cuboid({ size: [20, 20, 20] }));
      const placed = place({ at: [cm(99), null, null] })(obj);

      expect(placed.bounds.min[0]).toBeCloseTo(99);
      expect(placed.bounds.min[1]).toBeCloseTo(5); // unchanged
      expect(placed.bounds.min[2]).toBeCloseTo(5); // unchanged
    });
  });

  describe("after: Z+ relative", () => {
    it("places object flush at ref.max[2]", () => {
      const obj = cuboid({ size: [20, 20, 10] });
      const placed = place({ after: ref })(obj);

      expect(placed.bounds.min[2]).toBeCloseTo(ref.bounds.max[2]);
      expect(placed.bounds.max[2]).toBeCloseTo(ref.bounds.max[2] + 10);
    });

    it("respects gap", () => {
      const obj = cuboid({ size: [20, 20, 10] });
      const placed = place({ after: ref, gap: cm(5) })(obj);

      expect(placed.bounds.min[2]).toBeCloseTo(ref.bounds.max[2] + 5);
    });
  });

  describe("before: Z- relative", () => {
    it("places object immediately before ref", () => {
      const obj = cuboid({ size: [20, 20, 10] });
      const placed = place({ before: ref })(obj);

      expect(placed.bounds.max[2]).toBeCloseTo(ref.bounds.min[2]);
    });

    it("respects gap", () => {
      const obj = cuboid({ size: [20, 20, 10] });
      const placed = place({ before: ref, gap: cm(3) })(obj);

      expect(placed.bounds.max[2]).toBeCloseTo(ref.bounds.min[2] - 3);
    });
  });

  describe("above: Y+ relative", () => {
    it("places object immediately above ref", () => {
      const obj = cuboid({ size: [20, 20, 20] });
      const placed = place({ above: ref })(obj);

      expect(placed.bounds.min[1]).toBeCloseTo(ref.bounds.max[1]);
    });

    it("respects gap", () => {
      const obj = cuboid({ size: [20, 20, 20] });
      const placed = place({ above: ref, gap: cm(2) })(obj);

      expect(placed.bounds.min[1]).toBeCloseTo(ref.bounds.max[1] + 2);
    });
  });

  describe("below: Y- relative", () => {
    it("places object immediately below ref", () => {
      const obj = cuboid({ size: [20, 20, 20] });
      const placed = place({ below: ref })(obj);

      expect(placed.bounds.max[1]).toBeCloseTo(ref.bounds.min[1]);
    });
  });

  describe("beside: X+ relative", () => {
    it("places object immediately beside ref", () => {
      const obj = cuboid({ size: [20, 20, 20] });
      const placed = place({ beside: ref })(obj);

      expect(placed.bounds.min[0]).toBeCloseTo(ref.bounds.max[0]);
    });
  });

  describe("leftOf: X- relative", () => {
    it("places object to the left of ref", () => {
      const obj = cuboid({ size: [20, 20, 20] });
      const placed = place({ leftOf: ref })(obj);

      expect(placed.bounds.max[0]).toBeCloseTo(ref.bounds.min[0]);
    });
  });

  describe("align", () => {
    it("align y: 'end' — aligns top edges of obj and ref", () => {
      const obj = cuboid({ size: [20, 50, 20] });
      const placed = place({ after: ref, align: { y: "end" } })(obj);

      expect(placed.bounds.max[1]).toBeCloseTo(ref.bounds.max[1]);
    });

    it("align y: 'center' — centers obj vertically within ref", () => {
      const obj = cuboid({ size: [20, 50, 20] });
      const placed = place({ after: ref, align: { y: "center" } })(obj);

      const objCenter = (placed.bounds.min[1] + placed.bounds.max[1]) / 2;
      const refCenter = (ref.bounds.min[1] + ref.bounds.max[1]) / 2;
      expect(objCenter).toBeCloseTo(refCenter);
    });

    it("align z: 'start' — aligns z fronts with ref when placed above", () => {
      const obj = cuboid({ size: [20, 20, 15] });
      const placed = place({ above: ref, align: { z: "start" } })(obj);

      expect(placed.bounds.min[2]).toBeCloseTo(ref.bounds.min[2]);
    });
  });

  describe("bounds are updated correctly", () => {
    it("placed object bounds match expected extents", () => {
      const obj = cuboid({ size: [cm(20), cm(30), cm(10)] });
      const placed = place({ at: [cm(5), cm(5), cm(5)] })(obj);

      expect(placed.bounds.min).toEqual([5, 5, 5]);
      expect(placed.bounds.max).toEqual([25, 35, 15]);
    });
  });
});
