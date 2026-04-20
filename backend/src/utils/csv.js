import { stringify } from "csv-stringify/sync";

export function makeCsv(rows) {
  return stringify(rows, { header: true });
}
