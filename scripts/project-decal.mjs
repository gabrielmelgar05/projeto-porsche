/** Localized, supersampled homography. Quad: upper-left, upper-right, lower-right, lower-left. */
import sharp from "sharp";
export async function projectDecal(input, quad, { exposure = 0.8, opacity = 0.95 } = {}) {
  const { data, info } = await sharp(input)
    .resize({ width: 600 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad;
  const dx1 = x1 - x2,
    dx2 = x3 - x2,
    dx3 = x0 - x1 + x2 - x3,
    dy1 = y1 - y2,
    dy2 = y3 - y2,
    dy3 = y0 - y1 + y2 - y3;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / det,
    h = (dx1 * dy3 - dx3 * dy1) / det;
  const a = x1 - x0 + g * x1,
    b = x3 - x0 + h * x3,
    c = x0,
    d = y1 - y0 + g * y1,
    e = y3 - y0 + h * y3,
    f = y0;
  const matrix = [a, b, c, d, e, f, g, h, 1];
  const inv = [
    e - f * h,
    c * h - b,
    b * f - c * e,
    f * g - d,
    a - c * g,
    c * d - a * f,
    d * h - e * g,
    b * g - a * h,
    a * e - b * d,
  ];
  const determinant = matrix[0] * inv[0] + matrix[1] * inv[3] + matrix[2] * inv[6];
  for (let i = 0; i < 9; i++) inv[i] /= determinant;
  const left = Math.floor(Math.min(x0, x1, x2, x3)) - 1,
    top = Math.floor(Math.min(y0, y1, y2, y3)) - 1;
  const width = Math.ceil(Math.max(x0, x1, x2, x3)) - left + 1,
    height = Math.ceil(Math.max(y0, y1, y2, y3)) - top + 1;
  const scale = 4,
    ww = width * scale,
    hh = height * scale,
    out = Buffer.alloc(ww * hh * 4);
  for (let y = 0; y < hh; y++)
    for (let x = 0; x < ww; x++) {
      const X = left + (x + 0.5) / scale,
        Y = top + (y + 0.5) / scale,
        D = inv[6] * X + inv[7] * Y + inv[8];
      const u = (inv[0] * X + inv[1] * Y + inv[2]) / D,
        v = (inv[3] * X + inv[4] * Y + inv[5]) / D;
      if (u < 0 || u > 1 || v < 0 || v > 1) continue;
      const sx = u * (info.width - 1),
        sy = v * (info.height - 1),
        ix = Math.floor(sx),
        iy = Math.floor(sy),
        fx = sx - ix,
        fy = sy - iy,
        p = (y * ww + x) * 4;
      for (let k = 0; k < 4; k++) {
        const sample = (dx, dy) =>
          data[(Math.min(iy + dy, info.height - 1) * info.width + Math.min(ix + dx, info.width - 1)) * 4 + k];
        const value =
          (sample(0, 0) * (1 - fx) + sample(1, 0) * fx) * (1 - fy) +
          (sample(0, 1) * (1 - fx) + sample(1, 1) * fx) * fy;
        out[p + k] = Math.round(value * (k === 3 ? opacity : exposure * (1.04 - 0.08 * v)));
      }
    }
  return {
    input: await sharp(out, { raw: { width: ww, height: hh, channels: 4 } })
      .resize(width, height)
      .png()
      .toBuffer(),
    left,
    top,
  };
}
