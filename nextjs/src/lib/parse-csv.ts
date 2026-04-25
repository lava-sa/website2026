/**
 * Minimal CSV parser (handles quoted fields with commas and doubled quotes).
 */

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

/** Split into logical lines, respecting newlines inside quoted fields */
export function splitCsvText(text: string): string[] {
  const t = text.replace(/^\uFEFF/, "");
  const lines: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === '"') {
      if (inQuotes && t[i + 1] === '"') {
        cur += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      cur += c;
      continue;
    }
    if (!inQuotes && (c === "\n" || (c === "\r" && t[i + 1] === "\n"))) {
      if (c === "\r") i++;
      if (cur.trim()) lines.push(cur);
      cur = "";
      continue;
    }
    if (!inQuotes && c === "\r") {
      if (cur.trim()) lines.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  if (cur.trim()) lines.push(cur);
  return lines;
}

export function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const rawLines = splitCsvText(text.replace(/^\uFEFF/, ""));
  if (rawLines.length === 0) return { headers: [], rows: [] };

  const headerCells = parseCsvLine(rawLines[0]);
  const headers = headerCells.map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < rawLines.length; i++) {
    const cells = parseCsvLine(rawLines[i]);
    if (cells.every((c) => !c)) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ?? "";
    });
    rows.push(row);
  }
  return { headers, rows };
}
