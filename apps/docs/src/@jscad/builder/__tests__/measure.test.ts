import { describe, it, expect } from "vitest";
import {
  μm,
  mm,
  cm,
  m,
  km,
  inch,
  ft,
  yd,
  mile,
  deg,
  rad,
  isMeasure,
  isLength,
  isAngle,
  toμm,
  toMm,
  toCm,
  toM,
  toKm,
  toInch,
  toFt,
  toYd,
  toMile,
  toRad,
  toDeg,
} from "../measure";

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

describe("unit constructors", () => {
  it("μm() stores value and unit", () => {
    const v = μm(500);
    expect(v.value).toBe(500);
    expect(v.unit).toBe(" μm");
  });

  it("mm() stores value and unit", () => {
    const v = mm(25);
    expect(v.value).toBe(25);
    expect(v.unit).toBe(" mm");
  });

  it("cm() stores value and unit", () => {
    const v = cm(10);
    expect(v.value).toBe(10);
    expect(v.unit).toBe(" cm");
  });

  it("m() stores value and unit", () => {
    const v = m(1.5);
    expect(v.value).toBe(1.5);
    expect(v.unit).toBe(" m");
  });

  it("km() stores value and unit", () => {
    const v = km(2);
    expect(v.value).toBe(2);
    expect(v.unit).toBe(" km");
  });

  it("inch() stores value and unit", () => {
    const v = inch(12);
    expect(v.value).toBe(12);
    expect(v.unit).toBe('"');
  });

  it("ft() stores value and unit", () => {
    const v = ft(6);
    expect(v.value).toBe(6);
    expect(v.unit).toBe(" ft");
  });

  it("yd() stores value and unit", () => {
    const v = yd(2);
    expect(v.value).toBe(2);
    expect(v.unit).toBe(" yd");
  });

  it("mile() stores value and unit", () => {
    const v = mile(1);
    expect(v.value).toBe(1);
    expect(v.unit).toBe(" mi");
  });

  it("deg() stores value and unit", () => {
    const v = deg(90);
    expect(v.value).toBe(90);
    expect(v.unit).toBe("°");
  });

  it("rad() stores value and unit", () => {
    const v = rad(Math.PI);
    expect(v.value).toBeCloseTo(Math.PI);
    expect(v.unit).toBe(" rad");
  });

  it("toString() formats correctly", () => {
    expect(cm(42).toString()).toBe("42 cm");
    expect(mm(10).toString()).toBe("10 mm");
    expect(ft(6).toString()).toBe("6 ft");
    expect(deg(90).toString()).toBe("90°");
  });
});

// ---------------------------------------------------------------------------
// Length converters — toMm
// ---------------------------------------------------------------------------

describe("toMm()", () => {
  it("μm → mm", () => expect(toMm(μm(1000)).value).toBeCloseTo(1));
  it("cm → mm", () => expect(toMm(cm(1)).value).toBeCloseTo(10));
  it("m → mm",  () => expect(toMm(m(1)).value).toBeCloseTo(1000));
  it("km → mm", () => expect(toMm(km(1)).value).toBeCloseTo(1_000_000));
  it("inch → mm", () => expect(toMm(inch(1)).value).toBeCloseTo(25.4));
  it("ft → mm",   () => expect(toMm(ft(1)).value).toBeCloseTo(304.8));
  it("mile → mm", () => expect(toMm(mile(1)).value).toBeCloseTo(1_609_344));
  it("mm → mm (identity)", () => expect(toMm(mm(50)).value).toBe(50));
});

// ---------------------------------------------------------------------------
// Length converters — toCm
// ---------------------------------------------------------------------------

describe("toCm()", () => {
  it("μm → cm", () => expect(toCm(μm(10000)).value).toBeCloseTo(1));
  it("mm → cm", () => expect(toCm(mm(100)).value).toBeCloseTo(10));
  it("m → cm",  () => expect(toCm(m(1)).value).toBeCloseTo(100));
  it("km → cm", () => expect(toCm(km(1)).value).toBeCloseTo(100_000));
  it("inch → cm", () => expect(toCm(inch(1)).value).toBeCloseTo(2.54));
  it("ft → cm",   () => expect(toCm(ft(1)).value).toBeCloseTo(30.48));
  it("mile → cm", () => expect(toCm(mile(1)).value).toBeCloseTo(160_934.4));
  it("cm → cm (identity)", () => expect(toCm(cm(50)).value).toBe(50));
});

