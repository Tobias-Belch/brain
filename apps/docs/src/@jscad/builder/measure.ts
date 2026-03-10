// ---------------------------------------------------------------------------
// Internal factory — builds a tagged measure object for any unit string.
//
// Each object exposes five methods:
//   .as(targetUnit)  — convert to a different unit of the same dimension
//   .add(other)      — add a compatible measure or plain number (same unit)
//   .sub(other)      — subtract a compatible measure or plain number
//   .mul(factor)     — multiply by a plain number
//   .div(divisor)    — divide by a plain number
//
// All methods resolve their implementations at call-time via the module-level
// hooks defined after the converter functions, so the factory itself can be
// declared before those functions exist.
// ---------------------------------------------------------------------------
const measure =
  <U extends string>(unit: U) =>
  (value: number): { value: number; unit: U; as: AsFn<U>; add: AddFn<U>; sub: SubFn<U>; mul: MulDivFn<U>; div: MulDivFn<U> } => {
    const self = {
      value,
      unit,
      toString: () => `${value}${unit}`,
      as<V extends string>(targetUnit: V) {
        return _asImpl(self as never, targetUnit as never) as never;
      },
      add(other: { value: number; unit: string } | number) {
        return _addImpl(self as never, other as never) as never;
      },
      sub(other: { value: number; unit: string } | number) {
        return _subImpl(self as never, other as never) as never;
      },
      mul(factor: number) {
        return _mulImpl(self as never, factor) as never;
      },
      div(divisor: number) {
        return _divImpl(self as never, divisor) as never;
      },
    };
    return self as never;
  };

// Forward-declared dispatch hooks — filled in after converters are defined.
// eslint-disable-next-line prefer-const
let _asImpl: (
  self: { value: number; unit: string },
  targetUnit: string,
) => { value: number; unit: string } = () => {
  throw new Error("_asImpl not yet initialised");
};

type RawOther = { value: number; unit: string } | number;

// eslint-disable-next-line prefer-const
let _addImpl: (
  a: { value: number; unit: string },
  b: RawOther,
) => { value: number; unit: string } = () => {
  throw new Error("_addImpl not yet initialised");
};

// eslint-disable-next-line prefer-const
let _subImpl: (
  a: { value: number; unit: string },
  b: RawOther,
) => { value: number; unit: string } = () => {
  throw new Error("_subImpl not yet initialised");
};

// eslint-disable-next-line prefer-const
let _mulImpl: (
  a: { value: number; unit: string },
  factor: number,
) => { value: number; unit: string } = () => {
  throw new Error("_mulImpl not yet initialised");
};

// eslint-disable-next-line prefer-const
let _divImpl: (
  a: { value: number; unit: string },
  divisor: number,
) => { value: number; unit: string } = () => {
  throw new Error("_divImpl not yet initialised");
};

// ---------------------------------------------------------------------------
// Helper types for the methods attached to every measure object.
// ---------------------------------------------------------------------------

/** Maps a length unit string to its concrete tagged type. */
type LengthUnitMap = {
  " μm": Micrometers;
  " mm": Millimeters;
  " cm": Centimeters;
  " m": Meters;
  " km": Kilometers;
  '"': Inches;
  " ft": Feet;
  " yd": Yards;
  " mi": Miles;
};

/** Maps an angle unit string to its concrete tagged type. */
type AngleUnitMap = {
  "°": Degrees;
  " rad": Radians;
};

/** All unit strings recognised by `.as()`. */
type KnownUnit = keyof LengthUnitMap | keyof AngleUnitMap;

/**
 * Return type of `.as(targetUnit)`.
 * Preserves the concrete type when the target unit is a known literal, and
 * falls back to `{ value: number; unit: V }` for arbitrary strings.
 */
type AsResult<V extends string> = V extends keyof LengthUnitMap
  ? LengthUnitMap[V]
  : V extends keyof AngleUnitMap
    ? AngleUnitMap[V]
    : { value: number; unit: V };

type AsFn<_U extends string> = <V extends string>(targetUnit: V) => AsResult<V>;

/** Operand accepted by `.add()` and `.sub()`: a compatible tagged measure or a plain number (assumed same unit). */
type MeasureOrNumber<U extends string> = U extends keyof LengthUnitMap
  ? Length | number
  : U extends keyof AngleUnitMap
    ? Degrees | Radians | number
    : { value: number; unit: string } | number;

/**
 * Return type of `.add()` / `.sub()`.
 * When the source is a known length unit the result is `Length`;
 * when it is a known angle unit the result is `Degrees | Radians`.
 */
