export function npv(rate: number, cashflows: number[], initial: number = 0): number {
  // cashflows: array of cash flows per period starting at period 1
  // initial: cash flow at t0 (often negative investment)
  let total = initial; // at t=0
  for (let t = 0; t < cashflows.length; t++) {
    total += cashflows[t] / Math.pow(1 + rate, t + 1);
  }
  return total;
}

export function irr(cashflows: number[], guess = 0.1): number | null {
  // cashflows includes t0 at index 0
  // Use Newton-Raphson with fallback to bisection on [-0.99, 10]
  const maxIter = 100;
  const tol = 1e-7;

  const f = (r: number) => {
    let v = 0;
    for (let t = 0; t < cashflows.length; t++) {
      v += cashflows[t] / Math.pow(1 + r, t);
    }
    return v;
  };

  const df = (r: number) => {
    let v = 0;
    for (let t = 1; t < cashflows.length; t++) {
      v += (-t * cashflows[t]) / Math.pow(1 + r, t + 1);
    }
    return v;
  };

  let r = guess;
  for (let i = 0; i < maxIter; i++) {
    const fr = f(r);
    const dfr = df(r);
    if (Math.abs(fr) < tol) return r;
    if (dfr === 0 || !isFinite(dfr)) break;
    const rNext = r - fr / dfr;
    if (!isFinite(rNext) || rNext <= -0.99) break;
    if (Math.abs(rNext - r) < tol) return rNext;
    r = rNext;
  }

  // Fallback: bisection
  let lo = -0.99;
  let hi = 10;
  let flo = f(lo);
  let fhi = f(hi);
  if (flo * fhi > 0) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fmid = f(mid);
    if (Math.abs(fmid) < tol) return mid;
    if (flo * fmid < 0) {
      hi = mid;
      fhi = fmid;
    } else {
      lo = mid;
      flo = fmid;
    }
  }
  return (lo + hi) / 2;
}

export function amortizationEqualPrincipal(
  principal: number,
  annualRate: number,
  years: number,
): { year: number; opening: number; interest: number; principal: number; payment: number; closing: number }[] {
  const schedule = [] as {
    year: number;
    opening: number;
    interest: number;
    principal: number;
    payment: number;
    closing: number;
  }[];
  const yearlyPrincipal = principal / years;
  let balance = principal;
  for (let y = 1; y <= years; y++) {
    const interest = balance * annualRate;
    const prin = y === years ? balance : yearlyPrincipal;
    const payment = interest + prin;
    const closing = balance - prin;
    schedule.push({ year: y, opening: balance, interest, principal: prin, payment, closing });
    balance = closing;
  }
  return schedule;
}
