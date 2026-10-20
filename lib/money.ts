/**
 * Money is always an integer number of pesewas (GH₵ 1 = 100 pesewas).
 * Only format for display; never do arithmetic on formatted strings or floats.
 */

export type Pesewas = number;

const CEDI_SIGN = "GH₵";

function assertPesewas(value: number): void {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError(`Money must be a whole number of pesewas, got ${value}`);
  }
}

function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Formats pesewas for display: 45000 → "GH₵ 450", 125050 → "GH₵ 1,250.50".
 * Whole cedi amounts drop the decimals; otherwise two decimals are shown.
 */
export function formatPesewas(pesewas: Pesewas): string {
  assertPesewas(pesewas);
  const sign = pesewas < 0 ? "-" : "";
  const abs = Math.abs(pesewas);
  const cedis = Math.floor(abs / 100);
  const rest = abs % 100;
  const whole = groupThousands(String(cedis));
  const decimals = rest === 0 ? "" : `.${String(rest).padStart(2, "0")}`;
  return `${sign}${CEDI_SIGN} ${whole}${decimals}`;
}

/** Multiplies a unit price by a quantity, keeping the result in whole pesewas. */
export function lineTotal(unitPrice: Pesewas, qty: number): Pesewas {
  assertPesewas(unitPrice);
  if (!Number.isSafeInteger(qty) || qty < 0) {
    throw new TypeError(`Quantity must be a non-negative whole number, got ${qty}`);
  }
  const total = unitPrice * qty;
  assertPesewas(total);
  return total;
}

/** Adds amounts in pesewas. */
export function sumPesewas(amounts: readonly Pesewas[]): Pesewas {
  return amounts.reduce((total, amount) => {
    assertPesewas(amount);
    const next = total + amount;
    assertPesewas(next);
    return next;
  }, 0);
}
