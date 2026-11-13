/**
 * Verified technical data — 992-generation 911 GT3 RS.
 * Source: Porsche AG world-premiere press release (August 2022).
 * Only add figures that appear in an official Porsche source.
 */
export const specifications = {
  powerPs: 525,
  powerKw: 386,
  sprint0to100: 3.2,
  topSpeedKmh: 296,
  displacementL: 4.0,
  gears: 7,
  kerbWeightKg: 1450,
  downforce: [
    { kg: 409, atKmh: 200 },
    { kg: 860, atKmh: 285 },
  ],
  brakes: { frontDiscMm: 408, frontPistons: 6, rearDiscMm: 380, rearPistons: 4 },
} as const;

export const specificationSource = {
  label: "Porsche Newsroom — 911 GT3 RS world premiere (2022)",
  url: "https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29177.html",
} as const;
