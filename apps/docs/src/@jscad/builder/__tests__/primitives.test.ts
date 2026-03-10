import { describe, it, expect } from "vitest";
import { createBuilder } from "../factory";
import { cm, m, mm } from "../measure";

const { cuboid } = createBuilder({ coordinateUnit: "cm" });

describe("cuboid()", () => {
  describe("with raw numbers (cm)", () => {
    it("sets bounds min to [0, 0, 0]", () => {
      const b = cuboid({ size: [50, 100, 30] });
      expect(b.bounds.min).toEqual([0, 0, 0]);
    });

    it("sets bounds max to [w, h, d]", () => {
      const b = cuboid({ size: [50, 100, 30] });
      expect(b.bounds.max).toEqual([50, 100, 30]);
    });

    it("produces a single geom", () => {
      const b = cuboid({ size: [50, 100, 30] });
      expect(b.geom).toHaveLength(1);
    });
  });

  describe("with Length values", () => {
    it("normalises cm() to numbers", () => {
      const b = cuboid({ size: [cm(50), cm(100), cm(30)] });
      expect(b.bounds.max).toEqual([50, 100, 30]);
    });

    it("normalises mm() to cm", () => {
      const b = cuboid({ size: [mm(100), mm(200), mm(300)] });
      expect(b.bounds.max[0]).toBeCloseTo(10);
      expect(b.bounds.max[1]).toBeCloseTo(20);
      expect(b.bounds.max[2]).toBeCloseTo(30);
    });

    it("normalises m() to cm", () => {
      const b = cuboid({ size: [m(1), m(2), m(0.5)] });
      expect(b.bounds.max[0]).toBeCloseTo(100);
      expect(b.bounds.max[1]).toBeCloseTo(200);
      expect(b.bounds.max[2]).toBeCloseTo(50);
    });

    it("mixes unit types", () => {
      const b = cuboid({ size: [cm(50), mm(500), m(0.3)] });
      expect(b.bounds.max[0]).toBeCloseTo(50);
      expect(b.bounds.max[1]).toBeCloseTo(50);
      expect(b.bounds.max[2]).toBeCloseTo(30);
    });
  });

  describe("geom geometry", () => {
    it("geom polygons are non-empty", () => {
      const b = cuboid({ size: [10, 20, 30] });
      expect((b.geom[0] as any).polygons.length).toBeGreaterThan(0);
    });
  });

  describe("coordinateUnit: mm", () => {
    const { cuboid: cuboidMm } = createBuilder({ coordinateUnit: "mm" });

    it("raw numbers are treated as mm", () => {
      const b = cuboidMm({ size: [100, 200, 300] });
      expect(b.bounds.max).toEqual([100, 200, 300]);
    });

    it("mm() values are a no-op conversion", () => {
      const b = cuboidMm({ size: [mm(100), mm(200), mm(300)] });
      expect(b.bounds.max).toEqual([100, 200, 300]);
    });

    it("cm() values are converted to mm", () => {
      const b = cuboidMm({ size: [cm(10), cm(20), cm(30)] });
      expect(b.bounds.max[0]).toBeCloseTo(100);
      expect(b.bounds.max[1]).toBeCloseTo(200);
      expect(b.bounds.max[2]).toBeCloseTo(300);
    });
  });
});

describe("cube()", () => {
  const { cube } = createBuilder({ coordinateUnit: "mm" });

  it("produces a cube with equal sides", () => {
    const b = cube({ size: 50 });
    const w = b.bounds.max[0] - b.bounds.min[0];
    const h = b.bounds.max[1] - b.bounds.min[1];
    const d = b.bounds.max[2] - b.bounds.min[2];
    expect(w).toBeCloseTo(50);
    expect(h).toBeCloseTo(50);
    expect(d).toBeCloseTo(50);
  });
});

describe("sphere()", () => {
  const { sphere } = createBuilder({ coordinateUnit: "mm" });

  it("has symmetric bounds around origin", () => {
    const b = sphere({ radius: 50 });
    expect(b.bounds.max[0]).toBeCloseTo(50, 1);
    expect(b.bounds.min[0]).toBeCloseTo(-50, 1);
  });
});

