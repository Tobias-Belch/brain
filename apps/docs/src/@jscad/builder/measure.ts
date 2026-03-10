// ---------------------------------------------------------------------------
// Internal factory — builds a tagged measure object for any unit string.
// ---------------------------------------------------------------------------
const measure =
  <U extends string>(unit: U) =>
  (value: number) => {
    return { value, unit, toString: () => `${value}${unit}` } as {
      value: number;
      unit: U;
    };
  };

// ---------------------------------------------------------------------------
// Length unit constructors
// ---------------------------------------------------------------------------

export const μm = measure(" μm");
export type Micrometers = ReturnType<typeof μm>;

export const mm = measure(" mm");
export type Millimeters = ReturnType<typeof mm>;

export const cm = measure(" cm");
export type Centimeters = ReturnType<typeof cm>;

export const m = measure(" m");
export type Meters = ReturnType<typeof m>;

export const km = measure(" km");
export type Kilometers = ReturnType<typeof km>;

export const inch = measure('"');
export type Inches = ReturnType<typeof inch>;

export const ft = measure(" ft");
export type Feet = ReturnType<typeof ft>;

export const yd = measure(" yd");
export type Yards = ReturnType<typeof yd>;

export const mile = measure(" mi");
export type Miles = ReturnType<typeof mile>;

// ---------------------------------------------------------------------------
// Angle unit constructors
// ---------------------------------------------------------------------------

export const deg = measure("°");
export type Degrees = ReturnType<typeof deg>;

export const rad = measure(" rad");
export type Radians = ReturnType<typeof rad>;

// ---------------------------------------------------------------------------
// Union types
// ---------------------------------------------------------------------------

/**
 * Any unit-tagged length value. Use as a `Dim` input alongside plain numbers.
 */
export type Length =
  | Micrometers
  | Millimeters
  | Centimeters
  | Meters
  | Kilometers
  | Inches
  | Feet
  | Yards
  | Miles;

/**
 * A rotation angle input. Accepts:
 * - `number` — treated as radians (same convention as JSCAD's raw rotate())
 * - `deg(n)` — converted from degrees to radians automatically
 * - `rad(n)` — explicit radians; identical to passing a plain number
 *
 * Length values (`mm()`, `cm()`, etc.) are rejected at compile time.
 */
export type Angle = number | Degrees | Radians;

/**
 * The top-level union of all tagged measure types — lengths and angles.
 * Useful for generic utilities (`isMeasure`, `formatMeasure`) that operate on
 * any tagged value regardless of physical dimension.
 */
export type Measure = Length | Angle;

// ---------------------------------------------------------------------------
// Supported coordinate units (length only — used by createBuilder)
// ---------------------------------------------------------------------------

/**
 * Supported coordinate units for the builder.
 * Passed to `createBuilder({ coordinateUnit })` to define what raw numbers mean.
 */
export type Unit =
  | "μm"
  | "mm"
  | "cm"
  | "m"
  | "km"
  | "inch"
  | "ft"
  | "yd"
  | "mile";

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

const LENGTH_UNITS = new Set([
  " μm",
  " mm",
  " cm",
  " m",
  " km",
  '"',
  " ft",
  " yd",
  " mi",
]);
const ANGLE_UNITS = new Set(["°", " rad"]);

/** Returns true if `value` is a tagged length (`mm()`, `cm()`, `ft()`, etc.). */
export function isLength(value: unknown): value is Length {
  return (
    value !== null &&
    typeof value === "object" &&
    "value" in value &&
    "unit" in value &&
    typeof (value as Record<string, unknown>).value === "number" &&
    LENGTH_UNITS.has((value as Record<string, unknown>).unit as string)
  );
}

/** Returns true if `value` is a tagged angle object (`deg()` or `rad()`). Plain numbers return false. */
export function isAngle(value: unknown): value is Degrees | Radians {
  return (
    value !== null &&
    typeof value === "object" &&
    "value" in value &&
    "unit" in value &&
    typeof (value as Record<string, unknown>).value === "number" &&
    ANGLE_UNITS.has((value as Record<string, unknown>).unit as string)
  );
}

/** Returns true if `value` is any tagged measure object (length or angle). Plain numbers return false. */
export function isMeasure(value: unknown): value is Measure {
  return isLength(value) || isAngle(value);
}

/** @deprecated Use `isMeasure` instead. */
export const isNumberWithUnit = isMeasure;

// ---------------------------------------------------------------------------
// Length converters
// All conversion factors are relative to mm as the internal anchor.
// 1 inch  = 25.4 mm
// 1 ft    = 304.8 mm
// 1 yd    = 914.4 mm
// 1 mi    = 1 609 344 mm
// 1 μm    = 0.001 mm
// ---------------------------------------------------------------------------

/** Convert any length Measure to millimeters. */
export function toMm(value: Length): Millimeters {
  switch (value.unit) {
    case " μm":
      return mm(value.value * 0.001);
    case " cm":
      return mm(value.value * 10);
    case " m":
      return mm(value.value * 1_000);
    case " km":
      return mm(value.value * 1_000_000);
    case '"':
      return mm(value.value * 25.4);
    case " ft":
      return mm(value.value * 304.8);
    case " yd":
      return mm(value.value * 914.4);
    case " mi":
      return mm(value.value * 1_609_344);
    default:
      return value as Millimeters;
  }
}

/** Convert any length Measure to centimeters. */
export function toCm(value: Length): Centimeters {
  switch (value.unit) {
    case " μm":
      return cm(value.value * 0.0001);
    case " mm":
      return cm(value.value / 10);
    case " m":
      return cm(value.value * 100);
    case " km":
      return cm(value.value * 100_000);
    case '"':
      return cm(value.value * 2.54);
    case " ft":
      return cm(value.value * 30.48);
    case " yd":
      return cm(value.value * 91.44);
    case " mi":
      return cm(value.value * 160_934.4);
    default:
      return value as Centimeters;
  }
}

