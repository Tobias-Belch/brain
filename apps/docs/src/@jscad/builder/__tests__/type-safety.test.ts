/**
 * Compile-time type-safety assertions.
 *
 * These tests contain no runtime assertions — they exist solely to verify that
 * the TypeScript compiler rejects invalid argument combinations at compile time.
 *
 * Each `@ts-expect-error` comment asserts that the following line IS a type
 * error. If the error disappears (i.e. the type system becomes too permissive),
 * TypeScript will flag the `@ts-expect-error` itself, causing the build to fail.
 *
 * The `noop` helper prevents the expressions from being DCE'd while ensuring
 * nothing is actually executed (the functions are never called at runtime).
 */
import { describe, it } from "vitest";
import { createBuilder } from "../factory";
import { cm, deg, mm } from "../measure";

const { cuboid, rotate } = createBuilder({ coordinateUnit: "mm" });

/** Captures the type of a function for compile-time checking without calling it. */
const check = <T>(_fn: () => T) => {};

describe("type safety — Length vs Angle discrimination", () => {
  it("rotate() rejects Length values at compile time", () => {
    const b = cuboid({ size: [10, 10, 10] });

    // A length value must not be accepted where an Angle is expected.
    // @ts-expect-error — mm() is a Length, not an Angle
    check(() => rotate([mm(90), 0, 0])(b));

    // @ts-expect-error — cm() is a Length, not an Angle
    check(() => rotate([0, cm(45), 0])(b));
  });

  it("cuboid() rejects Angle values at compile time", () => {
    // An angle value must not be accepted where a Dim (number | Length) is expected.
    // @ts-expect-error — deg() is an Angle, not a Dim
    check(() => cuboid({ size: [deg(10), 10, 10] }));

    // @ts-expect-error — deg() is an Angle, not a Dim
    check(() => cuboid({ size: [10, deg(20), 10] }));
  });
});