type AddFn<U extends string> = U extends keyof LengthUnitMap
  ? (other: Length | number) => Length
  : U extends keyof AngleUnitMap
    ? (other: Degrees | Radians | number) => Degrees | Radians
    : (other: { value: number; unit: string } | number) => {
        value: number;
        unit: string;
      };

type SubFn<U extends string> = AddFn<U>;

/**
 * Return type of `.mul()` / `.div()`.
 * The second operand is always a plain number (dimensionless scalar).
 */
type MulDivFn<U extends string> = U extends keyof LengthUnitMap
  ? (factor: number) => Length
  : U extends keyof AngleUnitMap
    ? (factor: number) => Degrees | Radians
    : (factor: number) => { value: number; unit: string };

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
// Wire up forward references — must come after all converters are defined.
// ---------------------------------------------------------------------------

_asImpl = (self, targetUnit) => {
  if (isLength(self as Length)) {
    const len = self as Length;
    switch (targetUnit) {
      case " μm": return toμm(len);
      case " mm": return toMm(len);
      case " cm": return toCm(len);
      case " m":  return toM(len);
      case " km": return toKm(len);
      case '"':   return toInch(len);
      case " ft": return toFt(len);
      case " yd": return toYd(len);
      case " mi": return toMile(len);
    }
  }
  if (isAngle(self as Degrees | Radians)) {
    const ang = self as Degrees | Radians;
    switch (targetUnit) {
      case "°":    return toDeg(ang);
      case " rad": return toRad(ang);
    }
  }
  throw new TypeError(
    `as: cannot convert "${self.unit}" to "${targetUnit}" — incompatible or unknown units`,
  );
};

/** Normalise `b` into a tagged measure with the same unit as `a` when `b` is a plain number. */
function normaliseBOperand(
  a: { value: number; unit: string },
  b: RawOther,
): { value: number; unit: string } {
  if (typeof b === "number") {
    // Reuse the measure factory indirectly: build a minimal tagged object.
    return { value: b, unit: a.unit, toString: () => `${b}${a.unit}` } as never;
  }
  return b;
}

_addImpl = (a, b) => {
  const bNorm = normaliseBOperand(a, b);
  if (isLength(a as Length) && isLength(bNorm as Length)) {
    const sumMm = mm(toMm(a as Length).value + toMm(bNorm as Length).value);
    return _asImpl(sumMm, a.unit);
  }
  if (isAngle(a as Degrees | Radians) && isAngle(bNorm as Degrees | Radians)) {
    const sumRad = rad(toRad(a as Degrees | Radians).value + toRad(bNorm as Degrees | Radians).value);
    return _asImpl(sumRad, a.unit);
  }
  throw new TypeError(
    `add: cannot mix Length and Angle operands (got "${a.unit}" and "${bNorm.unit}")`,
  );
};

_subImpl = (a, b) => {
  const bNorm = normaliseBOperand(a, b);
  if (isLength(a as Length) && isLength(bNorm as Length)) {
    const diffMm = mm(toMm(a as Length).value - toMm(bNorm as Length).value);
    return _asImpl(diffMm, a.unit);
  }
  if (isAngle(a as Degrees | Radians) && isAngle(bNorm as Degrees | Radians)) {
    const diffRad = rad(toRad(a as Degrees | Radians).value - toRad(bNorm as Degrees | Radians).value);
    return _asImpl(diffRad, a.unit);
  }
  throw new TypeError(
    `sub: cannot mix Length and Angle operands (got "${a.unit}" and "${bNorm.unit}")`,
  );
};

_mulImpl = (a, factor) => {
  return _asImpl({ value: a.value * factor, unit: a.unit } as never, a.unit);
};

_divImpl = (a, divisor) => {
  if (divisor === 0) throw new RangeError("div: cannot divide by zero");
  return _asImpl({ value: a.value / divisor, unit: a.unit } as never, a.unit);
};

// ---------------------------------------------------------------------------
// add — standalone function (prefer the method form: a.add(b))
// ---------------------------------------------------------------------------

/**
 * Add two lengths. The result is expressed in the unit of `a`.
 * Pass a plain `number` for `b` to treat it as the same unit as `a`.
 *
 * Prefer the method form: `mm(10).add(cm(1))` or `mm(10).add(5)`.
 *
 * @example
 * add(mm(10), cm(1))  // → mm(20)
 * add(ft(1), inch(6)) // → ft(1.5)
 * add(cm(5), 3)       // → cm(8)
 */
