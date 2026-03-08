const numberWithUnit =
  <U extends string>(unit: U) =>
  (value: number) => {
    return { value, unit, toString: () => `${value}${unit}` } as {
      value: number;
      unit: U;
    };
  };

export const inch = numberWithUnit('"');
export type Inch = ReturnType<typeof inch>;

export const mm = numberWithUnit(" mm");
export type Milimeters = ReturnType<typeof mm>;

export const cm = numberWithUnit(" cm");
export type Centimeters = ReturnType<typeof cm>;

export const m = numberWithUnit(" m");
export type Meters = ReturnType<typeof m>;

export type NumberWithUnit = Inch | Milimeters | Centimeters | Meters;

export function isNumberWithUnit(value: any): value is NumberWithUnit {
  return (
    value &&
    typeof value === "object" &&
    "value" in value &&
    "unit" in value &&
    typeof value.value === "number" &&
    typeof value.unit === "string"
  );
}

export function toMm(value: NumberWithUnit): Milimeters {
  switch (value.unit) {
    case " cm":
      return mm(value.value * 10);
    case " m":
      return mm(value.value * 1000);
    case '"':
      return mm(value.value * 25.4);
    default:
      return value;
  }
}

export function toCm(value: NumberWithUnit): Centimeters {
  switch (value.unit) {
    case " mm":
      return cm(value.value / 10);
    case '"':
      return cm(value.value * 2.54);
    case " m":
      return cm(value.value * 100);
    default:
      return value;
  }
}

export function toInch(value: NumberWithUnit): Inch {
  switch (value.unit) {
    case " mm":
      return inch(value.value / 25.4);
    case " cm":
      return inch(value.value / 2.54);
    case " m":
      return inch(value.value / 0.0254);
    default:
      return value;
  }
}

export function toM(value: NumberWithUnit): Meters {
  switch (value.unit) {
    case " mm":
      return m(value.value / 1000);
    case " cm":
      return m(value.value / 100);
    case '"':
      return m(value.value * 0.0254);
    default:
      return value;
  }
}

export const l = numberWithUnit(" l");
export type Liters = ReturnType<typeof l>;

export function calculateVolume(
  width: NumberWithUnit,
  height: NumberWithUnit,
  depth: NumberWithUnit,
): Liters {
  const volumeInCubicMeters =
    toM(width).value * toM(height).value * toM(depth).value;

  return l(Number((volumeInCubicMeters * 1000).toFixed(0)));
}

export function formatValueWithUnit(value: NumberWithUnit | Liters): string {
  return `${value.value}${value.unit}`;
}