/** Convert any length Measure to meters. */
export function toM(value: Length): Meters {
  switch (value.unit) {
    case " μm":
      return m(value.value * 0.000_001);
    case " mm":
      return m(value.value / 1_000);
    case " cm":
      return m(value.value / 100);
    case " km":
      return m(value.value * 1_000);
    case '"':
      return m(value.value * 0.0254);
    case " ft":
      return m(value.value * 0.3048);
    case " yd":
      return m(value.value * 0.9144);
    case " mi":
      return m(value.value * 1_609.344);
    default:
      return value as Meters;
  }
}

/** Convert any length Measure to kilometers. */
export function toKm(value: Length): Kilometers {
  switch (value.unit) {
    case " μm":
      return km(value.value * 0.000_000_001);
    case " mm":
      return km(value.value / 1_000_000);
    case " cm":
      return km(value.value / 100_000);
    case " m":
      return km(value.value / 1_000);
    case '"':
      return km(value.value * 0.0000254);
    case " ft":
      return km(value.value * 0.0003048);
    case " yd":
      return km(value.value * 0.0009144);
    case " mi":
      return km(value.value * 1.609344);
    default:
      return value as Kilometers;
  }
}

/** Convert any length Measure to micrometers. */
export function toμm(value: Length): Micrometers {
  switch (value.unit) {
    case " mm":
      return μm(value.value * 1_000);
    case " cm":
      return μm(value.value * 10_000);
    case " m":
      return μm(value.value * 1_000_000);
    case " km":
      return μm(value.value * 1_000_000_000);
    case '"':
      return μm(value.value * 25_400);
    case " ft":
      return μm(value.value * 304_800);
    case " yd":
      return μm(value.value * 914_400);
    case " mi":
      return μm(value.value * 1_609_344_000);
    default:
      return value as Micrometers;
  }
}

/** Convert any length Measure to inches. */
export function toInch(value: Length): Inches {
  switch (value.unit) {
    case " μm":
      return inch(value.value / 25_400);
    case " mm":
      return inch(value.value / 25.4);
    case " cm":
      return inch(value.value / 2.54);
    case " m":
      return inch(value.value / 0.0254);
    case " km":
      return inch(value.value / 0.0000254);
    case " ft":
      return inch(value.value * 12);
    case " yd":
      return inch(value.value * 36);
    case " mi":
      return inch(value.value * 63_360);
    default:
      return value as Inches;
  }
}

/** Convert any length Measure to feet. */
export function toFt(value: Length): Feet {
  switch (value.unit) {
    case " μm":
      return ft(value.value / 304_800);
    case " mm":
      return ft(value.value / 304.8);
    case " cm":
      return ft(value.value / 30.48);
    case " m":
      return ft(value.value / 0.3048);
    case " km":
      return ft(value.value / 0.0003048);
    case '"':
      return ft(value.value / 12);
    case " yd":
      return ft(value.value * 3);
    case " mi":
      return ft(value.value * 5_280);
    default:
      return value as Feet;
  }
}

/** Convert any length Measure to yards. */
export function toYd(value: Length): Yards {
  switch (value.unit) {
    case " μm":
      return yd(value.value / 914_400);
    case " mm":
      return yd(value.value / 914.4);
    case " cm":
      return yd(value.value / 91.44);
    case " m":
      return yd(value.value / 0.9144);
    case " km":
      return yd(value.value / 0.0009144);
    case '"':
      return yd(value.value / 36);
    case " ft":
      return yd(value.value / 3);
    case " mi":
      return yd(value.value * 1_760);
    default:
      return value as Yards;
  }
}

/** Convert any length Measure to miles. */
export function toMile(value: Length): Miles {
  switch (value.unit) {
    case " μm":
      return mile(value.value / 1_609_344_000);
    case " mm":
      return mile(value.value / 1_609_344);
    case " cm":
      return mile(value.value / 160_934.4);
    case " m":
      return mile(value.value / 1_609.344);
    case " km":
      return mile(value.value / 1.609344);
    case '"':
      return mile(value.value / 63_360);
    case " ft":
      return mile(value.value / 5_280);
    case " yd":
      return mile(value.value / 1_760);
    default:
      return value as Miles;
  }
}

// ---------------------------------------------------------------------------
// Angle converters
// ---------------------------------------------------------------------------

/** Convert any tagged angle to radians. */
export function toRad(value: Degrees | Radians): Radians {
  switch (value.unit) {
    case "°":
      return rad(value.value * (Math.PI / 180));
    default:
      return value as Radians;
  }
}

/** Convert any tagged angle to degrees. */
export function toDeg(value: Degrees | Radians): Degrees {
  switch (value.unit) {
    case " rad":
      return deg(value.value * (180 / Math.PI));
    default:
      return value as Degrees;
  }
}

// ---------------------------------------------------------------------------
// Formatting utility
// ---------------------------------------------------------------------------

export function formatMeasure(value: Length | Degrees | Radians): string {
  return `${value.value}${value.unit}`;
}

/** @deprecated Use `formatMeasure` instead. */
export const formatValueWithUnit = formatMeasure;

// ---------------------------------------------------------------------------
// Deprecated re-export for backward compat
// ---------------------------------------------------------------------------

/** @deprecated Use `Measure` instead. */
export type NumberWithUnit = Measure;

/** @deprecated Use `Inches` instead. */
export type Inch = Inches;