// ---------------------------------------------------------------------------
// Length converters — toM
// ---------------------------------------------------------------------------

describe("toM()", () => {
  it("μm → m", () => expect(toM(μm(1_000_000)).value).toBeCloseTo(1));
  it("mm → m", () => expect(toM(mm(1000)).value).toBeCloseTo(1));
  it("cm → m", () => expect(toM(cm(100)).value).toBeCloseTo(1));
  it("km → m", () => expect(toM(km(1)).value).toBeCloseTo(1000));
  it("inch → m", () => expect(toM(inch(1)).value).toBeCloseTo(0.0254));
  it("ft → m",   () => expect(toM(ft(1)).value).toBeCloseTo(0.3048));
  it("mile → m", () => expect(toM(mile(1)).value).toBeCloseTo(1609.344));
  it("m → m (identity)", () => expect(toM(m(2)).value).toBe(2));
});

// ---------------------------------------------------------------------------
// Length converters — toKm
// ---------------------------------------------------------------------------

describe("toKm()", () => {
  it("m → km",   () => expect(toKm(m(1000)).value).toBeCloseTo(1));
  it("mile → km",() => expect(toKm(mile(1)).value).toBeCloseTo(1.609344));
  it("km → km (identity)", () => expect(toKm(km(5)).value).toBe(5));
});

// ---------------------------------------------------------------------------
// Length converters — toμm
// ---------------------------------------------------------------------------

describe("toμm()", () => {
  it("mm → μm", () => expect(toμm(mm(1)).value).toBeCloseTo(1000));
  it("cm → μm", () => expect(toμm(cm(1)).value).toBeCloseTo(10_000));
  it("μm → μm (identity)", () => expect(toμm(μm(500)).value).toBe(500));
});

// ---------------------------------------------------------------------------
// Length converters — toInch
// ---------------------------------------------------------------------------

describe("toInch()", () => {
  it("cm → inch", () => expect(toInch(cm(2.54)).value).toBeCloseTo(1));
  it("mm → inch", () => expect(toInch(mm(25.4)).value).toBeCloseTo(1));
  it("m → inch",  () => expect(toInch(m(0.0254)).value).toBeCloseTo(1));
  it("ft → inch", () => expect(toInch(ft(1)).value).toBeCloseTo(12));
  it("yd → inch", () => expect(toInch(yd(1)).value).toBeCloseTo(36));
  it("inch → inch (identity)", () => expect(toInch(inch(6)).value).toBe(6));
});

// ---------------------------------------------------------------------------
// Length converters — toFt
// ---------------------------------------------------------------------------

describe("toFt()", () => {
  it("inch → ft", () => expect(toFt(inch(12)).value).toBeCloseTo(1));
  it("m → ft",    () => expect(toFt(m(1)).value).toBeCloseTo(3.28084, 4));
  it("yd → ft",   () => expect(toFt(yd(1)).value).toBeCloseTo(3));
  it("ft → ft (identity)", () => expect(toFt(ft(3)).value).toBe(3));
});

// ---------------------------------------------------------------------------
// Length converters — toYd
// ---------------------------------------------------------------------------

describe("toYd()", () => {
  it("ft → yd",   () => expect(toYd(ft(3)).value).toBeCloseTo(1));
  it("m → yd",    () => expect(toYd(m(0.9144)).value).toBeCloseTo(1));
  it("inch → yd", () => expect(toYd(inch(36)).value).toBeCloseTo(1));
  it("mile → yd", () => expect(toYd(mile(1)).value).toBeCloseTo(1760));
  it("yd → yd (identity)", () => expect(toYd(yd(5)).value).toBe(5));
});

// ---------------------------------------------------------------------------
// Length converters — toMile
// ---------------------------------------------------------------------------

describe("toMile()", () => {
  it("ft → mile",  () => expect(toMile(ft(5280)).value).toBeCloseTo(1));
  it("yd → mile",  () => expect(toMile(yd(1760)).value).toBeCloseTo(1));
  it("km → mile",  () => expect(toMile(km(1.609344)).value).toBeCloseTo(1));
  it("mile → mile (identity)", () => expect(toMile(mile(2)).value).toBe(2));
});

