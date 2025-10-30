import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { irr, npv, amortizationEqualPrincipal } from "@/lib/finance";
import { scenarios, type UnitType, defaultFeeding } from "@/lib/dairyData";
import FeedingScheduleEditor, {
  FeedingEntry,
  generateBaselineEntries,
  computeDailyPerAnimalCosts,
  computeTotalFeedCost,
} from "@/components/FeedingScheduleEditor";
import { CursorTrail } from "@/components/CursorTrail";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AnimatedSection } from "@/components/AnimatedSection";
import { AnimatedCard } from "@/components/AnimatedCard";
import { GoToTopButton } from "@/components/GoToTopButton";
import { ProgressBar } from "@/components/ProgressBar";
import { DollarSign, Landmark, Percent, TrendingUp } from "lucide-react";
import { ContactSection } from "@/components/ContactSection";

function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

// Which finance variable should be auto-derived to keep capital = margin + loan
type AutoBalanceTarget = "bankLoan" | "marginMoney" | "capitalCost";

export default function Index() {
  const [unit, setUnit] = useState<UnitType>("5+5");
  const [customUnitSize, setCustomUnitSize] = useState<number | null>(null);
  const baselineData = scenarios[unit];

  // Calculate scaled data based on custom unit size
  const getScaledData = () => {
    if (customUnitSize === null || customUnitSize <= 0) {
      return baselineData;
    }

    const scaleFactor = customUnitSize / baselineData.animals;
    return {
      ...baselineData,
      animals: customUnitSize,
      capitalCost: Math.round(baselineData.capitalCost * scaleFactor),
      bankLoan: Math.round(baselineData.bankLoan * scaleFactor),
      marginMoney: Math.round(baselineData.marginMoney * scaleFactor),
      saleOfMilkYears: baselineData.saleOfMilkYears.map(v => Math.round(v * scaleFactor)),
      recurringCostYears: baselineData.recurringCostYears.map(v => Math.round(v * scaleFactor)),
      surplusYears: baselineData.surplusYears.map(v => Math.round(v * scaleFactor)),
      lactationDays: Math.round(baselineData.lactationDays * scaleFactor),
      dryDays: Math.round(baselineData.dryDays * scaleFactor),
    };
  };

  const data = getScaledData();

  // Assumptions (calculator controls)
  const [discountRate, setDiscountRate] = useState(0.15);
  const [milkPrice, setMilkPrice] = useState(40);
  const [yieldPerCowPerDay, setYieldPerCowPerDay] = useState(4);
  const [lactDays, setLactDays] = useState(270);
  const [dryDays, setDryDays] = useState(95);
  const [animalWeightKg, setAnimalWeightKg] = useState(400);
  const [lactMult, setLactMult] = useState(1);
  const [dryMult, setDryMult] = useState(1);
  const [labour, setLabour] = useState(unit === "5+5" ? 48000 : 0);
  const [vetPerAnimal, setVetPerAnimal] = useState(1000);
  const [elecMisc, setElecMisc] = useState(unit === "5+5" ? 1500 : 300);
  const [insurance, setInsurance] = useState(unit === "5+5" ? 17500 : 3500);

  // Finance (editable) with auto-balance to maintain identity capital = margin + loan
  const [capitalCost, setCapitalCost] = useState<number>(data.capitalCost);
  const [bankLoan, setBankLoan] = useState<number>(data.bankLoan);
  const [marginMoney, setMarginMoney] = useState<number>(data.marginMoney);
  const [interestRate, setInterestRate] = useState<number>(data.interestRate);
  const [autoTarget, setAutoTarget] = useState<AutoBalanceTarget>("bankLoan");

  // 6-year series state with sync toggle
  const [series, setSeries] = useState<number[]>(() => [...data.surplusYears]);
  const [syncSeries, setSyncSeries] = useState(true);

  // Feeding schedule state with sync toggle
  const [feedEntries, setFeedEntries] = useState<FeedingEntry[]>([]);
  const [syncFeeding, setSyncFeeding] = useState(true);

  // When unit changes, reset defaults (keeps UI reactive across scenarios)
  useEffect(() => {
    const newData = getScaledData();
    setSeries([...newData.surplusYears]);
    setLabour(unit === "5+5" ? 48000 : 0);
    setElecMisc(unit === "5+5" ? 1500 : 300);
    setInsurance(unit === "5+5" ? 17500 : 3500);
    setCapitalCost(newData.capitalCost);
    setBankLoan(newData.bankLoan);
    setMarginMoney(newData.marginMoney);
    setInterestRate(newData.interestRate);
    setCustomUnitSize(null);
  }, [unit]);

  // Update finance values when custom unit size changes
  useEffect(() => {
    if (customUnitSize === null || customUnitSize <= 0) return;

    const newData = getScaledData();
    setSeries([...newData.surplusYears]);
    setCapitalCost(newData.capitalCost);
    setBankLoan(newData.bankLoan);
    setMarginMoney(newData.marginMoney);

    // Scale labour, electricity, insurance based on custom size
    const scaleFactor = customUnitSize / scenarios[unit].animals;
    setLabour(Math.round((unit === "5+5" ? 48000 : 0) * scaleFactor));
    setElecMisc(Math.round((unit === "5+5" ? 1500 : 300) * scaleFactor));
    setInsurance(Math.round((unit === "5+5" ? 17500 : 3500) * scaleFactor));
  }, [customUnitSize, unit]);

  // Build baseline from defaultFeeding (compute rates from provided costs/qty)
  const baseline = useMemo(
    () =>
      defaultFeeding.map((f) => ({
        name: f.name,
        lactQty: f.qtyLactKg || 0,
        dryQty: f.qtyDryKg || 0,
        rateLact: f.qtyLactKg ? f.costLactPerDay / f.qtyLactKg : 0,
        rateDry: f.qtyDryKg ? f.costDryPerDay / f.qtyDryKg : 0,
      })),
    [],
  );

  // Keep feeding schedule synced with assumptions when enabled
  useEffect(() => {
    if (!syncFeeding) return;
    setFeedEntries(
      generateBaselineEntries(
        baseline,
        lactDays,
        dryDays,
        data.animals,
        lactMult,
        dryMult,
        animalWeightKg,
      ),
    );
  }, [syncFeeding, baseline, lactDays, dryDays, data.animals, lactMult, dryMult, animalWeightKg]);

  // Finance auto-balance: whenever inputs change, derive the selected target to keep identity
  useEffect(() => {
    if (autoTarget === "bankLoan") {
      setBankLoan(Math.max(0, capitalCost - marginMoney));
    } else if (autoTarget === "marginMoney") {
      setMarginMoney(Math.max(0, capitalCost - bankLoan));
    } else if (autoTarget === "capitalCost") {
      setCapitalCost(Math.max(0, bankLoan + marginMoney));
    }
  }, [capitalCost, marginMoney, bankLoan, autoTarget]);

  // Compute per-animal daily costs from the current schedule (two-way)
  const { lact: dailyLactCost, dry: dailyDryCost } = useMemo(
    () => computeDailyPerAnimalCosts(feedEntries),
    [feedEntries],
  );

  // Economics computed from current schedule and assumptions
  const computedYear = useMemo(() => {
    const animals = data.animals;
    const income = animals * yieldPerCowPerDay * milkPrice * lactDays;
    // Prefer row-wise exact computation, falls back to daily totals
    const feedCostFromRows = computeTotalFeedCost(feedEntries, {
      lactDays,
      dryDays,
      animals,
    });
    const feedCost = feedEntries.length > 0 ? feedCostFromRows : animals * (dailyLactCost * lactDays + dailyDryCost * dryDays);
    const vet = animals * vetPerAnimal;
    const recurring = feedCost + vet + labour + elecMisc + insurance;
    const net = income - recurring;
    return { income, recurring, net, feedCost };
  }, [data.animals, yieldPerCowPerDay, milkPrice, lactDays, dailyLactCost, dailyDryCost, dryDays, vetPerAnimal, labour, elecMisc, insurance, feedEntries]);

  // Sync 6-year series pattern to current net when enabled
  useEffect(() => {
    if (!syncSeries) return;
    const base = scenarios[unit].surplusYears;
    const base1 = base[0] || 1;
    const scaled = base.map((v) => (v / base1) * computedYear.net);
    setSeries(scaled);
  }, [syncSeries, unit, computedYear.net]);

  // Financial metrics from 6-year series and editable finance params
  const benefitsPV = useMemo(() => npv(discountRate, series, 0), [discountRate, series]);
  const recurringPV = useMemo(() => npv(discountRate, Array(6).fill(computedYear.recurring), 0), [discountRate, computedYear.recurring]);
  const costsPV = capitalCost + recurringPV;
  const npw = -capitalCost + benefitsPV - recurringPV;
  const irrValue = irr([-capitalCost, ...series]);

  const schedule = amortizationEqualPrincipal(bankLoan, interestRate, data.repaymentYears);

  const pieColors = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--secondary))",
    "hsl(var(--muted))",
  ];

  function buildExpenseData() {
    const animals = data.animals;
    const feedCostFromRows = computeTotalFeedCost(feedEntries, { lactDays, dryDays, animals });
    const feedCost = feedEntries.length > 0 ? feedCostFromRows : animals * (dailyLactCost * lactDays + dailyDryCost * dryDays);
    return [
      { name: "Feed", value: Math.max(0, Math.round(feedCost)) },
      { name: "Labour", value: Math.max(0, Math.round(labour)) },
      { name: "Vet", value: Math.max(0, Math.round(animals * vetPerAnimal)) },
      { name: "Elec & misc", value: Math.max(0, Math.round(elecMisc)) },
      { name: "Insurance", value: Math.max(0, Math.round(insurance)) },
    ];
  }

  return (
    <div className="dairy-background">
      <div className="dairy-background-pattern" />
      <CursorTrail />
      <AnimatedBackground />
      <div className="content-wrapper">
        <header className="header-section sticky top-0 z-10 border-b border-white/20">
          <div className="container flex items-center justify-between py-4">
            <div className="flex items-center gap-0">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F7c7dbb0a2f1c4022a91cbbd34629304e%2F95a4e1c9cf7147579764fee3518168ac?format=webp&width=800"
                alt="Dairy Unit Economics Logo"
                className="w-12 h-12 animate-float"
              />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dairy Unit Economics</h1>
                <p className="text-sm text-gray-700">Interactive unit-economics and loan calculator for dairy units</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2">
                <Button variant={unit === "1+1" && customUnitSize === null ? "default" : "outline"} onClick={() => { setUnit("1+1"); setCustomUnitSize(null); }}>Small (1+1)</Button>
                <Button variant={unit === "5+5" && customUnitSize === null ? "default" : "outline"} onClick={() => { setUnit("5+5"); setCustomUnitSize(null); }}>Mini (5+5)</Button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Custom:</label>
                <Input
                  type="number"
                  min="1"
                  value={customUnitSize ?? ""}
                  onChange={(e) => setCustomUnitSize(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Enter # of cows"
                  className="w-32 h-9"
                />
                <span className="text-xs text-gray-600 whitespace-nowrap">cows</span>
              </div>
            </div>
          </div>
        </header>

        <main className="container py-8 space-y-8 main-content">
        <AnimatedSection className="grid gap-4 md:grid-cols-4">
          <Kpi title="Capital Cost" value={`₹ ${formatCurrency(capitalCost)}`} />
          <Kpi title="Bank Loan" value={`₹ ${formatCurrency(bankLoan)}`} />
          <Kpi title="Margin Money" value={`₹ ${formatCurrency(marginMoney)}`} />
          <Kpi title="Interest Rate" value={`${(interestRate * 100).toFixed(0)}%`} />
        </AnimatedSection>

        <AnimatedSection className="w-full">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>

        {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 card-enhanced">
                <CardHeader>
                  <CardTitle>Project at a Glance</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <InfoRow label="Unit Size" value={customUnitSize ? `${customUnitSize} animals` : (unit === "5+5" ? "10 animals" : "2 animals")} />
                  <InfoRow label="Breed" value="Jersey / HF Crossbreds" />
                  <InfoRow label="State" value="Karnataka" />
                  <InfoRow label="Repayment Period" value={`${data.repaymentYears} years`} />
                  <InfoRow label="BCR @ 15%" value={`${(benefitsPV / costsPV).toFixed(2)} : 1`} />
                  <InfoRow label="NPW @ 15%" value={`₹ ${formatCurrency(npw)}`} />
                  <InfoRow label="IRR" value={irrValue !== null ? `${(irrValue * 100).toFixed(2)}%` : "-"} />
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Feeding Schedule (per animal)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Lactation/day</TableHead>
                        <TableHead className="text-right">Dry/day</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aggregatePerType(feedEntries).map((r) => (
                        <TableRow key={r.type}>
                          <TableCell>{r.type}</TableCell>
                          <TableCell className="text-right">₹ {formatCurrency(r.lactDailyCost)}</TableCell>
                          <TableCell className="text-right">₹ {formatCurrency(r.dryDailyCost)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell className="font-medium">Total</TableCell>
                        <TableCell className="text-right font-medium">₹ {formatCurrency(dailyLactCost)}</TableCell>
                        <TableCell className="text-right font-medium">₹ {formatCurrency(dailyDryCost)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Loan Repayment Schedule</CardTitle>
                </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Opening</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Principal</TableHead>
                      <TableHead className="text-right">Payment</TableHead>
                      <TableHead className="text-right">Closing</TableHead>
                      <TableHead className="text-right">Surplus after payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.map((row, i) => (
                      <TableRow key={row.year}>
                        <TableCell>{row.year}</TableCell>
                        <TableCell className="text-right">₹ {formatCurrency(row.opening)}</TableCell>
                        <TableCell className="text-right">₹ {formatCurrency(row.interest)}</TableCell>
                        <TableCell className="text-right">₹ {formatCurrency(row.principal)}</TableCell>
                        <TableCell className="text-right">₹ {formatCurrency(row.payment)}</TableCell>
                        <TableCell className="text-right">₹ {formatCurrency(row.closing)}</TableCell>
                        <TableCell className="text-right">₹ {formatCurrency((series[i] ?? series[0]) - row.payment)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

        {/* CALCULATOR */}
          <TabsContent value="calculator" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Assumptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <LabeledNumber label="Discount rate (%)" value={(discountRate * 100).toString()} onChange={(v) => setDiscountRate(Number(v) / 100)} step={0.1} />
                  <LabeledNumber label="Milk price (₹/L)" value={milkPrice} onChange={setMilkPrice} step={0.5} />
                  <LabeledNumber label="Yield per cow per day (L)" value={yieldPerCowPerDay} onChange={setYieldPerCowPerDay} step={0.1} />
                  <LabeledNumber label="Lactation days per animal" value={lactDays} onChange={setLactDays} />
                  <LabeledNumber label="Dry days per animal" value={dryDays} onChange={setDryDays} />
                  <LabeledNumber label="Animal weight (kg)" value={animalWeightKg} onChange={setAnimalWeightKg} step={10} />
                  <LabeledNumber label="Lactation feed multiplier" value={lactMult} onChange={setLactMult} step={0.1} />
                  <LabeledNumber label="Dry feed multiplier" value={dryMult} onChange={setDryMult} step={0.1} />
                  <LabeledNumber label="Labour (₹/yr)" value={labour} onChange={setLabour} step={500} />
                  <LabeledNumber label="Vet aid per animal (₹/yr)" value={vetPerAnimal} onChange={setVetPerAnimal} step={100} />
                  <LabeledNumber label="Electricity & misc (₹/yr)" value={elecMisc} onChange={setElecMisc} step={100} />
                  <LabeledNumber label="Insurance (₹/yr)" value={insurance} onChange={setInsurance} step={500} />
                </div>
              </CardContent>
            </Card>

            {/* Finance parameters (two-way binding, auto-balance) */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Finance Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <LabeledNumber label="Capital cost (₹)" value={capitalCost} onChange={(v) => setCapitalCost(Math.max(0, Number(v)))} step={1000} disabled={autoTarget === "capitalCost"} />
                  <LabeledNumber label="Margin money (₹)" value={marginMoney} onChange={(v) => setMarginMoney(Math.max(0, Number(v)))} step={1000} disabled={autoTarget === "marginMoney"} />
                  <LabeledNumber label="Bank loan (₹)" value={bankLoan} onChange={(v) => setBankLoan(Math.max(0, Number(v)))} step={1000} disabled={autoTarget === "bankLoan"} />
                  <LabeledNumber label="Interest rate (%)" value={(interestRate * 100).toString()} onChange={(v) => setInterestRate(Math.max(0, Number(v)) / 100)} step={0.1} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-balance target</label>
                  <div className="flex items-center gap-3">
                    <select
                      className="flex-1 h-10 rounded-md border bg-background px-3 text-sm"
                      value={autoTarget}
                      onChange={(e) => setAutoTarget(e.target.value as AutoBalanceTarget)}
                    >
                      <option value="bankLoan">Derive Bank loan = Capital - Margin</option>
                      <option value="marginMoney">Derive Margin = Capital - Loan</option>
                      <option value="capitalCost">Derive Capital = Margin + Loan</option>
                    </select>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">The selected field is calculated automatically from the other two.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feeding schedule editor controls the schedule used by the calculator (two-way binding) */}
            <FeedingScheduleEditor entries={feedEntries} setEntries={setFeedEntries} readOnly={syncFeeding} />
            <div className="flex flex-wrap items-center gap-3 -mt-2">
              <Button variant={syncFeeding ? "default" : "outline"} onClick={() => setSyncFeeding(true)}>Sync feeding with assumptions</Button>
              <Button variant={!syncFeeding ? "default" : "outline"} onClick={() => setSyncFeeding(false)}>Edit feeding manually</Button>
              <Button variant="ghost" onClick={() => setFeedEntries(generateBaselineEntries(baseline, lactDays, dryDays, data.animals, lactMult, dryMult, animalWeightKg))}>Reset feeding</Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 card-enhanced">
                <CardHeader>
                  <CardTitle>Annual Economics</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TR label="Animals" value={data.animals} />
                      <TR label="Milk income" value={`₹ ${formatCurrency(computedYear.income)}`} />
                      <TR label="Feed cost" value={`₹ ${formatCurrency(computedYear.feedCost)}`} />
                      <TR label="Vet aid" value={`₹ ${formatCurrency(data.animals * vetPerAnimal)}`} />
                      <TR label="Labour" value={`₹ ${formatCurrency(labour)}`} />
                      <TR label="Electricity & misc" value={`₹ ${formatCurrency(elecMisc)}`} />
                      <TR label="Insurance" value={`₹ ${formatCurrency(insurance)}`} />
                      <TR label="Recurring total" value={`₹ ${formatCurrency(computedYear.recurring)}`} />
                      <TR label="Net benefit" value={`₹ ${formatCurrency(computedYear.net)}`} highlight />
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Financial Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow label="Capital cost" value={`₹ ${formatCurrency(capitalCost)}`} />
                  <InfoRow label="PV of benefits" value={`₹ ${formatCurrency(benefitsPV)}`} />
                  <InfoRow label="PV of costs" value={`₹ ${formatCurrency(costsPV)}`} />
                  <InfoRow label="NPW" value={`₹ ${formatCurrency(npw)}`} />
                  <InfoRow label="BC Ratio" value={`${(benefitsPV / costsPV).toFixed(3)} : 1`} />
                  <InfoRow label="IRR" value={irrValue !== null ? `${(irrValue * 100).toFixed(2)}%` : "-"} />
                </CardContent>
              </Card>
            </div>

            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>6-Year Series {syncSeries ? "(synced)" : "(manual)"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Net benefit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {series.map((v, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="text-right">
                          {syncSeries ? (
                            <>₹ {formatCurrency(v)}</>
                          ) : (
                            <InlineNumber value={v} onChange={(nv) => setSeries((s) => s.map((x, j) => (j === i ? nv : x)))} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </AnimatedSection>
        </main>

        <footer className="footer-section">
          <AnimatedSection className="space-y-8">
            <ContactSection />
            <div className="border-t border-gray-300 pt-6 space-y-3">
              <p className="text-center text-sm">Finance parameters, feeding, and series are fully editable and linked across sections in real time.</p>
              <p className="text-center text-xs text-gray-600">© 2025 Dairy Unit Economics. All rights reserved by Rakshith Kumar D.</p>
            </div>
          </AnimatedSection>
        </footer>
        <GoToTopButton />
      </div>
    </div>
  );
}

function aggregatePerType(entries: FeedingEntry[]) {
  const map = new Map<string, { type: string; lactDailyCost: number; dryDailyCost: number }>();
  entries.forEach((e) => {
    const key = e.type.trim() || "Unknown";
    const cur = map.get(key) || { type: key, lactDailyCost: 0, dryDailyCost: 0 };
    const add = e.qtyPerAnimalPerDayKg * e.ratePerKg;
    if (e.phase === "lactation") cur.lactDailyCost += add;
    else cur.dryDailyCost += add;
    map.set(key, cur);
  });
  return Array.from(map.values());
}

function Kpi({ title, value }: { title: string; value: string }) {
  const getIcon = () => {
    switch (title) {
      case "Capital Cost":
        return <DollarSign className="w-6 h-6 text-green-600" />;
      case "Bank Loan":
        return <Landmark className="w-6 h-6 text-blue-600" />;
      case "Margin Money":
        return <TrendingUp className="w-6 h-6 text-orange-600" />;
      case "Interest Rate":
        return <Percent className="w-6 h-6 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="card-enhanced hover:scale-105 transform transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          {getIcon()}
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-white/30 bg-white/70 backdrop-blur-sm p-3 text-sm hover:bg-white/80 transition-colors">
      <span className="text-gray-700">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function TR({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <TableRow className={cn(highlight && "bg-accent/50 font-medium")}>
      <TableCell className="w-1/2">{label}</TableCell>
      <TableCell className="text-right">{value}</TableCell>
    </TableRow>
  );
}

function LabeledNumber({ label, value, onChange, step = 1, disabled = false }: { label: string; value: number | string; onChange: (v: number | string) => void; step?: number; disabled?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Input type="number" value={value as any} step={step} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function InlineNumber({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <Input
      className="h-9 w-40 text-right ml-auto"
      type="number"
      value={value}
      step={100}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
