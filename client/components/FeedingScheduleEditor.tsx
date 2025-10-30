import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Phase = "lactation" | "dry";
export type FeedingEntry = {
  id: string;
  date: string;
  type: string;
  phase: Phase;
  qtyPerAnimalPerDayKg: number;
  ratePerKg: number;
  days?: number;
  animals?: number;
  edited?: boolean; // flagged when user manually changes a field
};

export function generateBaselineEntries(
  base: { name: string; lactQty: number; dryQty: number; rateLact: number; rateDry: number }[],
  lactDays: number,
  dryDays: number,
  animals: number,
  lactMult: number,
  dryMult: number,
  weightKg: number,
): FeedingEntry[] {
  // Simple model: adjust quantity by multipliers and slight weight effect
  const weightFactor = weightKg / 400; // 400kg baseline
  const rows: FeedingEntry[] = [];
  base.forEach((b, idx) => {
    rows.push({
      id: `l-${idx}`,
      date: "",
      type: b.name,
      phase: "lactation",
      qtyPerAnimalPerDayKg: b.lactQty * lactMult * weightFactor,
      ratePerKg: b.rateLact,
      days: lactDays,
      animals,
    });
    rows.push({
      id: `d-${idx}`,
      date: "",
      type: b.name,
      phase: "dry",
      qtyPerAnimalPerDayKg: b.dryQty * dryMult * weightFactor,
      ratePerKg: b.rateDry,
      days: dryDays,
      animals,
    });
  });
  return rows;
}

export function computeDailyPerAnimalCosts(entries: FeedingEntry[]) {
  const lact = entries
    .filter((e) => e.phase === "lactation")
    .reduce((s, e) => s + e.qtyPerAnimalPerDayKg * e.ratePerKg, 0);
  const dry = entries
    .filter((e) => e.phase === "dry")
    .reduce((s, e) => s + e.qtyPerAnimalPerDayKg * e.ratePerKg, 0);
  return { lact, dry };
}

export function computeTotalFeedCost(
  entries: FeedingEntry[],
  defaults: { lactDays: number; dryDays: number; animals: number },
) {
  return entries.reduce((sum, e) => {
    const days = e.days ?? (e.phase === "lactation" ? defaults.lactDays : defaults.dryDays);
    const animals = e.animals ?? defaults.animals;
    const cost = e.qtyPerAnimalPerDayKg * e.ratePerKg * days * animals;
    return sum + cost;
  }, 0);
}

export default function FeedingScheduleEditor({
  entries,
  setEntries,
  readOnly,
}: {
  entries: FeedingEntry[];
  setEntries: (updater: (prev: FeedingEntry[]) => FeedingEntry[]) => void;
  readOnly?: boolean;
}) {
  const totalRows = useMemo(
    () =>
      entries.map((e) => ({
        ...e,
        total: e.qtyPerAnimalPerDayKg * e.ratePerKg * (e.days ?? 1) * (e.animals ?? 1),
      })),
    [entries],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feeding Schedule Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Feed type</TableHead>
              <TableHead className="text-right">Qty/animal/day (kg)</TableHead>
              <TableHead className="text-right">Rate (₹/kg)</TableHead>
              <TableHead className="text-right">Days</TableHead>
              <TableHead className="text-right">Animals</TableHead>
              <TableHead className="text-right">Row cost (₹)</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalRows.map((row, i) => (
              <TableRow key={row.id} className={row.edited ? "bg-accent/30" : undefined}>
                <TableCell>
                  <Input
                    value={row.date}
                    disabled={readOnly}
                    onChange={(e) =>
                      setEntries((prev) => prev.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))
                    }
                  />
                </TableCell>
                <TableCell>
                  <select
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                    value={row.phase}
                    disabled={readOnly}
                    onChange={(e) =>
                      setEntries((prev) => prev.map((x, j) => (j === i ? { ...x, phase: e.target.value as Phase, edited: true } : x)))
                    }
                  >
                    <option value="lactation">lactation</option>
                    <option value="dry">dry</option>
                  </select>
                </TableCell>
                <TableCell>
                  <Input
                    value={row.type}
                    disabled={readOnly}
                    onChange={(e) =>
                      setEntries((prev) => prev.map((x, j) => (j === i ? { ...x, type: e.target.value, edited: true } : x)))
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    className={`text-right ${row.qtyPerAnimalPerDayKg < 0 ? 'border-red-500' : ''}`}
                    type="number"
                    value={row.qtyPerAnimalPerDayKg}
                    disabled={readOnly}
                    step={0.1}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value));
                      setEntries((prev) => prev.map((x, j) => (j === i ? { ...x, qtyPerAnimalPerDayKg: val, edited: true } : x)));
                    }}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    className={`text-right ${row.ratePerKg < 0 ? 'border-red-500' : ''}`}
                    type="number"
                    value={row.ratePerKg}
                    disabled={readOnly}
                    step={0.5}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value));
                      setEntries((prev) => prev.map((x, j) => (j === i ? { ...x, ratePerKg: val, edited: true } : x)));
                    }}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    className={`text-right ${(row.days ?? 0) < 0 ? 'border-red-500' : ''}`}
                    type="number"
                    value={row.days ?? ""}
                    disabled={readOnly}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val = raw === "" ? undefined : Math.max(0, Number(raw));
                      setEntries((prev) => prev.map((x, j) => (j === i ? { ...x, days: val, edited: true } : x)));
                    }}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    className={`text-right ${(row.animals ?? 0) < 0 ? 'border-red-500' : ''}`}
                    type="number"
                    value={row.animals ?? ""}
                    disabled={readOnly}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val = raw === "" ? undefined : Math.max(0, Number(raw));
                      setEntries((prev) => prev.map((x, j) => (j === i ? { ...x, animals: val, edited: true } : x)));
                    }}
                  />
                </TableCell>
                <TableCell className="text-right">₹ {Math.round(row.total).toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-right">
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      onClick={() => setEntries((prev) => prev.filter((_, j) => j !== i))}
                    >
                      Remove
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!readOnly && (
              <TableRow>
                <TableCell colSpan={9}>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setEntries((prev) =>
                        prev.concat({
                          id: `new-${Date.now()}`,
                          date: "",
                          type: "New feed",
                          phase: "lactation",
                          qtyPerAnimalPerDayKg: 1,
                          ratePerKg: 1,
                          days: undefined,
                          animals: undefined,
                        }),
                      )
                    }
                  >
                    Add row
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
