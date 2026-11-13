/** Replaces `{key}` tokens. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Locale-aware numbers: 3.2 (en) / 3,2 (pt-BR); 1,450 / 1.450. */
export function formatNumber(value: number, tag: string, digits = 0): string {
  return new Intl.NumberFormat(tag, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