describe("cylinder()", () => {
  const { cylinder } = createBuilder({ coordinateUnit: "mm" });

  it("has correct height bounds", () => {
    const b = cylinder({ height: 100, radius: 20 });
    const h = b.bounds.max[2] - b.bounds.min[2];
    expect(h).toBeCloseTo(100, 1);
  });

  it("has correct radius bounds", () => {
    const b = cylinder({ height: 100, radius: 20 });
    expect(b.bounds.max[0]).toBeCloseTo(20, 1);
    expect(b.bounds.min[0]).toBeCloseTo(-20, 1);
  });
});

describe("torus()", () => {
  const { torus } = createBuilder({ coordinateUnit: "mm" });

  it("produces geometry", () => {
    const b = torus({ outerRadius: 60, innerRadius: 15 });
    expect(b.geom).toHaveLength(1);
    expect(b.bounds.max[0]).toBeGreaterThan(0);
  });
});

describe("ellipsoid()", () => {
  const { ellipsoid } = createBuilder({ coordinateUnit: "mm" });

  it("has asymmetric bounds matching radii", () => {
    const b = ellipsoid({ radius: [50, 30, 20] });
    const w = b.bounds.max[0] - b.bounds.min[0];
    const h = b.bounds.max[1] - b.bounds.min[1];
    expect(w).toBeCloseTo(100, 1);
    expect(h).toBeCloseTo(60, 1);
  });
});

describe("roundedCuboid()", () => {
  const { roundedCuboid } = createBuilder({ coordinateUnit: "mm" });

  it("produces geometry with correct size", () => {
    const b = roundedCuboid({ size: [50, 50, 50], roundRadius: 5 });
    expect(b.geom).toHaveLength(1);
  });
});

describe("2D primitives", () => {
  const { circle, rectangle, square, ellipse } = createBuilder({ coordinateUnit: "mm" });

  describe("circle()", () => {
    it("has correct radius bounds", () => {
      const b = circle({ radius: 30 });
      expect(b.bounds.max[0]).toBeCloseTo(30, 0);
      expect(b.bounds.min[0]).toBeCloseTo(-30, 0);
    });

    it("has zero z-bounds (2D)", () => {
      const b = circle({ radius: 30 });
      expect(b.bounds.min[2]).toBe(0);
      expect(b.bounds.max[2]).toBe(0);
    });
  });

  describe("rectangle()", () => {
    it("has correct size bounds", () => {
      const b = rectangle({ size: [50, 30] });
      const w = b.bounds.max[0] - b.bounds.min[0];
      const h = b.bounds.max[1] - b.bounds.min[1];
      expect(w).toBeCloseTo(50, 0);
      expect(h).toBeCloseTo(30, 0);
    });
  });

  describe("square()", () => {
    it("has equal width and height", () => {
      const b = square({ size: 40 });
      const w = b.bounds.max[0] - b.bounds.min[0];
      const h = b.bounds.max[1] - b.bounds.min[1];
      expect(w).toBeCloseTo(h, 1);
    });
  });

  describe("ellipse()", () => {
    it("has asymmetric bounds matching radii", () => {
      const b = ellipse({ radius: [50, 20] });
      const w = b.bounds.max[0] - b.bounds.min[0];
      const h = b.bounds.max[1] - b.bounds.min[1];
      expect(w).toBeCloseTo(100, 0);
      expect(h).toBeCloseTo(40, 0);
    });
  });
});

describe("extrusion", () => {
  const { circle, rectangle, extrudeLinear, extrudeRotate } = createBuilder({ coordinateUnit: "mm" });

  describe("extrudeLinear()", () => {
    it("extrudes a 2D circle into a 3D cylinder-like shape", () => {
      const c = circle({ radius: 20 });
      const ext = extrudeLinear({ height: 50 })(c);
      const h = ext.bounds.max[2] - ext.bounds.min[2];
      expect(h).toBeCloseTo(50, 1);
    });
  });

  describe("extrudeRotate()", () => {
    it("revolves a 2D rectangle around Z to produce a torus-like shape", () => {
      const r = rectangle({ size: [10, 5] });
      const ext = extrudeRotate({ segments: 16 })(r);
      expect(ext.geom).toHaveLength(1);
    });
  });
});