export function add(a: Length, b: Length | number): Length;

/**
 * Add two angles. The result is expressed in the unit of `a`.
 * Pass a plain `number` for `b` to treat it as the same unit as `a`.
 *
 * Prefer the method form: `deg(90).add(rad(Math.PI / 2))` or `deg(90).add(45)`.
 *
 * @example
 * add(deg(90), deg(45))           // → deg(135)
 * add(deg(180), rad(Math.PI / 2)) // → deg(270)
 * add(deg(90), 45)                // → deg(135)
 */
export function add(a: Degrees | Radians, b: Degrees | Radians | number): Degrees | Radians;

export function add(
  a: Length | Degrees | Radians,
  b: Length | Degrees | Radians | number,
): Length | Degrees | Radians {
  return _addImpl(a, b) as Length | Degrees | Radians;
}

// ---------------------------------------------------------------------------
// sub — standalone function (prefer the method form: a.sub(b))
// ---------------------------------------------------------------------------

/**
 * Subtract `b` from `a`. The result is expressed in the unit of `a`.
 * Pass a plain `number` for `b` to treat it as the same unit as `a`.
 *
 * @example
 * sub(mm(20), cm(1))  // → mm(10)
 * sub(cm(5), 3)       // → cm(2)
 */
export function sub(a: Length, b: Length | number): Length;

/**
 * Subtract `b` from `a`. The result is expressed in the unit of `a`.
 * Pass a plain `number` for `b` to treat it as the same unit as `a`.
 *
 * @example
 * sub(deg(180), rad(Math.PI / 2)) // → deg(90)
 * sub(deg(90), 45)                // → deg(45)
 */
export function sub(a: Degrees | Radians, b: Degrees | Radians | number): Degrees | Radians;

export function sub(
  a: Length | Degrees | Radians,
  b: Length | Degrees | Radians | number,
): Length | Degrees | Radians {
  return _subImpl(a, b) as Length | Degrees | Radians;
}

// ---------------------------------------------------------------------------
// mul — standalone function (prefer the method form: a.mul(factor))
// ---------------------------------------------------------------------------

/**
 * Multiply a length by a dimensionless scalar. The result is in the same unit.
 *
 * @example
 * mul(mm(5), 3)   // → mm(15)
 * mul(inch(2), 6) // → inch(12)  i.e. 1 ft
 */
export function mul(a: Length, factor: number): Length;

/**
 * Multiply an angle by a dimensionless scalar. The result is in the same unit.
 *
 * @example
 * mul(deg(90), 2) // → deg(180)
 */
export function mul(a: Degrees | Radians, factor: number): Degrees | Radians;

export function mul(
  a: Length | Degrees | Radians,
  factor: number,
): Length | Degrees | Radians {
  return _mulImpl(a, factor) as Length | Degrees | Radians;
}

// ---------------------------------------------------------------------------
// div — standalone function (prefer the method form: a.div(divisor))
// ---------------------------------------------------------------------------

/**
 * Divide a length by a dimensionless scalar. The result is in the same unit.
 *
 * @example
 * div(mm(10), 2)  // → mm(5)
 * div(inch(12), 12) // → inch(1)
 */
export function div(a: Length, divisor: number): Length;

/**
 * Divide an angle by a dimensionless scalar. The result is in the same unit.
 *
 * @example
 * div(deg(180), 2) // → deg(90)
 */
export function div(a: Degrees | Radians, divisor: number): Degrees | Radians;

export function div(
  a: Length | Degrees | Radians,
  divisor: number,
): Length | Degrees | Radians {
  return _divImpl(a, divisor) as Length | Degrees | Radians;
}

// ---------------------------------------------------------------------------
// convertTo (standalone function — prefer the method form: a.as(unit))
// ---------------------------------------------------------------------------

/**
 * Convert a length or angle to a different unit.
 *
 * Prefer the method form: `mm(25.4).as('"')`.
 *
 * @example
 * convertTo(mm(25.4), '"')    // → inch(1)
 * convertTo(deg(180), " rad") // → rad(Math.PI)
 */
export function convertTo<V extends keyof LengthUnitMap>(value: Length, targetUnit: V): LengthUnitMap[V];
export function convertTo<V extends keyof AngleUnitMap>(value: Degrees | Radians, targetUnit: V): AngleUnitMap[V];
export function convertTo(
  value: Length | Degrees | Radians,
  targetUnit: string,
): Length | Degrees | Radians {
  return _asImpl(value, targetUnit) as Length | Degrees | Radians;
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
