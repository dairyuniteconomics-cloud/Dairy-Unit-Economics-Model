export type UnitType = "1+1" | "5+5";

export interface FeedingItem {
  name: string;
  priceLact: number; // Rs per kg (or unit)
  qtyLactKg: number;
  costLactPerDay: number;
  qtyDryKg: number;
  costDryPerDay: number;
}

export interface ScenarioData {
  animals: number;
  capitalCost: number;
  bankLoan: number;
  marginMoney: number;
  interestRate: number; // annual decimal
  repaymentYears: number;
  saleOfMilkYears: number[]; // Year 1..6
  recurringCostYears: number[]; // Year 1..6
  surplusYears: number[]; // Year 1..6
  lactationDays: number;
  dryDays: number;
  feeding: FeedingItem[];
}

export const defaultFeeding: FeedingItem[] = [
  {
    name: "Concentrate Feed",
    priceLact: 20,
    qtyLactKg: 5,
    costLactPerDay: 100,
    qtyDryKg: 2,
    costDryPerDay: 40,
  },
  {
    name: "Green Fodder",
    priceLact: 1,
    qtyLactKg: 25,
    costLactPerDay: 25,
    qtyDryKg: 15,
    costDryPerDay: 15,
  },
  {
    name: "Dry Fodder",
    priceLact: 2,
    qtyLactKg: 5,
    costLactPerDay: 10,
    qtyDryKg: 5,
    costDryPerDay: 10,
  },
];

export const scenarios: Record<UnitType, ScenarioData> = {
  "1+1": {
    animals: 2,
    capitalCost: 105000,
    bankLoan: 94000,
    marginMoney: 11000,
    interestRate: 0.12,
    repaymentYears: 5,
    saleOfMilkYears: [117000, 146900, 146900, 144300, 137800, 137800],
    recurringCostYears: [69225, 92800, 92800, 92100, 90350, 90350],
    surplusYears: [48265, 54730, 54730, 52830, 48060, 48060],
    lactationDays: 305, // from chart per animal
    dryDays: 305, // for convenience per unit year in provided table
    feeding: defaultFeeding,
  },
  "5+5": {
    animals: 10,
    capitalCost: 600000,
    bankLoan: 450000,
    marginMoney: 150000,
    interestRate: 0.12,
    repaymentYears: 5,
    saleOfMilkYears: [585000, 734500, 734500, 721500, 689000, 689000],
    recurringCostYears: [394125, 512000, 512000, 508500, 499750, 499750],
    surplusYears: [193315, 225655, 225655, 216125, 192300, 192300],
    lactationDays: 3050,
    dryDays: 3050,
    feeding: defaultFeeding,
  },
};

export function dailyFeedCost(feeding: FeedingItem[], lactation: boolean): number {
  return feeding.reduce((sum, f) => sum + (lactation ? f.costLactPerDay : f.costDryPerDay), 0);
}
