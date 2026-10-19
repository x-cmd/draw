// CSV → spec JSON:首行表头,两列=单系列,多列=多系列。
import { ApiError } from './base';

// CSV → spec JSON:首行为表头。两列(label,value)=单系列;多列(label,系列A,系列B)=多系列
export function csvToSpecJson(csv: string): string {
  const rows = csv.replace(/\r/g, '').split('\n').filter((l) => l.trim() !== '');
  if (rows.length < 2) throw new ApiError(400, 'CSV needs a header row and at least one data row');
  const cells = rows.map((r) => r.split(',').map((c) => c.trim()));
  const width = cells[0].length;
  if (width < 2) throw new ApiError(400, 'CSV needs at least 2 columns: label,value[,series2,...]');
  for (let i = 1; i < cells.length; i++) {
    if (cells[i].length !== width) {
      throw new ApiError(400, `CSV row ${i + 1} has ${cells[i].length} cells, expected ${width}`);
    }
  }
  const header = cells[0];
  if (width === 2) {
    return JSON.stringify({
      data: cells.slice(1).map((r) => {
        const v = Number(r[1]);
        if (!Number.isFinite(v)) throw new ApiError(400, `CSV value "${r[1]}" (row with label "${r[0]}") is not a number`);
        return { label: r[0], value: v };
      }),
    });
  }
  return JSON.stringify({
    labels: cells.slice(1).map((r) => r[0]),
    series: header.slice(1).map((name, si) => ({
      name,
      values: cells.slice(1).map((r) => {
        const v = Number(r[si + 1]);
        if (!Number.isFinite(v)) throw new ApiError(400, `CSV value "${r[si + 1]}" (series "${name}") is not a number`);
        return v;
      }),
    })),
  });
}