// ---------------------------------------------------------------------------
// Angle converters
// ---------------------------------------------------------------------------

describe("toRad()", () => {
  it("deg → rad", () => expect(toRad(deg(180)).value).toBeCloseTo(Math.PI));
  it("deg(90) → π/2", () => expect(toRad(deg(90)).value).toBeCloseTo(Math.PI / 2));
  it("rad → rad (identity)", () => expect(toRad(rad(Math.PI)).value).toBeCloseTo(Math.PI));
});

describe("toDeg()", () => {
  it("rad → deg", () => expect(toDeg(rad(Math.PI)).value).toBeCloseTo(180));
  it("deg → deg (identity)", () => expect(toDeg(deg(45)).value).toBeCloseTo(45));
});

// ---------------------------------------------------------------------------
// Roundtrip conversions
// ---------------------------------------------------------------------------

describe("roundtrip conversions", () => {
  it("cm → mm → cm", () => {
    expect(toCm(toMm(cm(42))).value).toBeCloseTo(42);
  });

  it("m → cm → m", () => {
    expect(toM(toCm(m(2.13))).value).toBeCloseTo(2.13);
  });

  it("ft → inch → ft", () => {
    expect(toFt(toInch(ft(5))).value).toBeCloseTo(5);
  });

  it("yd → ft → yd", () => {
    expect(toYd(toFt(yd(3))).value).toBeCloseTo(3);
  });

  it("deg → rad → deg", () => {
    expect(toDeg(toRad(deg(270))).value).toBeCloseTo(270);
  });
});

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

describe("isLength()", () => {
  it("returns true for length values", () => {
    expect(isLength(μm(100))).toBe(true);
    expect(isLength(mm(5))).toBe(true);
    expect(isLength(cm(10))).toBe(true);
    expect(isLength(m(1))).toBe(true);
    expect(isLength(km(1))).toBe(true);
    expect(isLength(inch(2))).toBe(true);
    expect(isLength(ft(6))).toBe(true);
    expect(isLength(yd(2))).toBe(true);
    expect(isLength(mile(1))).toBe(true);
  });

  it("returns false for angle values", () => {
    expect(isLength(deg(90))).toBe(false);
    expect(isLength(rad(Math.PI))).toBe(false);
  });

  it("returns false for plain numbers and non-objects", () => {
    expect(isLength(42)).toBe(false);
    expect(isLength(null)).toBe(false);
    expect(isLength(undefined)).toBe(false);
  });
});

describe("isAngle()", () => {
  it("returns true for angle values", () => {
    expect(isAngle(deg(90))).toBe(true);
    expect(isAngle(rad(Math.PI))).toBe(true);
  });

  it("returns false for length values", () => {
    expect(isAngle(mm(5))).toBe(false);
    expect(isAngle(cm(10))).toBe(false);
    expect(isAngle(ft(6))).toBe(false);
  });

  it("returns false for plain numbers and non-objects", () => {
    expect(isAngle(42)).toBe(false);
    expect(isAngle(null)).toBe(false);
  });
});

describe("isMeasure()", () => {
  it("returns true for any tagged value (length or angle)", () => {
    expect(isMeasure(cm(10))).toBe(true);
    expect(isMeasure(mm(5))).toBe(true);
    expect(isMeasure(m(1))).toBe(true);
    expect(isMeasure(inch(2))).toBe(true);
    expect(isMeasure(ft(6))).toBe(true);
    expect(isMeasure(yd(2))).toBe(true);
    expect(isMeasure(km(1))).toBe(true);
    expect(isMeasure(mile(1))).toBe(true);
    expect(isMeasure(μm(100))).toBe(true);
    expect(isMeasure(deg(90))).toBe(true);
    expect(isMeasure(rad(Math.PI))).toBe(true);
  });

  it("returns false for plain numbers", () => {
    expect(isMeasure(42)).toBe(false);
  });

  it("returns false for null/undefined", () => {
    expect(isMeasure(null)).toBe(false);
    expect(isMeasure(undefined)).toBe(false);
  });

  it("returns false for objects without the right shape", () => {
    expect(isMeasure({ value: 10 })).toBe(false);
    expect(isMeasure({ unit: "cm" })).toBe(false);
  });
});
